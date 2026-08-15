"use server";

import { createAdminAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
export type CapacityStatusRow = { session_id: number; date: string; current_count: number };

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

  let nextMonday = new Date(thisMonday);
  nextMonday.setDate(thisMonday.getDate() + 7);

  let thisSaturday = new Date(thisMonday);
  thisSaturday.setDate(thisMonday.getDate() + 5);
  thisSaturday.setHours(21, 0, 0, 0);

  // Nếu hạn chót tính ra đã trôi qua (tạo tuần vào tối Thứ 7 sau 21h, hoặc vào
  // Chủ nhật) — đẩy toàn bộ sang thêm 1 tuần nữa, để hạn đăng ký luôn nằm
  // trong tương lai. Không làm vậy thì tuần vừa tạo sẽ "hết hạn" ngay lập tức.
  if (thisSaturday.getTime() <= now.getTime()) {
    nextMonday.setDate(nextMonday.getDate() + 7);
    thisSaturday.setDate(thisSaturday.getDate() + 7);
  }

  const nextSunday = new Date(nextMonday);
  nextSunday.setDate(nextMonday.getDate() + 6);

  return { weekStart: toIso(nextMonday), weekEnd: toIso(nextSunday), deadlineIso: thisSaturday.toISOString() };
}

async function requireScheduleManager(): Promise<number> {
  const supabase = await createAdminAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Bạn cần đăng nhập lại.");

  const { data: employee } = await supabase.from("employees").select("role_id").eq("id", user.id).single();
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

  const { data: existing } = await supabase.from("schedule_weeks").select("id").eq("week_start", weekStart).maybeSingle();
  if (existing) throw new Error("Tuần này đã được tạo trước đó.");

  const { data, error } = await supabase
    .from("schedule_weeks")
    .insert({ week_start: weekStart, week_end: weekEnd, registration_deadline: deadlineIso, status: "open_for_registration" })
    .select()
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/admin/schedules/setup");
  return data;
}

export async function getWeekSetup(weekId: string) {
  const supabase = await createAdminAuthClient();

  // 3 query độc lập, không cái nào cần dữ liệu của cái kia — gộp song song
  // thay vì đợi tuần tự từng cái (trước đây tốn 3 round-trip nối tiếp nhau).
  const [capacityRes, requirementsRes, capacityStatusRes] = await Promise.all([
    supabase.from("shift_capacity").select("session_id, date, slot_target").eq("week_id", weekId),
    supabase.from("role_day_requirements").select("date, role_id, min_count").eq("week_id", weekId),
    supabase.from("shift_capacity_status").select("session_id, date, current_count").eq("week_id", weekId),
  ]);

  if (capacityRes.error) throw new Error(capacityRes.error.message);
  if (requirementsRes.error) throw new Error(requirementsRes.error.message);
  if (capacityStatusRes.error) throw new Error(capacityStatusRes.error.message);

  return {
    capacity: (capacityRes.data ?? []) as CapacityRow[],
    requirements: (requirementsRes.data ?? []) as RequirementRow[],
    capacityStatus: (capacityStatusRes.data ?? []) as CapacityStatusRow[],
  };
}

export async function setShiftCapacity(input: { weekId: string; sessionId: number; date: string; slotTarget: number }) {
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
      const { count, error: countErr } = await supabase
        .from("shift_registrations")
        .select("id", { count: "exact", head: true })
        .eq("session_id", input.sessionId)
        .eq("date", input.date)
        .neq("status", "cancelled");
      if (countErr) throw new Error(countErr.message);

      if ((count ?? 0) > input.slotTarget) {
        throw new Error(`Không thể giảm xuống dưới số người đã đăng ký hiện tại (đang có ${count} người).`);
      }
    }

    const { error } = await supabase.from("shift_capacity").update({ slot_target: input.slotTarget }).eq("id", existing.id);
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

  revalidatePath("/admin/schedules/setup");
}

export async function setRoleDayRequirement(input: { weekId: string; date: string; roleId: number; minCount: number }) {
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
    const { error } = await supabase.from("role_day_requirements").update({ min_count: input.minCount }).eq("id", existing.id);
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

  revalidatePath("/admin/schedules/setup");
}