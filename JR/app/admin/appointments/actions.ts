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
      schedule:schedules!appointments_schedule_id_fkey ( id, date, session_id ),
      details ( service:services ( category_id ) )
    `,
    )
    .eq("id", appointmentId)
    .single();

  if (apptErr) throw new Error(apptErr.message);
  if (!appointment?.schedule) {
    throw new Error("Lịch hẹn này chưa gắn với ngày làm việc nào");
  }

  const scheduleDate = (appointment as any).schedule.date as string;
  const originalSessionId = (appointment as any).schedule.session_id as number;

  const categoryIds = Array.from(
    new Set(
      ((appointment as any).details ?? [])
        .map((d: any) => d.service?.category_id)
        .filter((c: any): c is number => !!c),
    ),
  );
  if (categoryIds.length === 0) return [];

  // 1. Nhân viên có chuyên môn phù hợp
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

  const employeeIds = employees.map((e) => e.id);

  // 2. Lịch làm việc của các nhân viên đó, đúng ngày lịch hẹn
  const { data: daySchedules, error: schedErr } = await supabase
    .from("schedules")
    .select("id, employee_id, session_id, status")
    .in("employee_id", employeeIds)
    .eq("date", scheduleDate)
    .in("status", ["scheduled", "confirmed"]);
  if (schedErr) throw new Error(schedErr.message);
  if (!daySchedules || daySchedules.length === 0) return [];

  // 3. Loại nhân viên đã có lịch hẹn khác (chưa huỷ) trong ngày đó -> không trống
  const scheduleIdsThatDay = daySchedules.map((s) => s.id);
  const { data: busy, error: busyErr } = await supabase
    .from("appointments")
    .select("schedule_id")
    .in("schedule_id", scheduleIdsThatDay)
    .neq("id", appointmentId)
    .neq("status", "cancelled");
  if (busyErr) throw new Error(busyErr.message);

  const busyEmployeeIds = new Set(
    (busy ?? [])
      .map((b) => daySchedules.find((s) => s.id === b.schedule_id)?.employee_id)
      .filter(Boolean),
  );

  const options: AvailableEmployeeOption[] = [];
  for (const emp of employees) {
    if (busyEmployeeIds.has(emp.id)) continue;
    const schedulesOfEmp = daySchedules.filter((s) => s.employee_id === emp.id);
    const preferred = schedulesOfEmp.find(
      (s) => s.session_id === originalSessionId,
    );
    const chosenSchedule = preferred ?? schedulesOfEmp[0];
    if (!chosenSchedule) continue;

    options.push({
      scheduleId: chosenSchedule.id,
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
