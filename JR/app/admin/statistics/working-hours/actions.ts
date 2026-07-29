"use server";

import { createAdminAuthClient } from "@/lib/supabase/server";
import { requireViewAction } from "@/lib/supabase/admin-guard";

const STAFF_ROLE_IDS = [3, 4, 5];
const FREE_LEAVE_DAYS_PER_MONTH = 4;

export type WorkingHoursRow = {
  employeeId: string;
  fullname: string;
  completedShifts: number;
  totalHours: number;
  daysOff: number;
  deductibleDaysOff: number;
};

function diffHours(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em - (sh * 60 + sm)) / 60;
}

function countWeekdaysInMonth(year: number, month: number): number {
  const lastDay = new Date(year, month, 0).getDate();
  let count = 0;
  for (let d = 1; d <= lastDay; d++) {
    const dow = new Date(year, month - 1, d).getDay();
    if (dow >= 1 && dow <= 5) count++;
  }
  return count;
}

/**
 * Tổng số giờ đã làm THẬT SỰ (chỉ tính ca `completed`) của từng nhân viên
 * trong 1 tháng, kèm số ngày nghỉ (T2-T6 không có ca completed) so với hạn
 * mức 4 ngày/tháng — CÙNG ĐỊNH NGHĨA với trang Lương, để đối chiếu. Trang
 * Lương mới là nơi tính ra số tiền cụ thể; trang này chỉ để tham khảo giờ
 * công + tình trạng nghỉ phép.
 *
 * QUAN TRỌNG — nhân viên nào được đưa vào bảng này: cùng nguyên tắc với
 * getPayrollStatistics (xem giải thích chi tiết ở đó). Giờ công đã làm
 * trong tháng phải được giữ nguyên bất kể status HIỆN TẠI của nhân viên —
 * không còn lọc cứng `.eq("status", "active")` khi lấy danh sách nhân
 * viên, để tránh làm "biến mất" giờ làm của người đã đổi status giữa
 * tháng (on_leave/inactive/terminated).
 */
export async function getWorkingHoursStatistics(params: {
  year: number;
  month: number; // 1-12
}): Promise<WorkingHoursRow[]> {
  await requireViewAction("statistics");
  const supabase = await createAdminAuthClient();

  const startDate = `${params.year}-${String(params.month).padStart(2, "0")}-01`;
  const lastDayOfMonth = new Date(params.year, params.month, 0).getDate();
  const endDate = `${params.year}-${String(params.month).padStart(2, "0")}-${String(
    lastDayOfMonth,
  ).padStart(2, "0")}`;

  // 1. Lấy TRƯỚC toàn bộ ca `completed` trong tháng theo role (không lọc
  // theo danh sách nhân viên active/inactive), để biết ai đã thực sự làm
  // việc trong tháng này, dù status hiện tại của họ là gì.
  const { data: schedules, error: schedulesError } = await supabase
    .from("schedules")
    .select(
      `
      id, date, status,
      session:sessions ( start_time, end_time ),
      employee_id,
      employee:employees!inner ( role_id )
    `,
    )
    .eq("status", "completed")
    .gte("date", startDate)
    .lte("date", endDate)
    .in("employee.role_id", STAFF_ROLE_IDS);
  if (schedulesError) throw new Error(schedulesError.message);

  const employeeIdsWithActivity = [
    ...new Set((schedules ?? []).map((s: any) => s.employee_id)),
  ];

  // 2. Nhân viên đưa vào bảng = đang active (để vẫn hiện ra kể cả khi tháng
  // này chưa có ca nào) OR có ca completed trong tháng này (dù status hiện
  // tại đã đổi sau đó).
  let employeeQuery = supabase
    .from("employees")
    .select("id, role_id, status")
    .in("role_id", STAFF_ROLE_IDS);

  employeeQuery =
    employeeIdsWithActivity.length > 0
      ? employeeQuery.or(
          `status.eq.active,id.in.(${employeeIdsWithActivity.join(",")})`,
        )
      : employeeQuery.eq("status", "active");

  const { data: employees, error: employeesError } = await employeeQuery;
  if (employeesError) throw new Error(employeesError.message);
  if (!employees || employees.length === 0) return [];

  const employeeIds = employees.map((e) => e.id);

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, fullname")
    .in("id", employeeIds);
  if (profilesError) throw new Error(profilesError.message);
  const profileMap = new Map(
    (profiles ?? []).map((p: any) => [p.id, p.fullname]),
  );

  const hoursMap = new Map<string, { shifts: number; hours: number }>();
  const completedWeekdaysByEmployee = new Map<string, Set<string>>();

  for (const s of schedules ?? []) {
    const empId = (s as any).employee_id;
    const session = (s as any).session;
    if (!empId) continue;

    if (session) {
      const entry = hoursMap.get(empId) ?? { shifts: 0, hours: 0 };
      entry.shifts += 1;
      entry.hours += diffHours(session.start_time, session.end_time);
      hoursMap.set(empId, entry);
    }

    const [y, m, d] = (s as any).date.split("-").map(Number);
    const dow = new Date(y, m - 1, d).getDay();
    if (dow >= 1 && dow <= 5) {
      if (!completedWeekdaysByEmployee.has(empId))
        completedWeekdaysByEmployee.set(empId, new Set());
      completedWeekdaysByEmployee.get(empId)!.add((s as any).date);
    }
  }

  const weekdayCountInMonth = countWeekdaysInMonth(params.year, params.month);

  return employees
    .map((emp) => {
      const { shifts, hours } = hoursMap.get(emp.id) ?? { shifts: 0, hours: 0 };
      const completedWeekdays =
        completedWeekdaysByEmployee.get(emp.id)?.size ?? 0;
      const daysOff = weekdayCountInMonth - completedWeekdays;
      const deductibleDaysOff = Math.max(
        0,
        daysOff - FREE_LEAVE_DAYS_PER_MONTH,
      );

      return {
        employeeId: emp.id,
        fullname: profileMap.get(emp.id) ?? "Không rõ",
        completedShifts: shifts,
        totalHours: Math.round(hours * 10) / 10,
        daysOff,
        deductibleDaysOff,
      };
    })
    .sort((a, b) => b.totalHours - a.totalHours);
}
