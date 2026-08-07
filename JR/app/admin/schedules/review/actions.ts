"use server";

import { createAdminAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendScheduleConfirmedEmail } from "@/lib/email/sendScheduleConfirmedEmail";

// Đồng bộ với setup/actions.ts và register/actions.ts
const SELF_REGISTER_ROLE_IDS = [3, 4, 5]; // Quản lý, Chuyên viên, Lễ tân
const CHUYEN_VIEN_ROLE_ID = 4;
const THRESHOLD_ROLE_IDS = [3, 5];
const MIN_WEEKDAY = 4;
const MIN_WEEKEND = 1;

async function requireScheduleManager(): Promise<string> {
  const supabase = await createAdminAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Bạn cần đăng nhập lại.");

  const { data: employee } = await supabase
    .from("employees")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (!employee || ![1, 2, 3].includes(employee.role_id)) {
    throw new Error("Bạn không có quyền duyệt lịch làm việc.");
  }
  return user.id;
}

function isWeekend(dateStr: string) {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
}

export async function getLatestWeek() {
  const supabase = await createAdminAuthClient();
  const { data, error } = await supabase
    .from("schedule_weeks")
    .select("*")
    .order("week_start", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export type EmployeeRegSummary = {
  employeeId: string;
  fullname: string;
  roleId: number;
  roleName: string;
  weekdayCount: number;
  weekendCount: number;
  meetsMinimum: boolean;
  shifts: { sessionId: number; sessionName: string; date: string; status: string }[];
};

export type ShiftCapacityRow = {
  sessionId: number;
  sessionName: string;
  date: string;
  slotTarget: number;
  currentCount: number;
  slotsRemaining: number;
};

export type RoleDayRow = {
  date: string;
  roleId: number;
  roleName: string;
  minCount: number;
  currentCount: number;
};

export async function getReviewData(weekId: string) {
  const supabase = await createAdminAuthClient();

  // 1. Nhân viên thuộc 3 vai trò, kèm role_name — employees <-> profiles không có FK
  // trực tiếp nên phải query 2 lần rồi merge bằng tay (giống getEmployees ở admin/schedules).
  const { data: employeesData, error: empErr } = await supabase
    .from("employees")
    .select("id, role_id, status, roles ( role_name )")
    .eq("status", "active")
    .in("role_id", SELF_REGISTER_ROLE_IDS);
  if (empErr) throw new Error(empErr.message);

  const employeeIds = (employeesData ?? []).map((e: any) => e.id);
  const { data: profilesData, error: profilesErr } = await supabase
    .from("profiles")
    .select("id, fullname")
    .in("id", employeeIds.length > 0 ? employeeIds : [""]);
  if (profilesErr) throw new Error(profilesErr.message);
  const profileMap = new Map((profilesData ?? []).map((p: any) => [p.id, p]));

  // 2. Đăng ký của tuần này, kèm tên ca
  const { data: registrations, error: regErr } = await supabase
    .from("shift_registrations")
    .select("id, employee_id, session_id, date, status, session:sessions ( name )")
    .eq("week_id", weekId)
    .neq("status", "cancelled");
  if (regErr) throw new Error(regErr.message);

  const regsByEmployee = new Map<string, any[]>();
  for (const r of registrations ?? []) {
    const arr = regsByEmployee.get(r.employee_id) ?? [];
    arr.push(r);
    regsByEmployee.set(r.employee_id, arr);
  }

  const employeeSummaries: EmployeeRegSummary[] = (employeesData ?? []).map((e: any) => {
    const regs = regsByEmployee.get(e.id) ?? [];
    const weekdayCount = regs.filter((r) => !isWeekend(r.date)).length;
    const weekendCount = regs.filter((r) => isWeekend(r.date)).length;
    return {
      employeeId: e.id,
      fullname: profileMap.get(e.id)?.fullname ?? "Chưa cập nhật tên",
      roleId: e.role_id,
      roleName: e.roles?.role_name ?? "",
      weekdayCount,
      weekendCount,
      meetsMinimum: weekdayCount >= MIN_WEEKDAY && weekendCount >= MIN_WEEKEND,
      shifts: regs.map((r: any) => ({
        sessionId: r.session_id,
        sessionName: r.session?.name ?? "",
        date: r.date,
        status: r.status,
      })),
    };
  });

  // 3. Slot chuyên viên (view shift_capacity_status), kèm tên ca
  const { data: capacityRaw, error: capErr } = await supabase
    .from("shift_capacity_status")
    .select("session_id, date, slot_target, current_count, slots_remaining, session:sessions ( name )")
    .eq("week_id", weekId);
  if (capErr) throw new Error(capErr.message);

  const shiftCapacity: ShiftCapacityRow[] = (capacityRaw ?? []).map((c: any) => ({
    sessionId: c.session_id,
    sessionName: c.session?.name ?? "",
    date: c.date,
    slotTarget: c.slot_target,
    currentCount: c.current_count,
    slotsRemaining: c.slots_remaining,
  }));

  // 4. Ngưỡng cuối tuần quản lý/lễ tân (view role_day_status), kèm tên vai trò
  const { data: roleDayRaw, error: roleDayErr } = await supabase
    .from("role_day_status")
    .select("date, role_id, min_count, current_count, roles:role_id ( role_name )")
    .eq("week_id", weekId);
  if (roleDayErr) throw new Error(roleDayErr.message);

  const roleDayStatus: RoleDayRow[] = (roleDayRaw ?? []).map((r: any) => ({
    date: r.date,
    roleId: r.role_id,
    roleName: r.roles?.role_name ?? "",
    minCount: r.min_count,
    currentCount: r.current_count,
  }));

  return {
    byRole: {
      quanLy: employeeSummaries.filter((e) => THRESHOLD_ROLE_IDS.includes(e.roleId) && e.roleId !== 5),
      chuyenVien: employeeSummaries.filter((e) => e.roleId === CHUYEN_VIEN_ROLE_ID),
      leTan: employeeSummaries.filter((e) => e.roleId === 5),
    },
    unassignedEmployees: employeeSummaries.filter((e) => !e.meetsMinimum),
    understaffedShifts: shiftCapacity.filter((s) => s.slotsRemaining > 0),
    roleDayStatus,
  };
}

export async function assignEmployeeToShift(input: {
  weekId: string;
  employeeId: string;
  sessionId: number;
  date: string;
}) {
  const adminId = await requireScheduleManager();
  const supabase = await createAdminAuthClient();

  const { data: existing } = await supabase
    .from("shift_registrations")
    .select("id")
    .eq("employee_id", input.employeeId)
    .eq("session_id", input.sessionId)
    .eq("date", input.date)
    .maybeSingle();
  if (existing) throw new Error("Nhân viên này đã có ca này rồi.");

  const { error } = await supabase.from("shift_registrations").insert({
    week_id: input.weekId,
    employee_id: input.employeeId,
    session_id: input.sessionId,
    date: input.date,
    status: "admin_assigned",
    assigned_by: adminId,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/schedules/review");
}

export async function confirmWeekSchedule(weekId: string) {
  const adminId = await requireScheduleManager();
  const supabase = await createAdminAuthClient();

  const { data: week, error: weekErr } = await supabase
    .from("schedule_weeks")
    .select("id, status")
    .eq("id", weekId)
    .single();
  if (weekErr || !week) throw new Error("Không tìm thấy tuần lịch.");
  if (week.status === "confirmed") throw new Error("Tuần này đã được chốt trước đó.");

  const { data: registrations, error: regErr } = await supabase
    .from("shift_registrations")
    .select("employee_id, session_id, date, session:sessions ( shift_type )")
    .eq("week_id", weekId)
    .neq("status", "cancelled");
  if (regErr) throw new Error(regErr.message);
  if (!registrations || registrations.length === 0) {
    throw new Error("Chưa có ca nào được đăng ký/ghép — không thể chốt lịch rỗng.");
  }

  const scheduleRows = registrations.map((r: any) => ({
    employee_id: r.employee_id,
    session_id: r.session_id,
    date: r.date,
    status: "assigned" as const,
  }));

  const { error: insertErr } = await supabase.from("schedules").insert(scheduleRows);
  if (insertErr) throw new Error(insertErr.message);

  const { error: updateErr } = await supabase
    .from("schedule_weeks")
    .update({ status: "confirmed", confirmed_at: new Date().toISOString(), confirmed_by: adminId })
    .eq("id", weekId);
  if (updateErr) throw new Error(updateErr.message);

  revalidatePath("/admin/schedules/review");
  revalidatePath("/admin/schedules");

  // Gửi mail cho từng nhân viên — không để lỗi mail làm hỏng việc chốt lịch đã lưu.
  const byEmployee = new Map<string, any[]>();
  for (const r of registrations as any[]) {
    const arr = byEmployee.get(r.employee_id) ?? [];
    arr.push(r);
    byEmployee.set(r.employee_id, arr);
  }

  const employeeIds = [...byEmployee.keys()];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, fullname, email")
    .in("id", employeeIds);
  const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));

  let sentCount = 0;
  let failedCount = 0;

  for (const [employeeId, shifts] of byEmployee) {
    const profile = profileMap.get(employeeId);
    if (!profile?.email) {
      failedCount++;
      continue;
    }
    const shiftsForEmail = shifts.map((s: any) => ({
      date: s.date,
      shiftLabel: s.session?.shift_type === "CH" ? "Chiều" : "Sáng",
      isSpecial: isWeekend(s.date),
    }));
    const result = await sendScheduleConfirmedEmail({
      toEmail: profile.email,
      employeeName: profile.fullname ?? "bạn",
      shifts: shiftsForEmail,
    });
    if (result.success) sentCount++;
    else failedCount++;
  }

  return { sentCount, failedCount };
}