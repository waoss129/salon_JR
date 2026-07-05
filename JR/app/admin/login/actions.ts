"use server";
import { createAdminClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createAdminClient();

  // 1. GỌI SUPABASE ĐỂ CHECK LOGIN THẬT
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error("Email hoặc mật khẩu không đúng!");

  // 2. NẾU LOGIN THÀNH CÔNG, LÚC NÀY MỚI CẤP COOKIE
  // Supabase đã tự quản lý session qua Cookie rồi, bạn không cần tự set thủ công nữa
  return { success: true };
}
