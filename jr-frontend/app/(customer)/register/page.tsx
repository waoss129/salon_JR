"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client"; //dam bao duong dan dung

import Link from "next/link";

export default function RegisterPage() {
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Đăng ký tài khoản mới
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      alert("Lỗi đăng ký: " + authError.message);
      return;
    }

    // 2. Nếu đăng ký thành công, Supabase sẽ tự động tạo session
    if (data.user) {
      // 3. Lưu fullname và user_id vào bảng 'customers'
      const { error: insertError } = await supabase.from("customers").insert([
        {
          user_id: data.user.id, // ID từ hệ thống Auth
          fullname: fullName, // State bạn tạo từ ô input Họ và tên
        },
      ]);

      if (insertError) {
        alert("Đăng ký thành công nhưng lỗi tạo hồ sơ: " + insertError.message);
        return;
      }

      // 4. Đăng nhập thành công và chuyển hướng về trang chủ
      alert("Đăng ký thành công!");
      window.location.href = "/"; // Dùng window.location để refresh session hoàn toàn
    }
  };
  return (
    <div className="max-w-md mx-auto py-16 px-6">
      <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800">
            Tạo tài khoản mới
          </h2>
          <p className="text-stone-500 text-sm mt-2">
            Gia nhập gia đình JoyRide ngay hôm nay!
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
              Họ và tên
            </label>
            <input
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none"
              placeholder="name@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
              Mật khẩu
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none"
              placeholder=""
            />
          </div>

          <button
            onClick={handleRegister}
            type="submit"
            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-md"
          >
            ĐĂNG KÝ TÀI KHOẢN ✨
          </button>
        </form>

        <p className="text-center text-sm text-stone-500">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-blue-400 font-bold hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
