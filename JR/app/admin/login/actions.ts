"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  success: boolean;
  message: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      success: false,
      message: "Vui lòng nhập đầy đủ email và mật khẩu.",
    };
  }

  // Dùng client anon key để session được lưu vào cookie đúng chuẩn,
  // middleware và các trang admin sau đó sẽ nhận diện được người dùng.
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: "Email hoặc mật khẩu không đúng." };
  }

  // Đăng nhập thành công -> chuyển vào trang thông tin cá nhân
  redirect("/admin/dashboard");
}
