"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SessionOption = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
};

export type ServiceInfo = {
  id: number;
  name: string;
  price: number;
  duration: number | null;
  category_id: number;
  description: string | null;
};

/** Lấy thông tin dịch vụ từ DB theo id (không tin dữ liệu từ URL) */
export async function getServiceById(serviceId: number): Promise<ServiceInfo> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, name, price, duration, category_id, description")
    .eq("id", serviceId)
    .single();
  if (error || !data) throw new Error("Không tìm thấy dịch vụ này");
  return data as ServiceInfo;
}

/** Lấy toàn bộ ca làm việc (sessions) để hiển thị khung giờ chọn */
export async function getAvailableSessionsForDate(
  date: string,
): Promise<SessionOption[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("schedules")
    .select("session:sessions(id, name, start_time, end_time)")
    .eq("date", date)
    .in("status", ["scheduled", "confirmed"]);

  if (error) throw new Error(error.message);

  // Loại trùng session (nhiều nhân viên có thể cùng làm 1 ca)
  const map = new Map<number, SessionOption>();
  for (const row of data ?? []) {
    const s = (row as any).session;
    if (s) map.set(s.id, s);
  }
  return Array.from(map.values()).sort((a, b) =>
    a.start_time.localeCompare(b.start_time),
  );
}
/**
 * Tạo lịch hẹn mới cho khách đang đăng nhập:
 * - Tìm nhân viên (role_id = 4, active) có chuyên môn khớp category dịch vụ,
 *   có lịch làm việc đúng ngày + ca, và đang trống (chưa có lịch hẹn nào
 *   khác - trừ cancelled/no_show - trong ngày đó).
 * - Gán luôn schedule_id của nhân viên đó vào appointment (bắt buộc vì
 *   cột NOT NULL). Admin vẫn có thể đổi lại sau bằng "Gán nhân viên".
 */
export async function createAppointment(params: {
  serviceId: number;
  date: string; // 'YYYY-MM-DD'
  sessionId: number;
  note?: string;
}): Promise<{ appointmentId: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Vui lòng đăng nhập để đặt lịch");

  // Chặn Chủ Nhật ở tầng server (phòng trường hợp bị bypass UI)
  const [y, m, d] = params.date.split("-").map(Number);
  const dayOfWeek = new Date(y, m - 1, d).getDay();
  if (dayOfWeek === 0) {
    throw new Error(
      "JoyRide không mở cửa vào Chủ Nhật, vui lòng chọn ngày khác",
    );
  }

  const { data: session, error: sessionErr } = await supabase
    .from("sessions")
    .select("id, start_time")
    .eq("id", params.sessionId)
    .single();
  if (sessionErr || !session) throw new Error("Khung giờ không hợp lệ");

  const { data: service, error: serviceErr } = await supabase
    .from("services")
    .select("id, price, category_id")
    .eq("id", params.serviceId)
    .single();
  if (serviceErr || !service) throw new Error("Dịch vụ không hợp lệ");

  // 1. Nhân viên có chuyên môn phù hợp
  const { data: empCats, error: empCatErr } = await supabase
    .from("employee_categories")
    .select("employee_id")
    .eq("category_id", service.category_id);
  if (empCatErr) throw new Error(empCatErr.message);

  const candidateIds = Array.from(
    new Set((empCats ?? []).map((e) => e.employee_id)),
  );
  if (candidateIds.length === 0) {
    throw new Error("Hiện chưa có nhân viên phụ trách dịch vụ này");
  }

  const { data: employees, error: empErr } = await supabase
    .from("employees")
    .select("id")
    .in("id", candidateIds)
    .eq("role_id", 4)
    .eq("status", "active");
  if (empErr) throw new Error(empErr.message);
  if (!employees || employees.length === 0) {
    throw new Error("Hiện chưa có nhân viên phụ trách dịch vụ này");
  }

  // 2. Lịch làm việc đúng ngày + ca
  const { data: daySchedules, error: schedErr } = await supabase
    .from("schedules")
    .select("id, employee_id")
    .in(
      "employee_id",
      employees.map((e) => e.id),
    )
    .eq("date", params.date)
    .eq("session_id", params.sessionId)
    .in("status", ["scheduled", "confirmed"]);
  if (schedErr) throw new Error(schedErr.message);
  if (!daySchedules || daySchedules.length === 0) {
    throw new Error(
      "Khung giờ này hiện chưa có nhân viên làm việc, vui lòng chọn khung giờ khác",
    );
  }

  // 3. Loại các nhân viên đã bận (có lịch hẹn khác, trừ cancelled/no_show)
  const scheduleIds = daySchedules.map((s) => s.id);
  const { data: busy, error: busyErr } = await supabase
    .from("appointments")
    .select("schedule_id")
    .in("schedule_id", scheduleIds)
    .not("status", "in", "(cancelled,no_show)");
  if (busyErr) throw new Error(busyErr.message);

  const busyScheduleIds = new Set((busy ?? []).map((b) => b.schedule_id));
  const freeSchedule = daySchedules.find((s) => !busyScheduleIds.has(s.id));

  if (!freeSchedule) {
    throw new Error("Khung giờ này đã kín chỗ, vui lòng chọn khung giờ khác");
  }

  const appointmentDate = `${params.date}T${session.start_time}`;

  const { data: appointment, error: apptErr } = await supabase
    .from("appointments")
    .insert({
      customer_id: user.id,
      schedule_id: freeSchedule.id,
      appointment_date: appointmentDate,
      status: "pending",
    })
    .select("id")
    .single();
  if (apptErr || !appointment) {
    throw new Error(apptErr?.message ?? "Không thể tạo lịch hẹn");
  }

  const { error: detailErr } = await supabase.from("details").insert({
    appointment_id: appointment.id,
    service_id: service.id,
    price: service.price,
    description: params.note || null,
  });
  if (detailErr) throw new Error(detailErr.message);

  revalidatePath("/appointments");
  return { appointmentId: appointment.id };
}
