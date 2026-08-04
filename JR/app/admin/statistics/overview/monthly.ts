"use server";

import { getScheduleStatistics } from "@/app/admin/statistics/schedules/actions";
import { getWorkingHoursStatistics } from "@/app/admin/statistics/working-hours/actions";
import { getPayrollStatistics } from "@/app/admin/statistics/payroll/actions";
import { getMonthlyRevenue } from "../../dashboard/queries";

// Bọc lại getMonthlyRevenue() cho cùng định dạng { month, value } với 3 hàm
// còn lại, để ChartCard dùng chung 1 kiểu prop "fetchData" cho mọi card.
export async function getMonthlyRevenuePoints(
  year: number,
): Promise<MonthlyPoint[]> {
  const data = await getMonthlyRevenue(year);
  return data.map((d) => ({ month: d.month, value: d.revenue }));
}

export type MonthlyPoint = { month: string; value: number };

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

// Tổng số ca ĐÃ ĐƯỢC XẾP (không tính huỷ) trong từng tháng, gộp toàn công ty
// — tái dùng workload đã tính sẵn trong getScheduleStatistics, chỉ đổi
// khoảng ngày thành trọn 1 tháng rồi cộng dồn.
export async function getMonthlyShiftsCompleted(
  year: number,
): Promise<MonthlyPoint[]> {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const results = await Promise.all(
    months.map(async (m) => {
      const startDate = `${year}-${String(m).padStart(2, "0")}-01`;
      const lastDay = new Date(year, m, 0).getDate();
      const endDate = `${year}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      const { workload } = await getScheduleStatistics({ startDate, endDate });
      return workload.reduce((sum, w) => sum + w.shiftCount, 0);
    }),
  );

  return results.map((value, i) => ({ month: MONTH_LABELS[i], value }));
}

// Tổng giờ làm ĐÃ HOÀN THÀNH (status = completed) trong từng tháng, gộp
// toàn công ty — tái dùng getWorkingHoursStatistics (vốn đã tính theo tháng).
export async function getMonthlyTotalHours(
  year: number,
): Promise<MonthlyPoint[]> {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const results = await Promise.all(
    months.map(async (m) => {
      const rows = await getWorkingHoursStatistics({ year, month: m });
      return rows.reduce((sum, r) => sum + r.totalHours, 0);
    }),
  );

  return results.map((value, i) => ({
    month: MONTH_LABELS[i],
    value: Math.round(value * 10) / 10,
  }));
}

// Tổng chi lương (thực nhận, đã gồm trừ/thưởng) trong từng tháng, gộp toàn
// công ty — tái dùng getPayrollStatistics (vốn đã tính theo tháng).
export async function getMonthlyTotalPayroll(
  year: number,
): Promise<MonthlyPoint[]> {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const results = await Promise.all(
    months.map(async (m) => {
      const rows = await getPayrollStatistics({ year, month: m });
      return rows.reduce((sum, r) => sum + r.totalPay, 0);
    }),
  );

  return results.map((value, i) => ({ month: MONTH_LABELS[i], value }));
}
