"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SecurityPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const handleUpdateEmail = async () => {
    setEmailError(null);
    setEmailSuccess(null);
    if (!email) {
      setEmailError("Vui lòng nhập email mới");
      return;
    }

    setLoadingEmail(true);
    const { error } = await supabase.auth.updateUser({ email });
    setLoadingEmail(false);

    if (error) {
      setEmailError(error.message);
    } else {
      setEmailSuccess(
        "Đã gửi yêu cầu đổi email! Vui lòng kiểm tra hộp thư cũ và mới để xác nhận.",
      );
      setEmail("");
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError("Vui lòng nhập mật khẩu hiện tại");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu nhập lại không khớp");
      return;
    }

    setLoadingPassword(true);

    // Xác thực lại mật khẩu hiện tại trước khi cho đổi, tránh trường hợp
    // ai đó dùng session còn đăng nhập của người khác để chiếm tài khoản
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      setPasswordError("Không xác định được tài khoản, vui lòng đăng nhập lại");
      setLoadingPassword(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (verifyError) {
      setPasswordError("Mật khẩu hiện tại không đúng");
      setLoadingPassword(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoadingPassword(false);

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Đổi Email */}
      <div className="space-y-2 pb-6 border-b border-stone-100">
        <label className="text-sm font-bold text-stone-700">Email mới</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email mới..."
          className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
        {emailError && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-3">
            {emailError}
          </p>
        )}
        {emailSuccess && (
          <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg p-3">
            {emailSuccess}
          </p>
        )}
        <button
          onClick={handleUpdateEmail}
          disabled={loadingEmail}
          className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {loadingEmail ? "Đang xử lý..." : "Cập nhật email"}
        </button>
      </div>

      {/* Đổi Mật khẩu */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-stone-700">
          Mật khẩu hiện tại
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Nhập mật khẩu hiện tại..."
          className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="text-sm font-bold text-stone-700 pt-2 block">
          Mật khẩu mới
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nhập mật khẩu mới..."
          className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="text-sm font-bold text-stone-700 pt-2 block">
          Nhập lại mật khẩu mới
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Nhập lại mật khẩu mới..."
          className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />

        {passwordError && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-3">
            {passwordError}
          </p>
        )}
        {passwordSuccess && (
          <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg p-3">
            {passwordSuccess}
          </p>
        )}

        <button
          onClick={handleUpdatePassword}
          disabled={loadingPassword}
          className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {loadingPassword ? "Đang xử lý..." : "Cập nhật mật khẩu"}
        </button>
      </div>
    </div>
  );
}
