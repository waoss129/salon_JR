"use server";

import { createAdminAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Vai trò không chọn slot, chỉ có ngưỡng tối thiểu cuối tuần (Quản lý = 3, Lễ tân = 5).
// Đổi lại nếu role_id thực tế trong DB của bạn khác.
const THRESHOLD_ROLE_IDS = [3, 5];

export type ScheduleWeek = {
  id: string;
  week_start: string;
  week_end: string;
  registration_deadline: string;
  status: "open_for_registration" | "admin_review" | "confirmed";
};

export type CapacityRow = { session_id: number; date: string; slot_target: number };
export type RequirementRow = { date: string; role_id: number; min_count: number };

function toIso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function computeNextWeekRange() {
  const now = new Date();
  const dow = now.getDay() === 0 ? 7 : now.getDay();
  const thisMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  thisMonday.setDate(thisMonday.getDate() - dow + 1);

  const nextMonday = new Date(thisMonday);
  nextMonday.setDate(thisMonday.getDate() + 7);
  const nextSunday = new Date(nextMonday);
  nextSunday.setDate(nextMonday.getDate() + 6);

  // Hạn chót: 21h thứ 7 TUẦN NÀY — trước khi tuần sau bắt đầu
  const thisSaturday = new Date(thisMonday);
  thisSaturday.setDate(thisMonday.getDate() + 5);
  thisSaturday.setHours(21, 0, 0, 0);

  return { weekStart: toIso(nextMonday), weekEnd: toIso(nextSunday), deadlineIso: thisSaturday.toISOString() };
}

async function requireScheduleManager(): Promise<number> {
  const supabase = await createAdminAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Bạn cần đăng nhập lại.");

  const { data: employee } = await supabase
    .from("employees")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (!employee || ![1, 2, 3].includes(employee.role_id)) {
    throw new Error("Bạn không có quyền thiết lập lịch làm việc.");
  }
  return employee.role_id;
}

export async function getActiveOrLatestWeek(): Promise<ScheduleWeek | null> {
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

export async function createScheduleWeek(): Promise<ScheduleWeek> {
  await requireScheduleManager();
  const supabase = await createAdminAuthClient();
  const { weekStart, weekEnd, deadlineIso } = computeNextWeekRange();

  const { data: existing } = await supabase
    .from("schedule_weeks")
    .select("id")
    .eq("week_start", weekStart)
    .maybeSingle();
  if (existing) throw new Error("Tuần này đã được tạo trước đó.");

  const { data, error } = await supabase
    .from("schedule_weeks")
    .insert({
      week_start: weekStart,
      week_end: weekEnd,
      registration_deadline: deadlineIso,
      status: "open_for_registration",
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/admin/schedule-setup");
  return data;
}

export async function getWeekSetup(weekId: string) {
  const supabase = await createAdminAuthClient();

  const { data: capacity, error: capErr } = await supabase
    .from("shift_capacity")
    .select("session_id, date, slot_target")
    .eq("week_id", weekId);
  if (capErr) throw new Error(capErr.message);

  const { data: requirements, error: reqErr } = await supabase
    .from("role_day_requirements")
    .select("date, role_id, min_count")
    .eq("week_id", weekId);
  if (reqErr) throw new Error(reqErr.message);

  return { capacity: (capacity ?? []) as CapacityRow[], requirements: (requirements ?? []) as RequirementRow[] };
}

export async function setShiftCapacity(input: {
  weekId: string;
  sessionId: number;
  date: string;
  slotTarget: number;
}) {
  await requireScheduleManager();
  const supabase = await createAdminAuthClient();

  const { data: existing } = await supabase
    .from("shift_capacity")
    .select("id, slot_target")
    .eq("session_id", input.sessionId)
    .eq("date", input.date)
    .maybeSingle();

  if (existing) {
    if (input.slotTarget < existing.slot_target) {
      throw new Error("Slot chỉ được tăng, không được giảm.");
    }
    const { error } = await supabase
      .from("shift_capacity")
      .update({ slot_target: input.slotTarget })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("shift_capacity").insert({
      week_id: input.weekId,
      session_id: input.sessionId,
      date: input.date,
      slot_target: input.slotTarget,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/schedule-setup");
}

export async function setRoleDayRequirement(input: {
  weekId: string;
  date: string;
  roleId: number;
  minCount: number;
}) {
  await requireScheduleManager();
  if (!THRESHOLD_ROLE_IDS.includes(input.roleId)) {
    throw new Error("Vai trò này không sử dụng ngưỡng tối thiểu.");
  }
  const supabase = await createAdminAuthClient();

  const { data: existing } = await supabase
    .from("role_day_requirements")
    .select("id")
    .eq("date", input.date)
    .eq("role_id", input.roleId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("role_day_requirements")
      .update({ min_count: input.minCount })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("role_day_requirements").insert({
      week_id: input.weekId,
      date: input.date,
      role_id: input.roleId,
      min_count: input.minCount,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/schedule-setup");
}