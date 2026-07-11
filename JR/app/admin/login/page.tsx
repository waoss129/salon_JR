"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "./actions";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full text-white font-bold py-3 px-4 rounded-xl shadow-md transition duration-200 hover:brightness-95 active:scale-[0.99] mt-2 disabled:opacity-60"
      style={{ backgroundColor: "#77a7c4" }}
    >
      {pending ? "Đang đăng nhập..." : "Đăng nhập vào hệ thống"}
    </button>
  );
}

const initialState: LoginState = { success: false, message: "" };

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#f2e6ce" }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        {/* Logo JoyRide */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-wider text-slate-900">
            JoyRide
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Hệ thống quản lý và điều hành nội bộ
          </p>
        </div>

        {/* Form Nhập Liệu */}
        <form action={formAction} className="space-y-5">
          {state.message && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-sm font-medium text-red-700">
              {state.message}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Địa chỉ Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="nhanvien@joyride.com"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            />
          </div>

          {/* Mật khẩu & Quên mật khẩu */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-bold text-slate-700">
                Mật khẩu
              </label>
              <Link
                href="/admin/forgot-password"
                className="text-xs font-bold text-blue-600 hover:underline transition"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            />
          </div>

          {/* Button Đăng Nhập */}
          <SubmitButton />
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-medium">
            © 2026 JoyRide. Bảo mật hệ thống thông tin.
          </span>
        </div>
      </div>
    </div>
  );
}
