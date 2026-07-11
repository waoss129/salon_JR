"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

// Hàm chuyển đổi thông báo lỗi đăng nhập sang Tiếng Việt
const getVietnameseLoginError = (message: string): string => {
  const msg = message.toLowerCase();
  if (msg.includes("invalid login credentials")) {
    return "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.";
  }
  if (msg.includes("email not confirmed")) {
    return "Tài khoản chưa được xác nhận Email. Vui lòng kiểm tra hộp thư của bạn.";
  }
  if (msg.includes("network error") || msg.includes("failed to fetch")) {
    return "Lỗi kết nối mạng. Không thể liên kết với máy chủ.";
  }
  return `Đăng nhập không thành công: ${message}`;
};

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Hiển thị thông báo lỗi bằng Tiếng Việt thân thiện
      alert(getVietnameseLoginError(error.message));
    } else {
      console.log("Đăng nhập thành công", data.session);

      // THAY THẾ router.push BẰNG window.location.href:
      // Ép toàn bộ trình duyệt reload sạch cache cũ, buộc Header và UserDropdown nạp lại để lấy tên
      window.location.href = "/";
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-6">
      <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800">
            Chào mừng trở lại!
          </h2>
          <p className="text-stone-500 text-sm mt-2">
            Đăng nhập để xem lịch hẹn của bạn
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none text-stone-800"
              placeholder="name@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none text-stone-800"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-4 rounded-xl transition-all shadow-md mt-2"
          >
            ĐĂNG NHẬP ✨
          </button>
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-stone-500 hover:text-pink-400 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </form>

        <p className="text-center text-sm text-stone-500">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-pink-400 font-bold hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
