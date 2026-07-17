"use server";

import { createAdminClient } from "@/lib/supabase/server";

type TokenRow = {
  employee_id: string;
  expires_at: string;
  used_at: string | null;
};

/**
 * Toàn bộ luồng kích hoạt xảy ra TRƯỚC KHI nhân viên có phiên đăng nhập
 * (họ chưa từng login được, vì chưa có email/mật khẩu thật) — nên mọi
 * thao tác ở đây bắt buộc dùng service role client, không thể dùng
 * createClient() (client phiên đăng nhập bình thường, sẽ luôn là 'anon'
 * và bị RLS chặn, kể cả các bảng vốn không định cho anon động vào).
 * Bản thân "token còn hợp lệ" chính là bằng chứng ủy quyền ở đây, thay
 * cho việc có phiên đăng nhập.
 */
async function loadValidToken(token: string): Promise<TokenRow> {
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("employee_activation_tokens")
    .select("employee_id, expires_at, used_at")
    .eq("token", token)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Link kích hoạt không hợp lệ");
  if (data.used_at) throw new Error("Link kích hoạt này đã được sử dụng");
  if (new Date(data.expires_at) < new Date())
    throw new Error("Link kích hoạt đã hết hạn");

  return data;
}

/**
 * Dùng để hiển thị họ tên nhân viên trên trang kích hoạt (xác nhận đúng người)
 * trước khi họ nhập email/mật khẩu.
 */
export async function getActivationInfo(token: string) {
  const tokenRow = await loadValidToken(token);
  const adminClient = createAdminClient();

  const { data: profile, error } = await adminClient
    .from("profiles")
    .select("fullname")
    .eq("id", tokenRow.employee_id)
    .single();

  if (error) throw new Error(error.message);
  return { fullname: profile.fullname as string };
}

/**
 * Gán email thật + mật khẩu thật vào tài khoản đã được admin tạo sẵn,
 * khoá email lại vĩnh viễn, đánh dấu token đã dùng.
 */
export async function activateAccount(input: {
  token: string;
  email: string;
  password: string;
}) {
  if (!input.email.trim() || !input.password) {
    throw new Error("Vui lòng nhập đầy đủ email và mật khẩu");
  }
  if (input.password.length < 8) {
    throw new Error("Mật khẩu phải có ít nhất 8 ký tự");
  }

  const tokenRow = await loadValidToken(input.token);
  const adminClient = createAdminClient();

  // Gán email/mật khẩu thật vào auth.users đã tạo sẵn từ lúc admin thêm nhân viên
  const { error: authError } = await adminClient.auth.admin.updateUserById(
    tokenRow.employee_id,
    {
      email: input.email.trim(),
      password: input.password,
      email_confirm: true,
    },
  );

  if (authError) {
    // Lỗi phổ biến nhất: email đã được dùng cho tài khoản khác
    throw new Error(authError.message);
  }

  // Cập nhật + khoá email trong profiles (trigger DB sẽ chặn mọi lần sửa sau này)
  const { error: profileError } = await adminClient
    .from("profiles")
    .update({ email: input.email.trim(), email_locked: true })
    .eq("id", tokenRow.employee_id);

  if (profileError) throw new Error(profileError.message);

  // Đánh dấu token đã dùng, không thể dùng lại
  const { error: tokenError } = await adminClient
    .from("employee_activation_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token", input.token);

  if (tokenError) throw new Error(tokenError.message);
}
