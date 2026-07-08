"use server";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Hàm hỗ trợ làm sạch dữ liệu
const cleanData = (val: any) =>
  val === "" || val === undefined || val === null ? null : val;

export async function addStaff(formData: FormData, roleId: number) {
  const supabase = await createAdminClient();
  const email = (formData.get("email") as string)?.trim();
  const fullname = formData.get("fullname") as string;
  const gender = formData.get("gender") as string;
  const phone = formData.get("phone") as string;

  // 1. Tạo user qua SQL RPC (Bypass Auth Service)
  const { data: userId, error: authError } = await supabase.rpc(
    "create_user_admin",
    {
      new_email: email,
      new_password: "password123",
    },
  );

  if (authError) {
    console.error("LỖI SQL RPC:", authError);
    throw new Error("Không thể tạo User: " + authError.message);
  }

  // 2. Insert vào profiles
  await supabase
    .from("profiles")
    .insert([{ id: userId, fullname, email, gender, phone }]);

  // 3. Insert vào employees
  await supabase
    .from("employees")
    .insert([{ id: userId, role_id: roleId, status: "active" }]);

  revalidatePath("/admin/staff");
}

export async function updateStaff(id: string, formData: FormData) {
  const supabase = await createAdminClient();

  const newEmail = formData.get("email") as string;

  // 1. Lấy dữ liệu cũ
  const { data: oldData } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", id)
    .single();

  // 2. Xử lý Email qua RPC nếu có thay đổi
  if (oldData && newEmail !== oldData.email) {
    const { error: emailError } = await supabase.rpc("update_user_email_rpc", {
      uid: id,
      new_email: newEmail,
    });
    if (emailError) throw new Error(`Lỗi đổi Email: ${emailError.message}`);

    await supabase.from("profiles").update({ email: newEmail }).eq("id", id);
  }

  // 3. Cập nhật Profile
  const { error: profError } = await supabase
    .from("profiles")
    .update({
      fullname: cleanData(formData.get("fullname")),
      gender: cleanData(formData.get("gender")),
      phone: cleanData(formData.get("phone")),
      dob: cleanData(formData.get("dob")),
      address: cleanData(formData.get("address")),
    })
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
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("employees")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteStaff(id: string) {
  const supabase = await createAdminClient();
  // Xóa trực tiếp trong auth.users (với quyền service_role)
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) throw error;
}
