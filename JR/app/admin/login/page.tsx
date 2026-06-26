// app/login/page.tsx
"use client";
import React, { useState } from "react";

export default function LoginPage() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Xử lý đăng nhập:", { role, email, password });

    //gia lap luu session dang nhap giong co che facebook
    document.cookie = "user-session=true; path=/; max-age=86400";
    //dua nguoi dung vao thang trang dashboard của admin
    window.location.href = "/admin/dashboard";
  };

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
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Vai trò Dropdown */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Vai trò thành viên
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required // bat buoc phai chon mot vai tro moi cho bam dang nhap
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            >
              {/* Tùy chọn trống mặc định khi chưa click */}
              <option value="" disabled hidden>
                -- Chọn vai trò của bạn --
              </option>
              <option value="admin">Admin</option>
              <option value="director">Giám đốc</option>
              <option value="manager">Quản lý</option>
              <option value="beautician">Chuyên viên</option>
              <option value="receptionist">Lễ tân</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Địa chỉ Email
            </label>
            <input
              type="email"
              required
              placeholder="nhanvien@joyride.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            />
          </div>

          {/* Mật khẩu & Quên mật khẩu */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-bold text-slate-700">
                Mật khẩu
              </label>
              <a
                href="#forgot-password"
                className="text-xs font-bold text-blue-600 hover:underline transition"
              >
                Quên mật khẩu?
              </a>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            />
          </div>

          {/* Button Đăng Nhập */}
          <button
            type="submit"
            className="w-full text-white font-bold py-3 px-4 rounded-xl shadow-md transition duration-200 hover:brightness-95 active:scale-[0.99] mt-2"
            style={{ backgroundColor: "#77a7c4" }}
          >
            Đăng nhập vào hệ thống
          </button>
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
