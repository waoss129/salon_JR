// app/admin/layout.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); //lay duong dan hien tai
  // Giả lập role đăng nhập (admin)
  const userRole = "admin";

  // Trạng thái đóng mở của các dropdown menu
  const [openDichVu, setOpenDichVu] = useState(false);
  const [openNhanVien, setOpenNhanVien] = useState(false);

  // 3. NẾU ĐANG Ở TRANG ADMIN LOGIN -> ẨN TOÀN BỘ SIDEBAR + HEADER
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#f2e6ce" }}>
        {children}
      </div>
    );
  }

  //them ham xu ly khi click nut dang xuat
  const handleLogout = () => {
    //xoa cookie dang nhap
    document.cookie =
      "user-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    //day ve trang login
    window.location.href = "/admin/login";
  };
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      {/* 1. SIDEBAR (Thanh điều hướng bên trái màu #a1dbf1) */}
      <aside
        className="w-64 text-slate-800 flex flex-col justify-between p-4 border-r border-slate-300"
        style={{ backgroundColor: "#d1c0f6" }}
      >
        <div>
          {/* Logo JoyRide */}
          <div className="text-2xl font-black mb-8 text-center tracking-wider text-slate-900 border-b border-slate-400 pb-4">
            JoyRide
          </div>

          <nav className="space-y-1 font-medium text-slate-900">
            {/* Tổng Quan */}
            <Link
              href="/admin/dashboard"
              className="block p-2.5 rounded hover:bg-purple-200 transition"
            >
              Tổng Quan (Dashboard)
            </Link>

            {/* Tài Khoản */}
            <Link
              href="/admin/accounts"
              className="block p-2.5 rounded hover:bg-purple-200 transition"
            >
              Tài Khoản
            </Link>

            {/* Dropdown Dịch Vụ */}
            <div>
              <button
                onClick={() => setOpenDichVu(!openDichVu)}
                className="w-full flex items-center justify-between p-2.5 rounded hover:bg-purple-200 transition text-left"
              >
                <span>Dịch Vụ</span>
                <span className="text-xs transition-transform duration-200">
                  {openDichVu ? "▲" : "▼"}
                </span>
              </button>
              {openDichVu && (
                <div className="pl-6 mt-1 space-y-1 bg-sky-100/50 rounded-lg py-1">
                  <Link
                    href="/admin/services/hair"
                    className="block p-2 text-sm hover:text-pink-600"
                  >
                    Hair
                  </Link>
                  <Link
                    href="/admin/services/nail"
                    className="block p-2 text-sm hover:text-blue-600"
                  >
                    Nail
                  </Link>
                  <Link
                    href="/admin/services/spa"
                    className="block p-2 text-sm hover:text-green-600"
                  >
                    Spa
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown Nhân Viên */}
            <div>
              <button
                onClick={() => setOpenNhanVien(!openNhanVien)}
                className="w-full flex items-center justify-between p-2.5 rounded hover:bg-purple-200 transition text-left"
              >
                <span>Nhân Viên</span>
                <span className="text-xs transition-transform duration-200">
                  {openNhanVien ? "▲" : "▼"}
                </span>
              </button>
              {openNhanVien && (
                <div className="pl-6 mt-1 space-y-1 bg-sky-100/50 rounded-lg py-1">
                  <Link
                    href="/admin/staff/manager"
                    className="block p-2 text-sm hover:text-violet-500"
                  >
                    Quản Lý
                  </Link>
                  <Link
                    href="/admin/staff/receptionist"
                    className="block p-2 text-sm hover:text-violet-500"
                  >
                    Lễ Tân
                  </Link>
                </div>
              )}
            </div>

            {/* Chuyên Viên */}
            <Link
              href="/admin/beauticians"
              className="block p-2.5 rounded hover:bg-purple-200 transition"
            >
              Chuyên Viên
            </Link>

            {/* Khách Hàng */}
            <Link
              href="/admin/customers"
              className="block p-2.5 rounded hover:bg-purple-200 transition"
            >
              Khách Hàng
            </Link>

            {/* Lịch Làm Việc */}
            <Link
              href="/admin/schedules"
              className="block p-2.5 rounded hover:bg-purple-200 transition"
            >
              Lịch Làm Việc
            </Link>

            {/* Lịch Hẹn */}
            <Link
              href="/admin/appointments"
              className="block p-2.5 rounded hover:bg-purple-200 transition"
            >
              Lịch Hẹn
            </Link>

            {/* Hóa Đơn */}
            <Link
              href="/admin/bills"
              className="block p-2.5 rounded hover:bg-purple-200 transition"
            >
              Hóa Đơn
            </Link>
          </nav>
        </div>

        {/* Nút Đăng Xuất */}
        <button
          onClick={handleLogout}
          className="w-full bg-purple-400 hover:bg-purple-600 text-white p-2.5 rounded transition font-bold mt-auto shadow-sm flex items-center justify-center gap-2"
        >
          Đăng xuất
        </button>
      </aside>

      {/* 2. MAIN CONTENT AREA (Khu vực bên phải có Header màu #77a7c4) */}
      <div className="flex-1 flex flex-col">
        {/* Header trên cùng màu #77a7c4 */}
        <header
          className="shadow-md h-16 flex items-center justify-between px-6 text-white"
          style={{ backgroundColor: "#fefdb2" }}
        >
          <h2 className="text-xl font-bold tracking-wide text-slate-900">
            Hệ thống Admin
          </h2>

          <div className="flex items-center gap-6 ">
            {/* Chuông thông báo (Hình 2) */}
            <button
              className="relative p-2 rounded-full hover:bg-amber-500/30 transition flex items-center gap-1.5 font-medium"
              style={{ color: "#000000" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span>Thông báo</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Thông tin User */}
            <div className="flex items-center gap-2 border-l border-sky-400 pl-4">
              <span className="bg-white text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                {userRole}
              </span>
              <span className="font-semibold text-sm text-slate-900">
                Xin chào, Thành viên
              </span>
            </div>
          </div>
        </header>

        {/* Nội dung chi tiết của trang con */}
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
