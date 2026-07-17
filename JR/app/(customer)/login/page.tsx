"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { loginWithPhone } from "./actions";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await loginWithPhone(phone, password);
        window.location.href = "/";
      } catch (err: any) {
        setError(
          err?.message || "Đăng nhập không thành công, vui lòng thử lại.",
        );
      }
    });
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

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none text-stone-800"
              placeholder="0912345678"
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
            disabled={isPending}
            className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-4 rounded-xl transition-all shadow-md mt-2 disabled:opacity-50"
          >
            {isPending ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
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
