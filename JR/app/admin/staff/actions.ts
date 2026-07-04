"use server";
import { createAdminClient } from "@/lib/supabase/server";

export async function addStaff(formData: FormData, roleId: number) {
  const supabase = await createAdminClient();

  const email = (formData.get("email") as string).trim();
  const password = "Password123!";
  const fullname = (formData.get("fullname") as string).trim();
  const phone = (formData.get("phone") as string).trim();
  const gender = (formData.get("gender") as string).trim();

  // 1. TẠO AUTH USER (Bước này chắc chắn tạo ra user trong Authentication)
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: fullname }, // Truyền tên vào đây
    });

  if (authError) throw authError;

  // 2. CHÈN VÀO PROFILES (Dùng ID vừa tạo từ bước 1)
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ fullname, phone, gender })
    .eq("id", authData.user.id);

  if (profileError) throw profileError;

  // 3. CHÈN VÀO EMPLOYEES
  const { error: empError } = await supabase.from("employees").insert({
    id: authData.user.id,
    role_id: roleId,
    status: "active",
  });

  if (empError) throw empError;
}
