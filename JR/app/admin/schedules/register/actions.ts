"use server";

import { createAdminAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const CHUYEN_VIEN_ROLE_ID = 4;
const SELF_REGISTER_ROLE_IDS = [3, 4, 5];
const POSTGRES_UNIQUE_VIOLATION = "23505";

function isWeekend(dateStr: string) {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
}

async function requireSelfRegisterRole(): Promise<{ userId: string; roleId: number }> {
  const supabase = await createAdminAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Bạn cần đăng nhập lại.");

  const { data: employee } = await supabase.from("employees").select("role_id").eq("id", user.id).single();
  if (!employee || !SELF_REGISTER_ROLE_IDS.includes(employee.role_id)) {
    throw new Error("Bạn không có quyền đăng ký ca làm việc.");
  }
  return { userId: user.id, roleId: employee.role_id };
}

export async function getActiveWeek() {
  const supabase = await createAdminAuthClient();
  const { data, error } = await supabase
    .from("schedule_weeks")
    .select("*")
    .eq("status", "open_for_registration")
    .order("week_start", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getWeekBoard(weekId: string) {
  const supabase = await createAdminAuthClient();

  const [sessionsRes, capacityRes] = await Promise.all([
    supabase.from("sessions").select("id, name, start_time, end_time, shift_type, day_of_week"),
    supabase.from("shift_capacity_status").select("*").eq("week_id", weekId),
  ]);

  if (sessionsRes.error) throw new Error(sessionsRes.error.message);
  if (capacityRes.error) throw new Error(capacityRes.error.message);

  return { sessions: sessionsRes.data ?? [], capacityStatus: capacityRes.data ?? [] };
}

export async function getMyRegistrations(weekId: string) {
  const { userId } = await requireSelfRegisterRole();
  const supabase = await createAdminAuthClient();

  const { data, error } = await supabase
    .from("shift_registrations")
    .select("id, session_id, date, status")
    .eq("week_id", weekId)
    .eq("employee_id", userId)
    .neq("status", "cancelled");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getMyRoleInfo() {
  const { roleId } = await requireSelfRegisterRole();
  return { roleId, isSlotCapped: roleId === CHUYEN_VIEN_ROLE_ID };
}

export async function registerShift(params: { weekId: string; sessionId: number; date: string }) {
  const { userId, roleId } = await requireSelfRegisterRole();
  const supabase = await createAdminAuthClient();

  const { data: week } = await supabase
    .from("schedule_weeks")
    .select("registration_deadline, status")
    .eq("id", params.weekId)
    .single();

  if (!week || week.status !== "open_for_registration") {
    throw new Error("REGISTRATION_CLOSED");
  }
  if (new Date(week.registration_deadline) < new Date()) {
    throw new Error("DEADLINE_PASSED");
  }

  const isSlotCapped = roleId === CHUYEN_VIEN_ROLE_ID && !isWeekend(params.date);

  if (isSlotCapped) {
    const { error } = await supabase.rpc("register_shift_slot", {
      p_employee_id: userId,
      p_session_id: params.sessionId,
      p_date: params.date,
      p_week_id: params.weekId,
    });
    if (error) {
      // Trùng do bấm nhanh 2 lần / request gửi lặp — kết quả mong muốn (đã có
      // đăng ký cho đúng ca này) đã đạt được, không cần báo lỗi cho người dùng.
      if (error.code === POSTGRES_UNIQUE_VIOLATION || error.message?.includes("shift_registrations_unique")) {
        revalidatePath("/admin/schedules/register");
        return;
      }
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase.from("shift_registrations").insert({
      week_id: params.weekId,
      employee_id: userId,
      session_id: params.sessionId,
      date: params.date,
      status: "registered",
    });
    if (error) {
      if (error.code === POSTGRES_UNIQUE_VIOLATION || error.message?.includes("shift_registrations_unique")) {
        revalidatePath("/admin/schedules/register");
        return;
      }
      throw new Error(error.message);
    }
  }

  revalidatePath("/admin/schedules/register");
}

export async function cancelShift(registrationId: string) {
  const { userId } = await requireSelfRegisterRole();
  const supabase = await createAdminAuthClient();

  const { error } = await supabase.rpc("cancel_shift_registration", {
    p_registration_id: registrationId,
    p_employee_id: userId,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/schedules/register");
}