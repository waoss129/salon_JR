"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SecurityPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // 1. Hàm cập nhật Email
  const handleUpdateEmail = async () => {
    if (!email) return alert("Vui lòng nhập email mới");

    setLoadingEmail(true);
    const { error } = await supabase.auth.updateUser({ email });
    setLoadingEmail(false);

    if (error) {
      alert("Lỗi cập nhật email: " + error.message);
    } else {
      alert(
        "Đã gửi yêu cầu đổi email! Vui lòng kiểm tra hộp thư cũ và mới để xác nhận.",
      );
      setEmail("");
    }
  };

  // 2. Hàm cập nhật Mật khẩu
  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoadingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoadingPassword(false);

    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      alert("Đổi mật khẩu thành công!");
      setNewPassword("");
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
        <label className="text-sm font-bold text-stone-700">Mật khẩu mới</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nhập mật khẩu mới..."
          className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleUpdatePassword}
          disabled={loadingPassword}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {loadingPassword ? "Đang xử lý..." : "Cập nhật mật khẩu"}
        </button>
      </div>
    </div>
  );
}
