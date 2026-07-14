"use server";
import {
  createAdminClient,
  createAdminAuthClient,
} from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ROLE } from "@/lib/supabase/permissions";

// Hàm hỗ trợ làm sạch dữ liệu
const cleanData = (val: any) =>
  val === "" || val === undefined || val === null ? null : val;

const STAFF_MANAGER_ROLE_IDS: number[] = [ROLE.ADMIN, ROLE.CEO, ROLE.MANAGER];

// ============================================================
// QUAN TRỌNG: createAdminClient() dùng SERVICE ROLE KEY, BỎ QUA HOÀN TOÀN
// RLS của Postgres. Vì vậy MỌI hàm bên dưới PHẢI tự gọi hàm này để kiểm tra
// quyền trước khi đọc/ghi bất kỳ dữ liệu nào — không có tầng bảo vệ nào
// khác đứng sau lưng cả. Dùng createAdminAuthClient() (bám session, có RLS)
// chỉ để xác định CHÍNH XÁC ai đang gọi, không dùng nó để đọc/ghi dữ liệu
// staff (vì mục đích của các hàm này là thao tác vượt qua RLS thông thường).
// ============================================================
async function requireStaffManager(): Promise<number> {
  const authClient = await createAdminAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    throw new Error("Bạn cần đăng nhập lại.");
  }

  const { data: employee } = await authClient
    .from("employees")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (!employee || !STAFF_MANAGER_ROLE_IDS.includes(employee.role_id)) {
    throw new Error("Bạn không có quyền quản lý nhân viên.");
  }

  return employee.role_id as number;
}

export async function addStaff(formData: FormData, roleId: number) {
  await requireStaffManager();

  const supabase = await createAdminClient();
  const email = (formData.get("email") as string)?.trim();
  const fullname = formData.get("fullname") as string;
  const gender = formData.get("gender") as string;
  const phone = formData.get("phone") as string;

  const { data: userId, error: authError } = await supabase.rpc(
    "create_user_admin",
    {
      new_email: email,
      new_password: "password123",
      new_fullname: fullname,
      is_staff: true,
    },
  );

  if (authError) {
    console.error("LỖI SQL RPC:", authError);
    throw new Error("Không thể tạo User: " + authError.message);
  }

  // Trigger đã tự tạo profiles (id, email, fullname) -> chỉ cần update thêm
  // gender/phone + đánh dấu bắt buộc đổi mật khẩu ở lần đăng nhập đầu tiên
  // (vì mật khẩu tạo mới luôn là "password123" — không nên để ai giữ mãi).
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ gender, phone, must_change_password: true })
    .eq("id", userId);

  if (profileError) {
    console.error("LỖI UPDATE PROFILES:", profileError);
    throw new Error(
      "Không thể cập nhật thông tin cá nhân: " + profileError.message,
    );
  }

  const { error: empError } = await supabase
    .from("employees")
    .insert([{ id: userId, role_id: roleId, status: "active" }]);

  if (empError) {
    console.error("LỖI INSERT EMPLOYEES:", empError);
    throw new Error("Không thể tạo nhân viên: " + empError.message);
  }

  revalidatePath("/admin/staff");
}

export async function updateStaff(id: string, formData: FormData) {
  const currentRoleId = await requireStaffManager();

  const supabase = await createAdminClient();

  //lay file tu FormData
  const file = formData.get("avatar") as File | null;
  let avatarUrl = null;

  //kiem tra file hop le: file phai la instance cua File va co size > 0
  if (file && file instanceof File && file.size > 0) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw new Error(`Lỗi upload ảnh: ${uploadError.message}`);

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    avatarUrl = data.publicUrl;
  }

  const newEmail = formData.get("email") as string;

  // 1. Lấy dữ liệu cũ
  const { data: oldData } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", id)
    .single();

  // 2. Xử lý Email qua RPC nếu có thay đổi — CHỈ ADMIN (role 1) được phép,
  // kể cả khi người gọi đã qua được requireStaffManager() ở trên (CEO/Manager
  // được quản lý nhân viên nói chung, nhưng KHÔNG được đổi email).
  if (oldData && newEmail !== oldData.email) {
    if (currentRoleId !== ROLE.ADMIN) {
      throw new Error("Chỉ Admin mới được phép đổi email của nhân viên.");
    }

    const { error: emailError } = await supabase.rpc("update_user_email_rpc", {
      uid: id,
      new_email: newEmail,
    });
    if (emailError) throw new Error(`Lỗi đổi Email: ${emailError.message}`);

    await supabase.from("profiles").update({ email: newEmail }).eq("id", id);
  }

  // 3. Cập nhật Profile
  const profileUpdates: any = {
    fullname: cleanData(formData.get("fullname")),
    gender: cleanData(formData.get("gender")),
    phone: cleanData(formData.get("phone")),
    dob: cleanData(formData.get("dob")),
    address: cleanData(formData.get("address")),
  };

  // Chỉ cập nhật avatar vào DB nếu có ảnh mới được upload
  if (avatarUrl) {
    profileUpdates.avatar = avatarUrl;
  }

  const { error: profError } = await supabase
    .from("profiles")
    .update(profileUpdates)
    .eq("id", id);

  if (profError)
    throw new Error(`Không thể cập nhật profile: ${profError.message}`);

  // 4. Cập nhật Employee
  const { error: empError } = await supabase
    .from("employees")
    .update({
      joined_at: cleanData(formData.get("joined_at")),
      certificate_name: cleanData(formData.get("certificate_name")),
      level: cleanData(formData.get("level")),
    })
    .eq("id", id);

  if (empError) throw new Error("Không thể cập nhật thông tin cá nhân");

  revalidatePath(`/admin/staff/details/${id}`);
  revalidatePath("/admin/staff");
}

export async function updateStaffStatus(id: string, status: string) {
  await requireStaffManager();

  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("employees")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteStaff(id: string) {
  await requireStaffManager();

  const supabase = await createAdminClient();
  // Xóa trực tiếp trong auth.users (với quyền service_role)
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) throw error;
}
