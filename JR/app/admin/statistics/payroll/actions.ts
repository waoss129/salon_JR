"use server";

import { createAdminAuthClient } from "@/lib/supabase/server";
import { requireViewAction } from "@/lib/supabase/admin-guard";

const STAFF_ROLE_IDS = [3, 4, 5];
const WEEKEND_MULTIPLIER = 2;
const FREE_LEAVE_DAYS_PER_MONTH = 4;

export type PayrollRow = {
  employeeId: string;
  fullname: string;
  baseSalary: number;
  weekdayCountInMonth: number;
  dailyRate: number;
  daysOff: number;
  deductibleDaysOff: number;
  deduction: number;
  weekendDaysWorked: number;
  weekendBonus: number;
  totalPay: number;
};

function countWeekdaysInMonth(year: number, month: number): number {
  const lastDay = new Date(year, month, 0).getDate();
  let count = 0;
  for (let d = 1; d <= lastDay; d++) {
    const dow = new Date(year, month - 1, d).getDay(); // 0 = CN, 6 = T7
    if (dow >= 1 && dow <= 5) count++;
  }
  return count;
}

/**
 * Tính lương tháng cho từng nhân viên:
 *
 *   Giá 1 ngày thường = Lương cứng ÷ Số ngày T2-T6 trong tháng
 *   Số ngày nghỉ = Số ngày T2-T6 KHÔNG có ca `completed` (không phân biệt
 *                  lý do — chưa xếp lịch vì xin nghỉ trước, hay có xếp mà
 *                  bị đánh dấu `absent`/`cancelled`, đều tính như nhau)
 *   Số ngày bị trừ = MAX(0, Số ngày nghỉ − 4)  (mỗi tháng có 4 ngày phép
 *                    miễn phí, KHÔNG dồn được sang tháng sau)
 *   Tiền bị trừ = Số ngày bị trừ × Giá 1 ngày thường
 *
 *   Số ngày cuối tuần đã làm = Số ngày T7/CN có ca `completed` trong tháng
 *   Tiền thưởng cuối tuần = Số ngày cuối tuần đã làm × 2 × Giá 1 ngày thường
 *
 *   Lương tháng = Lương cứng − Tiền bị trừ + Tiền thưởng cuối tuần
 *
 * Chưa tính OT (ngày thường thứ 5+ trong tuần) và ngày lễ — để dành làm sau.
 *
 * QUAN TRỌNG — nhân viên nào được đưa vào bảng lương:
 * Lương phải phản ánh đúng những gì ĐÃ XẢY RA trong tháng, không phụ thuộc
 * vào status HIỆN TẠI của nhân viên lúc xem báo cáo. Một nhân viên có thể
 * làm việc bình thường (có ca completed) rồi giữa/cuối tháng mới bị đổi
 * sang on_leave/inactive/terminated — họ vẫn phải được tính lương đầy đủ
 * cho những ngày đã làm trước đó.
 *
 * Vì vậy danh sách nhân viên đưa vào tính lương là:
 *   - Đang "active" (để vẫn hiện ra kể cả khi tháng này chưa có ca nào), HOẶC
 *   - Có ít nhất 1 dòng lịch làm việc (bất kỳ status) trong khoảng tháng này,
 *     bất kể status hiện tại của họ là gì.
 * KHÔNG còn lọc cứng `.eq("status", "active")` như trước — cách làm đó sẽ
 * loại bỏ hoàn toàn nhân viên đã terminated/inactive giữa tháng, dù họ có
 * ca completed thật sự cần trả lương.
 */
