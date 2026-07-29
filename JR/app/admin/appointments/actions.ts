"use server";

import { createAdminAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type AppointmentRow = {
  id: string;
  appointment_date: string;
  status: AppointmentStatus;
  customer: {
    id: string;
    profile: {
      fullname: string | null;
      avatar: string | null;
      phone: string | null;
    } | null;
  } | null;
  schedule: {
    id: string;
    date: string;
    session: {
      id: number;
      name: string;
      start_time: string;
      end_time: string;
    } | null;
    employee: {
      id: string;
      profile: { fullname: string | null; avatar: string | null } | null;
    } | null;
  } | null;
  details: {
    id: string;
    price: number;
    service: { id: number; name: string; duration: number | null } | null;
  }[];
};

export type AvailableEmployeeOption = {
  scheduleId: string;
  employeeId: string;
  employeeName: string | null;
  employeeLevel: string | null;
};

export type PendingAppointmentSummary = {
  count: number;
  items: {
    id: string;
    appointment_date: string;
    customerName: string | null;
  }[];
};

/**
 * Lấy danh sách lịch hẹn trong 1 ngày cụ thể, có thể lọc theo trạng thái
 * và tìm theo tên khách hàng.
 */
export async function getAppointments(params: {
  date: string; // 'YYYY-MM-DD'
  status?: AppointmentStatus;
  search?: string;
}): Promise<AppointmentRow[]> {
  const supabase = await createAdminAuthClient();

  const dayStart = `${params.date}T00:00:00`;
  const dayEnd = `${params.date}T23:59:59`;

  let query = supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      status,
      customer:customers!appointments_customer_id_fkey (
        id,
        profile:profiles!customers_id_fkey ( fullname, avatar, phone )
      ),
      schedule:schedules!appointments_schedule_id_fkey (
        id,
        date,
        session:sessions ( id, name, start_time, end_time ),
        employee:employees!schedules_employee_id_fkey (
          id,
          profile:profiles!fk_employees_profiles ( fullname, avatar )
        )
      ),
      details ( id, price, service:services ( id, name, duration ) )
    `,
    )
    .gte("appointment_date", dayStart)
    .lte("appointment_date", dayEnd)
    .order("appointment_date");

  if (params.status) query = query.eq("status", params.status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  let rows = (data ?? []) as unknown as AppointmentRow[];

  if (params.search) {
    const term = params.search.toLowerCase();
    rows = rows.filter((r) =>
      r.customer?.profile?.fullname?.toLowerCase().includes(term),
    );
  }

  return rows;
}

/**
 * Cập nhật trạng thái 1 lịch hẹn (xác nhận, huỷ, hoàn thành, khách không đến)
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
) {
  const supabase = await createAdminAuthClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/appointments");
}

/**
 * Tìm các nhân viên (role_id = 4) phù hợp để gán cho 1 lịch hẹn:
 * - Có chuyên môn (employee_categories) khớp với category của dịch vụ đã đặt (details -> services)
 * - Có lịch làm việc (schedules) đúng ngày của lịch hẹn, trạng thái scheduled/confirmed
 * - Chưa có lịch hẹn nào khác (khác cancelled) trong ngày đó -> đang "trống"
 *
 * Trả về schedule_id tương ứng để dùng khi gán (assignAppointmentEmployee),
 * ưu tiên đúng ca (session) của lịch hẹn gốc nếu nhân viên có ca đó,
 * nếu không thì lấy ca bất kỳ trong ngày mà nhân viên đang làm.
 */
export async function getAvailableEmployeesForAppointment(
  appointmentId: string,
): Promise<AvailableEmployeeOption[]> {
  const supabase = await createAdminAuthClient();

  const { data: appointment, error: apptErr } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      details ( service:services ( category_id, duration ) )
    `,
    )
    .eq("id", appointmentId)
    .single();

  if (apptErr || !appointment) throw new Error("Không tìm thấy lịch hẹn");

  const apptStart = new Date(appointment.appointment_date);

  // Lấy ngày & giờ theo giờ Việt Nam — KHÔNG dùng .toTimeString()/.split("T")[0]
  // trực tiếp vì appointment_date là timestamptz: nếu server chạy ở timezone
  // khác VN (vd UTC trên Vercel), 2 cách trên sẽ trả về sai giờ/sai ngày.
  const vnParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(apptStart);
  const vn = (type: string) =>
    vnParts.find((p) => p.type === type)?.value ?? "";
  const scheduleDate = `${vn("year")}-${vn("month")}-${vn("day")}`;
  const timeWithSeconds = `${vn("hour")}:${vn("minute")}:${vn("second")}`;

  const DEFAULT_DURATION_MIN = 60;
  const totalDurationMin = ((appointment as any).details ?? []).reduce(
    (sum: number, d: any) =>
      sum + (d.service?.duration ?? DEFAULT_DURATION_MIN),
    0,
  );
  const apptEnd = new Date(apptStart.getTime() + totalDurationMin * 60 * 1000);

  const categoryIds = Array.from(
    new Set(
      ((appointment as any).details ?? [])
        .map((d: any) => d.service?.category_id)
        .filter((c: any): c is number => !!c),
    ),
  );
  if (categoryIds.length === 0) return [];

  const { data: coveringSessions, error: sessErr } = await supabase
    .from("sessions")
    .select("id")
    .lte("start_time", timeWithSeconds)
    .gt("end_time", timeWithSeconds);
  if (sessErr) throw new Error(sessErr.message);

  const sessionIds = (coveringSessions ?? []).map((s) => s.id);
  if (sessionIds.length === 0) return [];

  const { data: empCats, error: empCatErr } = await supabase
    .from("employee_categories")
    .select("employee_id")
    .in("category_id", categoryIds);
  if (empCatErr) throw new Error(empCatErr.message);

  const candidateEmployeeIds = Array.from(
    new Set((empCats ?? []).map((e) => e.employee_id)),
  );
  if (candidateEmployeeIds.length === 0) return [];

  const { data: employees, error: empErr } = await supabase
    .from("employees")
    .select(
      "id, role_id, status, level, profile:profiles!fk_employees_profiles(fullname)",
    )
    .in("id", candidateEmployeeIds)
    .eq("role_id", 4)
    .eq("status", "active");
  if (empErr) throw new Error(empErr.message);
  if (!employees || employees.length === 0) return [];

  // Lịch làm việc đúng ngày, đúng ca — mỗi nhân viên chỉ có 1 dòng/ca/ngày
  const { data: daySchedules, error: schedErr } = await supabase
    .from("schedules")
    .select("id, employee_id")
    .in(
      "employee_id",
      employees.map((e) => e.id),
    )
    .eq("date", scheduleDate)
    .in("session_id", sessionIds)
    .in("status", ["assigned", "checked_in"]);
  if (schedErr) throw new Error(schedErr.message);
  if (!daySchedules || daySchedules.length === 0) return [];

  const scheduleIds = daySchedules.map((s) => s.id);

  // Lấy TẤT CẢ lịch hẹn khác (chưa huỷ/no_show) đang gán vào các schedule này,
  // để kiểm tra trùng giờ — khác với trước đây (chỉ cần "có tồn tại" là loại luôn)
  const { data: otherAppointments, error: otherErr } = await supabase
    .from("appointments")
    .select(
      "id, schedule_id, appointment_date, details(service:services(duration))",
    )
    .in("schedule_id", scheduleIds)
    .neq("id", appointmentId)
    .not("status", "in", "(cancelled,no_show)");
  if (otherErr) throw new Error(otherErr.message);

  function isOverlapping(otherApptDate: string, otherDurationMin: number) {
    const otherStart = new Date(otherApptDate);
    const otherEnd = new Date(
      otherStart.getTime() + otherDurationMin * 60 * 1000,
    );
    return apptStart < otherEnd && otherStart < apptEnd;
  }

  const busyScheduleIds = new Set<string>();
  for (const other of otherAppointments ?? []) {
    const otherDuration = ((other as any).details ?? []).reduce(
      (sum: number, d: any) =>
        sum + (d.service?.duration ?? DEFAULT_DURATION_MIN),
      0,
    );
    if (isOverlapping(other.appointment_date, otherDuration)) {
      busyScheduleIds.add(other.schedule_id);
    }
  }

  const options: AvailableEmployeeOption[] = [];
  for (const sched of daySchedules) {
    if (busyScheduleIds.has(sched.id)) continue; // Bận đúng giờ này
    const emp = employees.find((e) => e.id === sched.employee_id);
    if (!emp) continue;
    options.push({
      scheduleId: sched.id,
      employeeId: emp.id,
      employeeName: (emp as any).profile?.fullname ?? null,
      employeeLevel: (emp as any).level ?? null,
    });
  }

  return options;
}

