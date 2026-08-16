"use server";

import { createAdminAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendScheduleConfirmedEmail } from "@/lib/email/sendScheduleConfirmedEmail";

const SELF_REGISTER_ROLE_IDS = [3, 4, 5];
const CHUYEN_VIEN_ROLE_ID = 4;

async function requireScheduleManager(): Promise<string> {
  const supabase = await createAdminAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Bạn cần đăng nhập lại.");
  const { data: employee } = await supabase.from("employees").select("role_id").eq("id", user.id).single();
  // Khớp PERMISSIONS.schedules.manage trong lib/supabase/permissions.ts:
  // chỉ Admin (1), Quản lý (3) — CEO (2) không còn được duyệt/xếp lịch.
  if (!employee || ![1, 3].includes(employee.role_id)) {
    throw new Error("Bạn không có quyền duyệt lịch làm việc.");
  }
  return user.id;
}

function isWeekend(dateStr: string) {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
}

function toAppDow(dateStr: string) {
  const d = new Date(dateStr).getDay();
  return d === 0 ? 7 : d;
}

export async function getLatestWeek() {
  // Trang duyệt lịch chỉ dành cho role 1, 2, 3 (giống mọi hàm ghi bên dưới)
  // — trước đây hàm này KHÔNG có dòng này, nên ai gọi cũng lấy được tuần
  // mới nhất, mở đường cho getReviewData() lộ toàn bộ dữ liệu nhân viên.
  await requireScheduleManager();

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

export type DropTargetShift = {
  sessionId: number;
  sessionName: string;
  date: string;
  currentCount: number;
  slotTarget: number | null;
  slotsRemaining: number | null;
};

export type RoleDayRow = { date: string; roleId: number; roleName: string; minCount: number; currentCount: number };

export async function getReviewData(weekId: string) {
  // QUAN TRỌNG: đây là hàm trả về đăng ký ca của TOÀN BỘ nhân viên (mọi
  // role) — tuyệt đối không được để lộ cho role 4/5 (chỉ được xem lịch của
  // chính mình, xem PERMISSIONS.schedules trong lib/supabase/permissions.ts).
  await requireScheduleManager();

  const supabase = await createAdminAuthClient();

  // TRƯỚC: 5 query này chạy tuần tự (await từng cái) — mỗi cái tốn 1 round-trip
  // mạng riêng, cộng dồn lại rất chậm. Chúng hoàn toàn độc lập với nhau (không
  // cái nào cần dữ liệu của cái kia), nên gộp chạy song song bằng Promise.all.
  const [weekRowRes, employeesRes, registrationsRes, capacityRes, sessionsRes, roleDayRes] = await Promise.all([
    supabase.from("schedule_weeks").select("week_start").eq("id", weekId).single(),
    supabase
      .from("employees")
      .select("id, role_id, status, roles ( role_name )")
      .eq("status", "active")
      .in("role_id", SELF_REGISTER_ROLE_IDS),
    supabase
      .from("shift_registrations")
      .select("id, employee_id, session_id, date, status, session:sessions ( name )")
      .eq("week_id", weekId)
      .neq("status", "cancelled"),
    supabase
      .from("shift_capacity_status")
      .select("session_id, date, slot_target, current_count, slots_remaining, session:sessions ( name )")
      .eq("week_id", weekId),
    supabase.from("sessions").select("id, name, day_of_week"),
    supabase
      .from("role_day_status")
      .select("date, role_id, min_count, current_count, roles:role_id ( role_name )")
      .eq("week_id", weekId),
  ]);

  if (employeesRes.error) throw new Error(employeesRes.error.message);
  if (registrationsRes.error) throw new Error(registrationsRes.error.message);
  if (capacityRes.error) throw new Error(capacityRes.error.message);
  if (roleDayRes.error) throw new Error(roleDayRes.error.message);

  const employeesData = employeesRes.data;
  const registrations = registrationsRes.data;
  const capacityRaw = capacityRes.data;
  const sessionsData = sessionsRes.data;
  const roleDayRaw = roleDayRes.data;
  const weekStart = weekRowRes.data?.week_start as string | undefined;

  // profiles PHẢI đợi có employeeIds trước — đây là chỗ duy nhất bắt buộc tuần tự.
  const employeeIds = (employeesData ?? []).map((e: any) => e.id);
  const { data: profilesData, error: profilesErr } = await supabase
    .from("profiles")
    .select("id, fullname")
    .in("id", employeeIds.length > 0 ? employeeIds : [""]);
  if (profilesErr) throw new Error(profilesErr.message);
  const profileMap = new Map((profilesData ?? []).map((p: any) => [p.id, p]));

  const regsByEmployee = new Map<string, any[]>();
  const roleByEmployee = new Map<string, number>();
  for (const e of employeesData ?? []) roleByEmployee.set((e as any).id, (e as any).role_id);
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
      meetsMinimum: weekdayCount >= 4 && weekendCount >= 1,
      shifts: regs.map((r: any) => ({
        sessionId: r.session_id,
        sessionName: r.session?.name ?? "",
        date: r.date,
        status: r.status,
      })),
    };
  });

  const weekdayTargets: DropTargetShift[] = (capacityRaw ?? [])
    .filter((c: any) => c.slots_remaining > 0)
    .map((c: any) => ({
      sessionId: c.session_id,
      sessionName: c.session?.name ?? "",
      date: c.date,
      currentCount: c.current_count,
      slotTarget: c.slot_target,
      slotsRemaining: c.slots_remaining,
    }));

  const weekendTargets: DropTargetShift[] = [];
  if (weekStart) {
    for (const offset of [5, 6]) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + offset);
      const date = d.toISOString().slice(0, 10);
      const dow = toAppDow(date);
      const applicableSessions = (sessionsData ?? []).filter((s: any) => s.day_of_week === dow || s.day_of_week === null);
      for (const s of applicableSessions) {
        const currentCount = (registrations ?? []).filter(
          (r: any) => r.session_id === s.id && r.date === date && roleByEmployee.get(r.employee_id) === CHUYEN_VIEN_ROLE_ID,
        ).length;
        weekendTargets.push({ sessionId: s.id, sessionName: (s as any).name, date, currentCount, slotTarget: null, slotsRemaining: null });
      }
    }
  }

  const roleDayStatus: RoleDayRow[] = (roleDayRaw ?? []).map((r: any) => ({
    date: r.date,
    roleId: r.role_id,
    roleName: r.roles?.role_name ?? "",
    minCount: r.min_count,
    currentCount: r.current_count,
  }));

  return {
    byRole: {
      quanLy: employeeSummaries.filter((e) => e.roleId === 3),
      chuyenVien: employeeSummaries.filter((e) => e.roleId === CHUYEN_VIEN_ROLE_ID),
      leTan: employeeSummaries.filter((e) => e.roleId === 5),
    },
    unassignedEmployees: employeeSummaries.filter((e) => !e.meetsMinimum),
    dropTargets: [...weekdayTargets, ...weekendTargets],
    roleDayStatus,
  };
}

