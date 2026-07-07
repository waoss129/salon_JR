"use server";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addStaff(formData: FormData, roleId: number) {
  const supabase = await createAdminClient();

  const email = (formData.get("email") as string)?.trim();
  console.log("DEBUG EMAIL NHẬN ĐƯỢC:", email);
  if (!email || !email.includes("@")) {
    throw new Error("Email không hợp lệ hoặc bị thiếu!");
  }
  const fullname = formData.get("fullname") as string;
  const gender = formData.get("gender") as string;
  const phone = formData.get("phone") as string;

  // 1. Tạo user trong auth.users
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: email,
      password: "password123", // Mật khẩu tạm thời
      email_confirm: true,
    });
  if (authError) throw authError;

  const userId = authData.user!.id;

  // 2. Insert vào profiles
  await supabase
    .from("profiles")
    .insert([{ id: userId, fullname, email, gender, phone }]);

  // 3. Insert vào employees
  await supabase
    .from("employees")
    .insert([{ id: userId, role_id: roleId, status: "active" }]);

  revalidatePath("/admin/staff"); // Load lại danh sách sau khi thêm
}
export async function updateStaff(id: string, formData: FormData) {
  const supabase = await createAdminClient();
  const cleanData = (val: any) => (val === "" ? null : val);

  const newEmail = formData.get("email") as string;
  // 1. Lấy dữ liệu cũ để so sánh email
  const { data: oldData } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", id)
    .single();

  // 2. Xử lý Email

  if (oldData && newEmail !== oldData.email) {
    // Cập nhật email trong bảng auth.users
    // const { data: updatedUser, error: emailError } =
    //   await supabase.auth.admin.updateUserById(id, {
    //     email: newEmail,
    //   });

    //su dung service_role key de co quyen admin
    const { error: emailError } = await supabase.auth.admin.updateUserById(id, {
      email: newEmail,
    });
    if (emailError) {
      // SỬA Ở ĐÂY: Ghi log chi tiết và hiển thị thông báo lỗi đầy đủ
      console.error("CHI TIẾT LỖI AUTH:", JSON.stringify(emailError, null, 2));
      throw new Error(
        `Lỗi đổi Email: ${emailError.message || JSON.stringify(emailError)}`,
      );
    }

    // CẬP NHẬT THÊM: Đồng bộ email sang bảng profiles
    await supabase.from("profiles").update({ email: newEmail }).eq("id", id);
  }

  const genderInput = formData.get("gender") as string;
  const genderValue = cleanData(genderInput);
  //let genderValue = null;

  // if (genderInput === "Nam") genderValue = "male";
  // else if (genderInput === "Nữ") genderValue = "female";
  // Nếu muốn thêm other/prefer_not_to_say thì thêm ở đây
  // 1. Cập nhật Profile
  // SỬA: Đảm bảo gán đúng tên biến error từ Supabase
  const { error: profError } = await supabase
    .from("profiles")
    .update({
      fullname: cleanData(formData.get("fullname")),
      gender: genderValue, //dung bien da chuyen doi
      phone: cleanData(formData.get("phone")),
      dob: cleanData(formData.get("dob")),
      address: cleanData(formData.get("address")),
    })
    .eq("id", id);

  if (profError) {
    throw new Error(`Không thể cập nhật: ${profError.message}`);
  }
  // 2. Cập nhật Employee
  const { error: empError } = await supabase
    .from("employees")
    .update({
      joined_at: cleanData(formData.get("joined_at")),
      certificate_name: cleanData(formData.get("certificate_name")),
      level: cleanData(formData.get("level")),
    })
    .eq("id", id);

  if (empError) {
    console.error("LỖI UPDATE EMPLOYEES:", empError);
    throw new Error("Không thể cập nhật thông tin cá nhân");
  }

  // Đảm bảo bạn đang revalidate chính xác trang mà bạn đang đứng
  revalidatePath(`/admin/staff/details/${id}`);
  // Nếu trang danh sách nhân viên cũng bị cache, hãy thêm:
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
  // Xóa user trong auth thì dữ liệu ở profiles và employees sẽ tự xóa
  // (nếu bạn bật Cascade Delete trong Supabase)
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) throw error;
}