/**
 * Gán 1 lịch hẹn cho nhân viên đã chọn (đổi schedule_id) và tự động chuyển
 * trạng thái sang 'confirmed'.
 */
export async function assignAppointmentEmployee(
  appointmentId: string,
  scheduleId: string,
) {
  const supabase = await createAdminAuthClient();
  const { error } = await supabase
    .from("appointments")
    .update({ schedule_id: scheduleId, status: "confirmed" })
    .eq("id", appointmentId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/appointments");
}

/**
 * Tóm tắt lịch hẹn đang "chờ xác nhận" (pending) để hiển thị badge
 * thông báo ở header admin (Tổng quan + toàn bộ trang admin).
 */
export async function getPendingAppointmentsSummary(): Promise<PendingAppointmentSummary> {
  const supabase = await createAdminAuthClient();

  const { data, error, count } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      customer:customers!appointments_customer_id_fkey (
        profile:profiles!customers_id_fkey ( fullname )
      )
    `,
      { count: "exact" },
    )
    .eq("status", "pending")
    .order("appointment_date", { ascending: true })
    .limit(10);

  if (error) throw new Error(error.message);

  return {
    count: count ?? 0,
    items: (data ?? []).map((a: any) => ({
      id: a.id,
      appointment_date: a.appointment_date,
      customerName: a.customer?.profile?.fullname ?? null,
    })),
  };
}
