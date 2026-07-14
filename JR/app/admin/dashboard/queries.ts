import { createAdminAuthClient } from "@/lib/supabase/server";

export type AppointmentStats = {
  todayAppointments: number;
  todayInProgress: number;
  todayRevenueEstimate: number;
};

export type MonthlyRevenuePoint = {
  month: string; // "Tháng 1"
  revenue: number; // đơn vị: triệu VNĐ, làm tròn 1 chữ số thập phân
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
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
// THỐNG KÊ LỊCH HẸN — dùng cho MỌI role (không đụng tới bảng bills,
// nên không phụ thuộc RLS của bills — an toàn gọi cho mọi role).
// ============================================================

export async function getAppointmentStats(): Promise<AppointmentStats> {
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

  return {
    todayAppointments: todayAppointments ?? 0,
    todayInProgress: todayInProgress ?? 0,
  };
}

// ============================================================
// DOANH THU — chỉ gọi cho role có quyền xem thống kê (bills RLS chỉ
// cho phép role 1,2,3,5 đọc; KHÔNG gọi các hàm này cho role 4).
// ============================================================

export async function getTodayRevenueEstimate(): Promise<number> {
  const supabase = await createAdminAuthClient();
  const { start, end } = todayRange();

  // Doanh thu ước tính hôm nay: tổng total_price của TẤT CẢ bills tạo hôm nay
  // (kể cả chưa thanh toán — mang tính chất "ước tính").
  const { data: todayBills } = await supabase
    .from("bills")
    .select("total_price")
    .gte("created_at", start)
    .lte("created_at", end);

  return (todayBills ?? []).reduce((sum, b) => sum + (b.total_price ?? 0), 0);
}

export async function getMonthlyRevenue(
  year: number,
): Promise<MonthlyRevenuePoint[]> {
  const supabase = await createAdminAuthClient();

  const start = `${year}-01-01T00:00:00`;
  const end = `${year}-12-31T23:59:59`;

  // Chỉ tính bills đã 'paid' (doanh thu thực tế đã thu).
  // Mốc thời gian dùng updated_at làm xấp xỉ "ngày thanh toán"
  // — DB chưa có cột paid_at riêng.
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