export async function assignEmployeeToShift(input: { weekId: string; employeeId: string; sessionId: number; date: string }) {
  const adminId = await requireScheduleManager();
  const supabase = await createAdminAuthClient();

  const { data: week, error: weekErr } = await supabase.from("schedule_weeks").select("status").eq("id", input.weekId).single();
  if (weekErr || !week) throw new Error("Không tìm thấy tuần lịch.");
  if (week.status === "confirmed") {
    throw new Error("Tuần này đã được chốt lịch và gửi mail — không thể chỉnh sửa thêm.");
  }

  const { data: existing } = await supabase
    .from("shift_registrations")
    .select("id")
    .eq("employee_id", input.employeeId)
    .eq("session_id", input.sessionId)
    .eq("date", input.date)
    .neq("status", "cancelled") // dòng đã hủy không tính là "đang có ca này"
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

  const { data: week, error: weekErr } = await supabase.from("schedule_weeks").select("id, status").eq("id", weekId).single();
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

  const byEmployee = new Map<string, any[]>();
  for (const r of registrations as any[]) {
    const arr = byEmployee.get(r.employee_id) ?? [];
    arr.push(r);
    byEmployee.set(r.employee_id, arr);
  }

  const employeeIds = [...byEmployee.keys()];
  const { data: profiles } = await supabase.from("profiles").select("id, fullname, email").in("id", employeeIds);
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
    const result = await sendScheduleConfirmedEmail({ toEmail: profile.email, employeeName: profile.fullname ?? "bạn", shifts: shiftsForEmail });
    if (result.success) sentCount++;
    else failedCount++;
  }

  return { sentCount, failedCount };
}