export async function getPayrollStatistics(params: {
  year: number;
  month: number; // 1-12
}): Promise<PayrollRow[]> {
  await requireViewAction("statistics");
  const supabase = await createAdminAuthClient();

  const startDate = `${params.year}-${String(params.month).padStart(2, "0")}-01`;
  const lastDay = new Date(params.year, params.month, 0).getDate();
  const endDate = `${params.year}-${String(params.month).padStart(2, "0")}-${String(
    lastDay,
  ).padStart(2, "0")}`;

  // 1. Lấy TRƯỚC toàn bộ lịch làm việc trong tháng theo role (không lọc theo
  // danh sách nhân viên active/inactive) để biết chính xác ai ĐÃ CÓ hoạt
  // động thực tế trong tháng này, dù status hiện tại của họ là gì.
  const { data: schedules, error: schedulesError } = await supabase
    .from("schedules")
    .select("date, employee_id, status, employee:employees!inner ( role_id )")
    .gte("date", startDate)
    .lte("date", endDate)
    .in("employee.role_id", STAFF_ROLE_IDS);
  if (schedulesError) throw new Error(schedulesError.message);

  const employeeIdsWithActivity = [
    ...new Set((schedules ?? []).map((s: any) => s.employee_id)),
  ];

  // 2. Nhân viên đưa vào bảng lương = đang active OR có hoạt động trong
  // tháng này (xem giải thích ở JSDoc phía trên).
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

  // Lương không nằm trực tiếp trên bảng employees — được lưu dạng lịch sử
  // theo thời gian ở bảng salary_history (mỗi lần đổi lương là 1 dòng mới
  // với effective_from). Lấy dòng lương CÓ HIỆU LỰC GẦN NHẤT tính đến cuối
  // tháng đang xem (effective_from <= endDate), sắp xếp giảm dần theo
  // effective_from rồi lấy dòng đầu tiên cho mỗi nhân viên — đây chính là
  // mức lương đúng cho tháng đó, kể cả khi lương đã đổi ở tháng sau.
  const { data: salaryRows, error: salaryError } = await supabase
    .from("salary_history")
    .select("employee_id, base_salary, effective_from")
    .in("employee_id", employeeIds)
    .lte("effective_from", endDate)
    .order("effective_from", { ascending: false });
  if (salaryError) throw new Error(salaryError.message);

  const baseSalaryMap = new Map<string, number>();
  for (const row of salaryRows ?? []) {
    if (!baseSalaryMap.has((row as any).employee_id)) {
      baseSalaryMap.set((row as any).employee_id, (row as any).base_salary);
    }
  }

  // Set các ngày T2-T6 mà mỗi nhân viên CÓ ca completed
  const completedWeekdaysByEmployee = new Map<string, Set<string>>();
  // Set các ngày cuối tuần mà mỗi nhân viên CÓ ca completed
  const completedWeekendsByEmployee = new Map<string, Set<string>>();

  for (const s of schedules ?? []) {
    if ((s as any).status !== "completed") continue;
    const [y, m, d] = (s as any).date.split("-").map(Number);
    const dow = new Date(y, m - 1, d).getDay();
    const empId = (s as any).employee_id;
    const dateStr = (s as any).date;

    if (dow >= 1 && dow <= 5) {
      if (!completedWeekdaysByEmployee.has(empId))
        completedWeekdaysByEmployee.set(empId, new Set());
      completedWeekdaysByEmployee.get(empId)!.add(dateStr);
    } else {
      if (!completedWeekendsByEmployee.has(empId))
        completedWeekendsByEmployee.set(empId, new Set());
      completedWeekendsByEmployee.get(empId)!.add(dateStr);
    }
  }

  const weekdayCountInMonth = countWeekdaysInMonth(params.year, params.month);

  const rows: PayrollRow[] = employees.map((emp) => {
    const baseSalary = baseSalaryMap.get(emp.id) ?? 0;
    const dailyRate =
      weekdayCountInMonth > 0 ? baseSalary / weekdayCountInMonth : 0;

    const completedWeekdays =
      completedWeekdaysByEmployee.get(emp.id)?.size ?? 0;
    const daysOff = weekdayCountInMonth - completedWeekdays;
    const deductibleDaysOff = Math.max(0, daysOff - FREE_LEAVE_DAYS_PER_MONTH);
    const deduction = Math.round(deductibleDaysOff * dailyRate);

    const weekendDaysWorked =
      completedWeekendsByEmployee.get(emp.id)?.size ?? 0;
    const weekendBonus = Math.round(
      weekendDaysWorked * WEEKEND_MULTIPLIER * dailyRate,
    );

    return {
      employeeId: emp.id,
      fullname: profileMap.get(emp.id) ?? "Không rõ",
      baseSalary,
      weekdayCountInMonth,
      dailyRate: Math.round(dailyRate),
      daysOff,
      deductibleDaysOff,
      deduction,
      weekendDaysWorked,
      weekendBonus,
      totalPay: baseSalary - deduction + weekendBonus,
    };
  });

  return rows.sort((a, b) => b.totalPay - a.totalPay);
}
