"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminForgotPasswordPage() {
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
      // Trỏ đúng về trang reset-password của khu vực admin,
      // tránh bị nhảy nhầm sang site_url mặc định (trang khách hàng)
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } else {
      // Luôn hiện thông báo thành công dù email có tồn tại hay không
      setSent(true);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#f2e6ce" }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-wider text-slate-900">
            JoyRide
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Đặt lại mật khẩu quản trị viên
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-5">
            <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              Nếu email này tồn tại trong hệ thống, chúng tôi đã gửi một liên
              kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.
            </div>
            <Link
              href="/admin/login"
              className="text-sm font-bold text-blue-600 hover:underline"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Địa chỉ Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nhanvien@joyride.com"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3 px-4 rounded-xl shadow-md transition duration-200 hover:brightness-95 active:scale-[0.99] disabled:opacity-60"
              style={{ backgroundColor: "#77a7c4" }}
            >
              {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
            </button>

            <p className="text-center text-sm text-slate-400 pt-2">
              <Link
                href="/admin/login"
                className="font-bold text-blue-600 hover:underline"
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
