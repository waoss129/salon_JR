"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } else {
      // Luôn hiện thông báo thành công dù email có tồn tại hay không
      // (tránh lộ thông tin email nào đã đăng ký trong hệ thống)
      setSent(true);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-6">
      <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800">Quên mật khẩu?</h2>
          <p className="text-stone-500 text-sm mt-2">
            Nhập email để nhận liên kết đặt lại mật khẩu
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-stone-600 text-sm">
              Nếu email này tồn tại trong hệ thống, chúng tôi đã gửi một liên
              kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư (kể cả mục spam).
            </p>
            <Link
              href="/login"
              className="text-pink-400 font-bold hover:underline text-sm"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-4 rounded-xl transition-all shadow-md mt-2 disabled:opacity-60"
            >
              {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
            </button>

            <p className="text-center text-sm text-stone-500">
              <Link
                href="/login"
                className="text-pink-400 font-bold hover:underline"
              >
                Quay lại đăng nhập
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
