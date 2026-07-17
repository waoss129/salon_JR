"use server";

import { createClient } from "@/lib/supabase/server";
import { requireViewAction } from "@/lib/supabase/admin-guard";

const STAFF_ROLE_IDS = [3, 4, 5];

type SessionRow = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
};

export type CoverageGap = { date: string; sessionName: string };
export type WorkloadRow = {
  employeeId: string;
  fullname: string;
  shiftCount: number;
};
export type AbsenceRow = {
  employeeId: string;
  fullname: string;
  absentCount: number;
  totalCount: number;
  rate: number;
};

function enumerateDates(start: string, end: string): string[] {
  const dates: string[] = [];
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  const cur = new Date(sy, sm - 1, sd);
  const last = new Date(ey, em - 1, ed);
  while (cur <= last) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

// Suy luận ca áp dụng cho từng ngày dựa theo tên ca (SA/CH T2-T6 hay T7).
// Cùng logic đã dùng ở form Thêm lịch làm việc — nếu sau này thêm cột
// `applies_to` vào bảng sessions thì thay hàm này cho chắc chắn hơn.
function getApplicableSessions(
  dateStr: string,
  sessions: SessionRow[],
): SessionRow[] {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  if (dow >= 1 && dow <= 5)
    return sessions.filter((s) => s.name.toUpperCase().includes("T2-T6"));
  if (dow === 6)
    return sessions.filter((s) => s.name.toUpperCase().includes("T7"));
  return []; // Chủ nhật - chưa có ca nào áp dụng
}

export async function getScheduleStatistics(params: {
  startDate: string;
  endDate: string;
}) {
  await requireViewAction("statistics");
  const supabase = await createClient();

  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select("id, name, start_time, end_time");
  if (sessionsError) throw new Error(sessionsError.message);

  const { data: schedules, error: schedulesError } = await supabase
    .from("schedules")
    .select(
      `
      id, date, status, session_id,
      employee:employees!inner ( id, role_id )
    `,
    )
    .gte("date", params.startDate)
    .lte("date", params.endDate)
    .in("employee.role_id", STAFF_ROLE_IDS);
  if (schedulesError) throw new Error(schedulesError.message);

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

  // 1. Độ phủ ca: liệt kê (ngày, ca) không có ai được xếp còn hiệu lực
  const activeKey = (date: string, sessionId: number) => `${date}-${sessionId}`;
  const filledSlots = new Set(
    (schedules ?? [])
      .filter((s: any) => s.status !== "cancelled")
      .map((s: any) => activeKey(s.date, s.session_id)),
  );

  const gaps: CoverageGap[] = [];
  for (const date of enumerateDates(params.startDate, params.endDate)) {
    for (const session of getApplicableSessions(date, sessions ?? [])) {
      if (!filledSlots.has(activeKey(date, session.id))) {
        gaps.push({ date, sessionName: session.name });
      }
    }
  }
  gaps.sort((a, b) => a.date.localeCompare(b.date));

  // 2. Khối lượng ca theo nhân viên (không tính ca đã huỷ)
  const workloadMap = new Map<string, number>();
  for (const s of schedules ?? []) {
    if ((s as any).status === "cancelled") continue;
    const empId = (s as any).employee?.id;
    if (!empId) continue;
    workloadMap.set(empId, (workloadMap.get(empId) ?? 0) + 1);
  }
  const workload: WorkloadRow[] = [...workloadMap.entries()]
    .map(([employeeId, shiftCount]) => ({
      employeeId,
      fullname: profileMap.get(employeeId) ?? "Không rõ",
      shiftCount,
    }))
    .sort((a, b) => b.shiftCount - a.shiftCount);

  // 3. Tỷ lệ vắng mặt theo nhân viên (trên tổng ca không tính huỷ)
  const absenceMap = new Map<string, { absent: number; total: number }>();
  for (const s of schedules ?? []) {
    if ((s as any).status === "cancelled") continue;
    const empId = (s as any).employee?.id;
    if (!empId) continue;
    const entry = absenceMap.get(empId) ?? { absent: 0, total: 0 };
    entry.total += 1;
    if ((s as any).status === "absent") entry.absent += 1;
    absenceMap.set(empId, entry);
  }
  const absence: AbsenceRow[] = [...absenceMap.entries()]
    .map(([employeeId, { absent, total }]) => ({
      employeeId,
      fullname: profileMap.get(employeeId) ?? "Không rõ",
      absentCount: absent,
      totalCount: total,
      rate: total > 0 ? Math.round((absent / total) * 100) : 0,
    }))
    .sort((a, b) => b.rate - a.rate);

  return { gaps, workload, absence };
}
