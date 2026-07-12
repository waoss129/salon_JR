"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createAdminBrowserClient } from "@/lib/supabase/client";
import { logoutAction } from "@/app/admin/accounts/logout-action";
import { getPendingAppointmentsSummary } from "@/app/admin/appointments/actions";

type PendingItem = {
  id: string;
  appointment_date: string;
  customerName: string | null;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createAdminBrowserClient();

  const [userRole, setUserRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const [openDichVu, setOpenDichVu] = useState(false);
  const [openNhanVien, setOpenNhanVien] = useState(false);

  const [pendingCount, setPendingCount] = useState<number>(0);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadPendingSummary = useCallback(async () => {
    try {
      const summary = await getPendingAppointmentsSummary();
      setPendingCount(summary.count);
      setPendingItems(summary.items);
    } catch {
      // im lặng bỏ qua lỗi tải thông báo, không chặn giao diện chính
    }
  }, []);

  useEffect(() => {
    if (pathname === "/admin/login") return;

    const loadUserInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("employees")
        .select("role_id, roles(role_name), profiles(fullname)")
        .eq("id", user.id)
        .single();

      if (data) {
        setUserRole((data as any).roles?.role_name ?? "");
        setUserName((data as any).profiles?.fullname ?? "");
      }
    };

    loadUserInfo();
  }, [pathname, supabase]);

  // Tải số lượng lịch hẹn đang chờ xử lý + lắng nghe realtime khi có
  // lịch hẹn mới hoặc trạng thái lịch hẹn thay đổi
  useEffect(() => {
    if (pathname === "/admin/login") return;

    loadPendingSummary();

    const channel = supabase
      .channel("admin-appointments-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "appointments" },
        () => loadPendingSummary(),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "appointments" },
        () => loadPendingSummary(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pathname, supabase, loadPendingSummary]);

  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#f2e6ce" }}>
        {children}
      </div>
    );
  }

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      {/* 1. SIDEBAR */}
      <aside
        className="w-64 text-slate-800 flex flex-col justify-between p-4 border-r border-slate-300"
        style={{ backgroundColor: "#d1c0f6" }}
      >
        <div>
          <div className="text-2xl font-black mb-8 text-center tracking-wider text-slate-900 border-b border-slate-400 pb-4">
            JoyRide
          </div>

          <nav className="space-y-1 font-medium text-slate-900">
            <Link
              href="/admin/dashboard"
              className="block p-2.5 rounded hover:bg-purple-200 transition"
            >
              Tổng Quan (Dashboard)
            </Link>

            <Link
              href="/admin/accounts"
              className="block p-2.5 rounded hover:bg-purple-200 transition"
            >
              Tài Khoản
            </Link>

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
                    href="/admin/staff/beautician"
                    className="block p-2 text-sm hover:text-violet-500"
                  >
                    Chuyên Viên
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

            <Link
              href="/admin/customers"
              className="block p-2.5 rounded hover:bg-purple-200 transition"
            >
              Khách Hàng
            </Link>

            <Link
              href="/admin/schedules"
              className="block p-2.5 rounded hover:bg-purple-200 transition"
            >
              Lịch Làm Việc
            </Link>

            <Link
              href="/admin/appointments"
              className="block p-2.5 rounded hover:bg-purple-200 transition"
            >
              Lịch Hẹn
            </Link>

            <Link
              href="/admin/bills"
              className="block p-2.5 rounded hover:bg-purple-200 transition"
            >
              Hóa Đơn
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-purple-400 hover:bg-purple-600 text-white p-2.5 rounded transition font-bold mt-auto shadow-sm flex items-center justify-center gap-2"
        >
          Đăng xuất
        </button>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        <header
          className="shadow-md h-16 flex items-center justify-between px-6 text-white"
          style={{ backgroundColor: "#fefdb2" }}
        >
          <h2 className="text-xl font-bold tracking-wide text-slate-900">
            Hệ thống Admin
          </h2>

          <div className="flex items-center gap-6">
            {/* Chuông thông báo - dữ liệu thật từ lịch hẹn đang chờ xác nhận */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications((v) => !v)}
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
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-lg shadow-lg border border-slate-200 z-50">
                  <div className="p-3 border-b font-semibold text-sm">
                    Lịch hẹn chờ xác nhận ({pendingCount})
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {pendingItems.length === 0 && (
                      <div className="p-3 text-sm text-gray-400 text-center">
                        Không có lịch hẹn nào đang chờ
                      </div>
                    )}
                    {pendingItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setShowNotifications(false);
                          router.push("/admin/appointments");
                        }}
                        className="w-full text-left p-3 border-b last:border-b-0 hover:bg-slate-50 text-sm"
                      >
                        <div className="font-medium">
                          {item.customerName ?? "Khách chưa cập nhật tên"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(item.appointment_date).toLocaleString(
                            "vi-VN",
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      router.push("/admin/appointments");
                    }}
                    className="w-full p-2 text-center text-xs text-violet-600 hover:bg-slate-50 font-medium"
                  >
                    Xem tất cả lịch hẹn
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-l border-sky-400 pl-4">
              <span className="bg-white text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                {userRole}
              </span>
              <span className="font-semibold text-sm text-slate-900">
                Xin chào, {userName || "Thành viên"}
              </span>
            </div>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
