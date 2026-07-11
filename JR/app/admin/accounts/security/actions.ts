"use server";

import { createClient } from "lib/supabase/server";

export async function getCurrentEmail(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? null;
}

export type SecurityState = {
  success: boolean;
  message: string;
};

export async function updateEmail(
  _prevState: SecurityState,
  formData: FormData,
): Promise<SecurityState> {
  const supabase = await createClient();
  const newEmail = String(formData.get("email") ?? "").trim();

  if (!newEmail) {
    return { success: false, message: "Email không được để trống." };
  }

  // Supabase sẽ gửi email xác nhận tới cả email cũ và email mới
  const { error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) {
    return {
      success: false,
      message: `Cập nhật email thất bại: ${error.message}`,
    };
  }

  return {
    success: true,
    message:
      "Đã gửi email xác nhận. Vui lòng kiểm tra hộp thư để hoàn tất thay đổi.",
  };
}

export async function updatePassword(
  _prevState: SecurityState,
  formData: FormData,
): Promise<SecurityState> {
  const supabase = await createClient();

  const newPassword = String(formData.get("new_password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (newPassword.length < 8) {
    return { success: false, message: "Mật khẩu mới phải có ít nhất 8 ký tự." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "Mật khẩu xác nhận không khớp." };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return {
      success: false,
      message: `Đổi mật khẩu thất bại: ${error.message}`,
    };
  }

  return { success: true, message: "Đổi mật khẩu thành công." };
}
