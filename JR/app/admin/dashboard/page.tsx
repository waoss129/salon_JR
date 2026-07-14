// app/admin/dashboard/page.tsx
import React from "react";
import { requireView } from "@/lib/supabase/admin-guard";
import { canView } from "@/lib/supabase/permissions";
import { createAdminAuthClient } from "@/lib/supabase/server";
import {
  getAppointmentStats,
  getMonthlyRevenue,
  getTodayRevenueEstimate,
} from "./queries";
import LiveClock from "@/components/admin/LiveClock";
import GreetingBanner from "@/components/admin/GreetingBanner";

function formatRevenueShort(value: number) {
  if (value >= 1_000_000) {
    return `${Math.round((value / 1_000_000) * 10) / 10}M`;
  }
  if (value >= 1_000) {
    return `${Math.round((value / 1_000) * 10) / 10}K`;
  }
  return value.toLocaleString("vi-VN");
}

export default async function DashboardPage() {
  await requireView("dashboard");

  const supabase = await createAdminAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let roleId: number | null = null;
  let staffName = "bạn";

  if (user) {
    const { data: employee } = await supabase
      .from("employees")
      .select("role_id, profiles ( fullname )")
      .eq("id", user.id)
      .single();

    roleId = (employee as any)?.role_id ?? null;
    staffName = (employee as any)?.profiles?.fullname ?? "bạn";
  }

  const hasStatisticsAccess = canView(roleId, "statistics");

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentYear = new Date().getFullYear();

  // Thống kê lịch hẹn: an toàn cho MỌI role (không đụng bảng bills).
  const appointmentStats = await getAppointmentStats();

  // Doanh thu: CHỈ gọi khi role có quyền statistics (bills RLS không cho
  // role 4 đọc — cố tình không gọi các hàm này cho role không có quyền).
  const todayRevenueEstimate = hasStatisticsAccess
    ? await getTodayRevenueEstimate()
    : 0;
  const monthlyData = hasStatisticsAccess
    ? await getMonthlyRevenue(currentYear)
    : [];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Ngày */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white/70 p-4 rounded-xl shadow-sm border border-pink-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Tổng quan hệ thống
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Theo dõi thời gian thực các chỉ số hoạt động kinh doanh.
          </p>
        </div>
        <div className="mt-2 md:mt-0 px-4 py-2 bg-pink-100 text-pink-600 font-bold rounded-lg shadow-inner text-sm flex items-center gap-2">
          Hôm nay: {today}
        </div>
      </div>

      {/* Lưới các thẻ thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Lịch hẹn hôm nay
            </p>
            <p className="text-4xl font-black text-slate-900 mt-1">
              {appointmentStats.todayAppointments}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Khách đang làm
            </p>
            <p className="text-4xl font-black text-slate-900 mt-1">
              {appointmentStats.todayInProgress}
            </p>
          </div>
        </div>

        {hasStatisticsAccess ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Doanh thu ước tính
              </p>
              <p className="text-4xl font-black text-slate-900 mt-1">
                {formatRevenueShort(todayRevenueEstimate)}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Giờ hiện tại
              </p>
              <LiveClock />
            </div>
          </div>
        )}
      </div>

      {/* Khu vực đồ thị doanh thu theo tháng — chỉ role có quyền statistics.
          Role khác thấy banner chào + trích dẫn thay thế. */}
      {hasStatisticsAccess ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Biểu đồ doanh thu theo tháng
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Đơn vị tính: Triệu VNĐ (M) — chỉ tính hóa đơn đã thanh toán
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-teal-50 text-sky-600 rounded-full border border-teal-200">
              Năm {currentYear}
            </span>
          </div>

          <div className="w-full bg-slate-50/50 p-4 rounded-xl border border-blue-300 flex flex-col justify-end">
            <div className="h-64 w-full flex items-end justify-between px-2 sm:px-8 pt-4 border-b border-blue-300">
              {monthlyData.map((item, index) => {
                const barHeight = `${(item.revenue / maxRevenue) * 100}%`;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-end h-full flex-1 group max-w-[60px] mx-2"
                  >
                    <span className="text-xs font-bold text-blue-400 mb-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.revenue}M
                    </span>
                    <div
                      className="w-full rounded-t-md shadow-sm transition-all duration-300 group-hover:brightness-95 group-hover:shadow-md"
                      style={{ height: barHeight, backgroundColor: "#7fbcf2" }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between px-2 sm:px-8 mt-2 text-xs font-bold text-blue-600">
              {monthlyData.map((item, index) => (
                <div
                  key={index}
                  className="flex-1 text-center max-w-[60px] mx-2"
                >
                  {item.month}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <GreetingBanner staffName={staffName} />
      )}
    </div>
  );
}
