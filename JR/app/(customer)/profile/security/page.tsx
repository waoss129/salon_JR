"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SecurityPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Hàm cập nhật Email
  const handleUpdateEmail = async () => {
    if (!email) return alert("Vui lòng nhập email mới");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ email: email });
    if (error) alert("Lỗi cập nhật email: " + error.message);
    else
      alert("Đã gửi yêu cầu đổi email! Vui lòng kiểm tra hộp thư cũ và mới.");
    setLoading(false);
  };

  // 2. Hàm cập nhật Mật khẩu
  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);
    // Hàm này trực tiếp thay đổi mật khẩu của user đang đăng nhập
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      alert("Đổi mật khẩu thành công!");
      setNewPassword(""); // Xóa trắng ô input sau khi xong
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-stone-700">Mật khẩu mới</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nhập mật khẩu mới..."
          className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleUpdatePassword}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
      >
        {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
      </button>
    </div>
  );
}
