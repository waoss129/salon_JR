"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SecurityPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateAccount = async () => {
    setLoading(true);

    // Cập nhật Email hoặc Password (có thể thực hiện đồng thời hoặc tách riêng)
    const { error } = await supabase.auth.updateUser({
      email: email || undefined,
      password: newPassword || undefined,
    });

    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      alert(
        "Đã gửi yêu cầu cập nhật! Vui lòng kiểm tra email của bạn nếu bạn đã đổi email.",
      );
      setEmail("");
      setNewPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-stone-100">
      <h2 className="text-2xl font-bold text-stone-800 mb-6">
        Tài khoản & Bảo mật
      </h2>

      <div className="space-y-6">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-500 uppercase">
            Email đăng nhập
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="example@gmail.com"
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-500 uppercase">
            Mật khẩu mới
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleUpdateAccount}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Lưu thay đổi bảo mật"}
        </button>
      </div>
    </div>
  );
}
