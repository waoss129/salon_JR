import { createAdminAuthClient } from "@/lib/supabase/server";

export type DashboardStats = {
  todayAppointments: number;
  todayInProgress: number;
  todayRevenueEstimate: number;
};

export type MonthlyRevenuePoint = {
  month: string; // "Tháng 1"
  revenue: number; // đơn vị: triệu VNĐ, làm tròn 1 chữ số thập phân
};

const MONTH_LABELS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

function todayRange() {
  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
  );
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  );
  return { start: start.toISOString(), end: end.toISOString() };
}

// ============================================================
// 3 THẺ THỐNG KÊ NHANH
// ============================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createAdminAuthClient();
  const { start, end } = todayRange();

  // Lịch hẹn hôm nay: appointment_date = hôm nay, loại trừ 'cancelled'.
  const { count: todayAppointments } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .gte("appointment_date", start)
    .lte("appointment_date", end)
    .neq("status", "cancelled");

  // Khách đang làm: appointment hôm nay đang ở trạng thái 'confirmed'.
  const { count: todayInProgress } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .gte("appointment_date", start)
    .lte("appointment_date", end)
    .eq("status", "confirmed");

  // Doanh thu ước tính hôm nay: tổng total_price của TẤT CẢ bills tạo hôm nay
  // (kể cả chưa thanh toán — mang tính chất "ước tính", đã thống nhất với người dùng).
  const { data: todayBills } = await supabase
    .from("bills")
    .select("total_price")
    .gte("created_at", start)
    .lte("created_at", end);

  const todayRevenueEstimate = (todayBills ?? []).reduce(
    (sum, b) => sum + (b.total_price ?? 0),
    0,
  );

  return {
    todayAppointments: todayAppointments ?? 0,
    todayInProgress: todayInProgress ?? 0,
    todayRevenueEstimate,
  };
}

// ============================================================
// BIỂU ĐỒ DOANH THU THEO THÁNG
// ============================================================

export async function getMonthlyRevenue(
  year: number,
): Promise<MonthlyRevenuePoint[]> {
  const supabase = await createAdminAuthClient();

  const start = `${year}-01-01T00:00:00`;
  const end = `${year}-12-31T23:59:59`;

  // Chỉ tính bills đã 'paid' (doanh thu thực tế đã thu), đã thống nhất với người dùng.
  // Mốc thời gian dùng updated_at làm xấp xỉ "ngày thanh toán"
  // — DB chưa có cột paid_at riêng (quy ước đã áp dụng chung với phần hóa đơn).
  const { data, error } = await supabase
    .from("bills")
    .select("total_price, updated_at")
    .eq("status", "paid")
    .gte("updated_at", start)
    .lte("updated_at", end);

  if (error) {
    console.error("getMonthlyRevenue error:", error);
    return MONTH_LABELS.map((month) => ({ month, revenue: 0 }));
  }

  const totalsByMonth = new Array(12).fill(0);
  for (const bill of data ?? []) {
    const monthIndex = new Date(bill.updated_at).getMonth();
    totalsByMonth[monthIndex] += bill.total_price ?? 0;
  }

  return MONTH_LABELS.map((month, idx) => ({
    month,
    revenue: Math.round((totalsByMonth[idx] / 1_000_000) * 10) / 10,
  }));
}
