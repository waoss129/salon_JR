"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
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
      alert("Lỗi: " + error.message);
    } else {
      //đăng nhập thành công, supabase sẽ tự động lưu token vào localstorage
      console.log("Đăng nhập thành công", data.session);
      router.push("/");
      router.refresh();
    } // Chuyển về trang chủ sau khi đăng nhập
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
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none"
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
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-4 rounded-xl transition-all shadow-md"
          >
            ĐĂNG NHẬP ✨
          </button>
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
