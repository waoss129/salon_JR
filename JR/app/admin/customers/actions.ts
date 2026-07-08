"use server";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCustomer(formData: FormData) {
  const supabase = await createAdminClient();

  const email = ((formData.get("email") as string) || "").trim();
  const fullname = ((formData.get("fullname") as string) || "").trim();
  const phone = ((formData.get("phone") as string) || "").trim();
  const genderRaw = formData.get("gender");
  const gender = genderRaw ? (genderRaw as string).trim() : null;

  // 1. Tạo User trong Auth
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: email,
      password: "Password123!",
      email_confirm: true,
      user_metadata: { full_name: fullname },
    });

  if (authError) throw authError;

  // 2. Update Profile: Dùng .upsert thay vì .update để đảm bảo nếu trigger
  // chưa kịp tạo profile thì lệnh này vẫn hoạt động mà không bị lỗi
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: authData.user.id,
    fullname,
    phone,
    gender,
    email,
  });

  if (profileError) throw profileError;

  // 3. Đảm bảo bảng customers có bản ghi
  const { error: custError } = await supabase
    .from("customers")
    .upsert({ id: authData.user.id, status: "active" });

  if (custError) throw custError;

  revalidatePath("/admin/customers");
}
export async function updateCustomer(id: string, formData: FormData) {
  const supabase = await createAdminClient();

  // ÉP DỮ LIỆU TỪ FORM - Đảm bảo tên 'name' trong input khớp với đây
  const updateData = {
    fullname: formData.get("fullname") as string,
    phone: formData.get("phone") as string,
    gender: formData.get("gender") as string,
    address: formData.get("address") as string,
    dob: (formData.get("dob") as string) || null,
  };

  console.log("Dữ liệu đang gửi đi:", updateData); // Kiểm tra log này trong Terminal

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", id);

  if (error) throw error;
  revalidatePath(`/admin/customers/${id}`);
}
export async function updateCustomerStatus(id: string, status: string) {
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("customers")
    .update({ status })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/customers");
}
export async function deleteCustomer(id: string) {
  const supabase = await createAdminClient();

  // Xóa bản ghi trong bảng customers
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/customers");
}
