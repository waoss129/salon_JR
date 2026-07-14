"use server";

import { createAdminAuthClient } from "@/lib/supabase/server";
import { ROLE } from "@/lib/supabase/permissions";

export async function getCurrentEmail(): Promise<string | null> {
  const supabase = await createAdminAuthClient();
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
  const supabase = await createAdminAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Bạn cần đăng nhập lại." };
  }

  // Chỉ Admin (role 1) được đổi email — kể cả email của chính mình.
  // Lý do: nhân viên các role khác tự đổi dễ gây nhầm lẫn / mất quyền
  // đăng nhập (xem thảo luận về phân quyền).
  const { data: employee } = await supabase
    .from("employees")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (employee?.role_id !== ROLE.ADMIN) {
    return {
      success: false,
      message:
        "Chỉ Admin mới được phép đổi email. Vui lòng liên hệ Admin nếu cần đổi email.",
    };
  }

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
  const supabase = await createAdminAuthClient();

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
