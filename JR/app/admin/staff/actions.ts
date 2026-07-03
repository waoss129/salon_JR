"use server";
import { createClient } from "@supabase/supabase-js";

export async function addStaff(formData: FormData) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  let userId: string;

  // 1. Cố gắng tạo user
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: formData.get("email") as string,
      password: "Password123!",
      email_confirm: true,
    });

  if (authError) {
    if (authError.message.includes("already been registered")) {
      // Nếu trùng email, lấy ID của người dùng đó ra
      const { data: userData } = await supabase.auth.admin.listUsers();
      const existingUser = userData.users.find(
        (u) => u.email === formData.get("email"),
      );
      if (!existingUser) throw new Error("Không tìm thấy user cũ!");
      userId = existingUser.id;
    } else {
      throw authError;
    }
  } else {
    userId = authData.user.id;
  }

  // 2. Insert hoặc Update Profile (Dùng upsert để tránh lỗi trùng ID)
  const { error: pError } = await supabase.from("profiles").upsert({
    id: userId,
    fullname: formData.get("fullname"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    gender: formData.get("gender"),
  });

  if (pError) throw pError;

  // 3. Insert Employee
  const { error: eError } = await supabase.from("employees").upsert({
    id: userId,
    role_id: parseInt(formData.get("role_id") as string, 10),
    status: "active",
  });

  if (eError) throw eError;
}
