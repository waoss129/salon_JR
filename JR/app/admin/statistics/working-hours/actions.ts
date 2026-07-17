"use server";

import { createClient } from "@/lib/supabase/server";
import { requireViewAction } from "@/lib/supabase/admin-guard";

const STAFF_ROLE_IDS = [3, 4, 5];

export type WorkingHoursRow = {
  employeeId: string;
  fullname: string;
  completedShifts: number;
  totalHours: number;
};

function diffHours(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em - (sh * 60 + sm)) / 60;
}

/**
 * Tổng số giờ đã làm THẬT SỰ (chỉ tính ca có status = 'completed', tức đã
 * check-in + check-out xong) của từng nhân viên trong 1 tháng — dùng làm
 * căn cứ tham khảo để tính lương/đối chiếu công. Hệ thống không tự tính
 * ra số tiền lương vì employees chưa có cột đơn giá theo giờ.
 */
export async function getWorkingHoursStatistics(params: {
  year: number;
  month: number; // 1-12
}): Promise<WorkingHoursRow[]> {
  await requireViewAction("statistics");
  const supabase = await createClient();

  const startDate = `${params.year}-${String(params.month).padStart(2, "0")}-01`;
  const lastDayOfMonth = new Date(params.year, params.month, 0).getDate();
  const endDate = `${params.year}-${String(params.month).padStart(2, "0")}-${String(
    lastDayOfMonth,
  ).padStart(2, "0")}`;

  const { data: schedules, error } = await supabase
    .from("schedules")
    .select(
      `
      id, date,
      session:sessions ( start_time, end_time ),
      employee:employees!inner ( id, role_id )
    `,
    )
    .eq("status", "completed")
    .gte("date", startDate)
    .lte("date", endDate)
    .in("employee.role_id", STAFF_ROLE_IDS);

  if (error) throw new Error(error.message);

  const employeeIds = [
    ...new Set(
      (schedules ?? []).map((s: any) => s.employee?.id).filter(Boolean),
    ),
  ];
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, fullname")
    .in(
      "id",
      employeeIds.length > 0
        ? employeeIds
        : ["00000000-0000-0000-0000-000000000000"],
    );
  if (profilesError) throw new Error(profilesError.message);
  const profileMap = new Map(
    (profiles ?? []).map((p: any) => [p.id, p.fullname]),
  );

  const hoursMap = new Map<string, { shifts: number; hours: number }>();
  for (const s of schedules ?? []) {
    const empId = (s as any).employee?.id;
    const session = (s as any).session;
    if (!empId || !session) continue;
    const entry = hoursMap.get(empId) ?? { shifts: 0, hours: 0 };
    entry.shifts += 1;
    entry.hours += diffHours(session.start_time, session.end_time);
    hoursMap.set(empId, entry);
  }

  return [...hoursMap.entries()]
    .map(([employeeId, { shifts, hours }]) => ({
      employeeId,
      fullname: profileMap.get(employeeId) ?? "Không rõ",
      completedShifts: shifts,
      totalHours: Math.round(hours * 10) / 10,
    }))
    .sort((a, b) => b.totalHours - a.totalHours);
}
