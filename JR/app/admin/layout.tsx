"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createAdminBrowserClient } from "@/lib/supabase/client";
import { logoutAction } from "@/app/admin/accounts/logout-action";
import { getPendingAppointmentsSummary } from "@/app/admin/appointments/actions";
import { getPendingProposalsSummary } from "@/app/admin/schedules/proposals/actions";
import { canView, ROLE } from "@/lib/supabase/permissions";

type PendingAppointmentItem = {
  id: string;
  kind: "appointment";
  appointment_date: string;
  customerName: string | null;
};

type PendingProposalItem = {
  id: string;
  kind: "proposal";
  label: string;
  weekStart: string;
};

type NotificationItem = PendingAppointmentItem | PendingProposalItem;

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
  const [roleId, setRoleId] = useState<number | null>(null);

  const [openDichVu, setOpenDichVu] = useState(false);
  const [openNhanVien, setOpenNhanVien] = useState(false);
  const [openThongKe, setOpenThongKe] = useState(false);

  const [pendingCount, setPendingCount] = useState<number>(0);
  const [pendingItems, setPendingItems] = useState<PendingAppointmentItem[]>(
    [],
  );
  const [ownProposalCount, setOwnProposalCount] = useState<number>(0);
  const [ownProposalItems, setOwnProposalItems] = useState<
    PendingProposalItem[]
  >([]);
  const [reviewProposalCount, setReviewProposalCount] = useState<number>(0);
  const [reviewProposalItems, setReviewProposalItems] = useState<
    PendingProposalItem[]
  >([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadPendingSummary = useCallback(async () => {
    try {
      const summary = await getPendingAppointmentsSummary();
      setPendingCount(summary.count);
      setPendingItems(
        summary.items.map((item) => ({ ...item, kind: "appointment" })),
      );
    } catch {
      // im lặng bỏ qua lỗi tải thông báo, không chặn giao diện chính
    }
  }, []);

  // Đề xuất lịch làm việc — role 3/4/5 thấy "của tôi" (đang chờ mình chọn),
  // role 1/2/3 thấy "cần duyệt" (nhân viên đã chọn xong, chờ chốt). Role 3
  // (Quản lý) có cả 2, nên tách riêng 2 state thay vì gộp chung 1 số.
  const loadPendingProposalSummary = useCallback(async () => {
    try {
      const summary = await getPendingProposalsSummary();
      setOwnProposalCount(summary.ownPending.count);
      setOwnProposalItems(
        summary.ownPending.items.map((item) => ({ ...item, kind: "proposal" })),
      );
      setReviewProposalCount(summary.reviewPending.count);
      setReviewProposalItems(
        summary.reviewPending.items.map((item) => ({
          ...item,
          kind: "proposal",
        })),
      );
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
        setRoleId((data as any).role_id ?? null);
      }
    };

    loadUserInfo();
  }, [pathname, supabase]);

  useEffect(() => {
    if (pathname === "/admin/login") return;

    loadPendingSummary();
    loadPendingProposalSummary();

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
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "schedule_proposal_batches" },
        () => loadPendingProposalSummary(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pathname, supabase, loadPendingSummary, loadPendingProposalSummary]);

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

  const totalNotificationCount =
    pendingCount + ownProposalCount + reviewProposalCount;

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
            {canView(roleId, "dashboard") && (
              <Link
                href="/admin/dashboard"
                className="block p-2.5 rounded hover:bg-purple-200 transition"
              >
                Tổng Quan (Dashboard)
              </Link>
            )}

            {canView(roleId, "accounts") && (
              <Link
                href="/admin/accounts"
                className="block p-2.5 rounded hover:bg-purple-200 transition"
              >
                Tài Khoản
              </Link>
            )}

            {canView(roleId, "services") && (
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
            )}

            {canView(roleId, "staff") && (
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
            )}

            {canView(roleId, "customers") && (
              <Link
                href="/admin/customers"
                className="block p-2.5 rounded hover:bg-purple-200 transition"
              >
                Khách Hàng
              </Link>
            )}

            {canView(roleId, "schedules") && (
              <Link
                href="/admin/schedules"
                className="block p-2.5 rounded hover:bg-purple-200 transition"
              >
                Lịch Làm Việc
              </Link>
            )}

            {/* Role 3, 4, 5: tự đăng ký ca làm việc của mình */}
{roleId != null && [3, 4, 5].includes(roleId) && (
  <Link
    href="/admin/schedules/register"
    className="block p-2.5 rounded hover:bg-purple-200 transition"
  >
    Đăng Ký Ca Làm
  </Link>
)}

{/* Role 1, 2, 3: thiết lập slot/ngưỡng trước khi mở đăng ký */}
{roleId != null && [1, 2, 3].includes(roleId) && (
  <Link
    href="/admin/schedules/setup"
    className="block p-2.5 rounded hover:bg-purple-200 transition"
  >
    Thiết Lập Ca
  </Link>
)}

{/* Role 1, 2, 3: duyệt lịch nhân viên đã đăng ký */}
{roleId != null && [1, 2, 3].includes(roleId) && (
  <Link
    href="/admin/schedules/review"
    className="block p-2.5 rounded hover:bg-purple-200 transition"
  >
    Duyệt Đăng Ký
  </Link>
)}


            

          

            {canView(roleId, "appointments") && (
              <Link
                href="/admin/appointments"
                className="block p-2.5 rounded hover:bg-purple-200 transition"
              >
                Lịch Hẹn
              </Link>
            )}

            {canView(roleId, "bills") && (
              <Link
                href="/admin/bills"
                className="block p-2.5 rounded hover:bg-purple-200 transition"
              >
                Hóa Đơn
              </Link>
            )}

            {canView(roleId, "promotions") && (
              <Link
                href="/admin/promotions"
                className="block p-2.5 rounded hover:bg-purple-200 transition"
              >
                Khuyến Mãi
              </Link>
            )}

            {/* CEO: 1 link duy nhất, không xổ dropdown, không có Lương riêng
    (Lương đã gộp vào /admin/statistics/overview) */}
{roleId === ROLE.CEO && canView(roleId, "statistics") && (
  <Link
    href="/admin/statistics/overview"
    className="block p-2.5 rounded hover:bg-purple-200 transition"
  >
    Thống Kê
  </Link>
)}

{/* Admin (và role khác nếu sau này được cấp quyền statistics):
    giữ nguyên dropdown đầy đủ như cũ */}
{roleId !== ROLE.CEO && canView(roleId, "statistics") && (
  <div>
    <button
      onClick={() => setOpenThongKe(!openThongKe)}
      className="w-full flex items-center justify-between p-2.5 rounded hover:bg-purple-200 transition text-left"
    >
      <span>Thống Kê</span>
      <span className="text-xs transition-transform duration-200">
        {openThongKe ? "▲" : "▼"}
      </span>
    </button>
    {openThongKe && (
      <div className="pl-6 mt-1 space-y-1 bg-sky-100/50 rounded-lg py-1">
        <Link href="/admin/statistics/schedules" className="block p-2 text-sm hover:text-violet-500">
          Lịch Làm Việc
        </Link>
        <Link href="/admin/statistics/working-hours" className="block p-2 text-sm hover:text-violet-500">
          Thời Gian Làm Việc
        </Link>
        {canView(roleId, "payroll") && (
          <Link href="/admin/statistics/payroll" className="block p-2 text-sm hover:text-violet-500">
            Lương
          </Link>
        )}
        <Link href="/admin/statistics/revenue" className="block p-2 text-sm hover:text-violet-500">
          Doanh Thu
        </Link>
      </div>
    )}
  </div>
)}
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
                {totalNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalNotificationCount > 9 ? "9+" : totalNotificationCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-lg shadow-lg border border-slate-200 z-50">
                  {/* Lịch hẹn chờ xác nhận */}
                  <div className="p-3 border-b font-semibold text-sm">
                    Lịch hẹn chờ xác nhận ({pendingCount})
                  </div>
                  <div className="max-h-56 overflow-y-auto">
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
                          const date = item.appointment_date.slice(0, 10);
                          router.push(`/admin/appointments?date=${date}`);
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
                    className="w-full p-2 text-center text-xs text-violet-600 hover:bg-slate-50 font-medium border-b"
                  >
                    Xem tất cả lịch hẹn
                  </button>

                  {/* Đề xuất lịch của tôi — role 3/4/5 */}
                  {[3, 4, 5].includes(roleId ?? -1) && (
                    <>
                      <div className="p-3 border-b font-semibold text-sm">
                        Đề xuất lịch của tôi ({ownProposalCount})
                      </div>
                      <div className="max-h-56 overflow-y-auto">
                        {ownProposalItems.length === 0 && (
                          <div className="p-3 text-sm text-gray-400 text-center">
                            Không có đề xuất nào đang chờ bạn chọn
                          </div>
                        )}
                        {ownProposalItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setShowNotifications(false);
                              router.push("/admin/schedule-proposal");
                            }}
                            className="w-full text-left p-3 border-b last:border-b-0 hover:bg-slate-50 text-sm"
                          >
                            <div className="font-medium">{item.label}</div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Đề xuất lịch cần duyệt — role 1/2/3 */}
                  {[1, 2, 3].includes(roleId ?? -1) && (
                    <>
                      <div className="p-3 border-b font-semibold text-sm">
                        Đề xuất lịch cần duyệt ({reviewProposalCount})
                      </div>
                      <div className="max-h-56 overflow-y-auto">
                        {reviewProposalItems.length === 0 && (
                          <div className="p-3 text-sm text-gray-400 text-center">
                            Không có đề xuất nào đang chờ duyệt
                          </div>
                        )}
                        {reviewProposalItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setShowNotifications(false); //
                              router.push("/admin/schedule-proposal/review");
                            }}
                            className="w-full text-left p-3 border-b last:border-b-0 hover:bg-slate-50 text-sm"
                          >
                            <div className="font-medium">{item.label}</div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
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
