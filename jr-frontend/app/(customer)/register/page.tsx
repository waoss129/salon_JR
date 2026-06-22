"use client";

import Link from "next/link";

export default function RegisterPage() {
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
              type="password"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
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
