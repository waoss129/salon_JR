"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { normalizeVietnamesePhone } from "@/lib/utils/phone";

/**
 * Đăng nhập khách hàng bằng SĐT thay vì email.
 *
 * Cố ý dùng 1 thông báo lỗi DUY NHẤT cho cả 2 trường hợp "không tìm thấy
 * SĐT" và "sai mật khẩu" — không phân biệt rõ để tránh lộ thông tin SĐT
 * nào đã đăng ký hay chưa (kiểu tấn công dò số điện thoại - phone
 * enumeration). Đây là lý do cả 2 nhánh lỗi bên dưới đều throw cùng 1 câu.
 */
const GENERIC_LOGIN_ERROR = "Số điện thoại hoặc mật khẩu không chính xác.";

export async function loginWithPhone(phone: string, password: string) {
  if (!phone.trim() || !password) {
    throw new Error("Vui lòng nhập số điện thoại và mật khẩu");
  }

  let normalizedPhone: string;
  try {
    normalizedPhone = normalizeVietnamesePhone(phone);
  } catch {
    throw new Error(GENERIC_LOGIN_ERROR);
  }

  // Tra email tương ứng bằng service role — KHÔNG dùng client thường vì
  // lúc này khách chưa đăng nhập (anon), không thể tự do SELECT bảng
  // profiles của người khác qua RLS (và cũng không nên mở policy anon
  // đọc profiles chỉ để phục vụ 1 lần tra cứu này).
  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("email")
    .eq("phone", normalizedPhone)
    .maybeSingle();

  if (!profile?.email) {
    throw new Error(GENERIC_LOGIN_ERROR);
  }

  // Đăng nhập thật bằng client phiên đăng nhập bình thường (không phải
  // service role) — để Supabase tự set cookie phiên đúng chuẩn.
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password,
  });

  if (error) {
    throw new Error(GENERIC_LOGIN_ERROR);
  }

  // Kiểm tra tài khoản có bị khoá không, giữ nguyên logic cũ
  const { data: customer } = await supabase
    .from("customers")
    .select("status")
    .eq("id", data.user.id)
    .single();

  if (customer?.status === "banned") {
    await supabase.auth.signOut();
    throw new Error(
      "Tài khoản của bạn đã bị khoá, vui lòng liên hệ JoyRide để được hỗ trợ",
    );
  }
}
