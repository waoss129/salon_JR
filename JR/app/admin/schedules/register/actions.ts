"use server";

import { createAdminAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const CHUYEN_VIEN_ROLE_ID = 4;
const SELF_REGISTER_ROLE_IDS = [3, 4, 5];

function isWeekend(dateStr: string) {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
}

async function requireSelfRegisterRole(): Promise<{ userId: string; roleId: number }> {
  const supabase = await createAdminAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Bạn cần đăng nhập lại.");

  const { data: employee } = await supabase
    .from("employees")
    .select("role_id")
    .eq("id", user.id)
    .single();

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

  const { data: sessions, error: sessionsErr } = await supabase
    .from("sessions")
    .select("id, name, start_time, end_time, shift_type, day_of_week");
  if (sessionsErr) throw new Error(sessionsErr.message);

  const { data: capacityStatus, error: capErr } = await supabase
    .from("shift_capacity_status")
    .select("*")
    .eq("week_id", weekId);
  if (capErr) throw new Error(capErr.message);

  return { sessions: sessions ?? [], capacityStatus: capacityStatus ?? [] };
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
  // Đây là cờ "thuộc nhóm bị giới hạn slot" ở MỨC VAI TRÒ, chỉ dùng để UI quyết định
  // có cần hiển thị số liệu capacity không. Quyết định THẬT (có giới hạn cho ĐÚNG
  // ca này hay không) luôn được tính lại trong registerShift() ở dưới, theo cả
  // role LẪN ngày — cuối tuần luôn tự do dù là chuyên viên.
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

  // Quy tắc: chuyên viên bị giới hạn slot CHỈ vào ngày thường (T2-T6).
  // Cuối tuần (T7, CN) mọi vai trò đều đăng ký tự do, không kiểm tra slot.
  const isSlotCapped = roleId === CHUYEN_VIEN_ROLE_ID && !isWeekend(params.date);

  if (isSlotCapped) {
    const { error } = await supabase.rpc("register_shift_slot", {
      p_employee_id: userId,
      p_session_id: params.sessionId,
      p_date: params.date,
      p_week_id: params.weekId,
    });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("shift_registrations").insert({
      week_id: params.weekId,
      employee_id: userId,
      session_id: params.sessionId,
      date: params.date,
      status: "registered",
    });
    if (error) throw new Error(error.message);
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