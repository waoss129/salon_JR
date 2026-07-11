"use server";

import { createClient } from "@/lib/supabase/server";
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

/**
 * Lấy danh sách lịch hẹn trong 1 ngày cụ thể, có thể lọc theo trạng thái
 * và tìm theo tên khách hàng.
 *
 * Lưu ý về join: dùng đúng tên constraint FK thật trong schema
 * (appointments_customer_id_fkey, appointments_schedule_id_fkey,
 * customers_id_fkey, fk_employees_profiles, schedules_employee_id_fkey)
 * để Supabase/PostgREST nhận diện được quan hệ và embed dữ liệu trực tiếp,
 * không cần query rời rồi merge tay như một số chỗ trước đây.
 */
export async function getAppointments(params: {
  date: string; // 'YYYY-MM-DD'
  status?: AppointmentStatus;
  search?: string;
}): Promise<AppointmentRow[]> {
  const supabase = await createClient();

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

  // Tìm theo tên khách hàng lọc ở JS vì đây là field lồng sâu qua 2 lớp
  // quan hệ (appointments -> customers -> profiles)
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
  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/appointments");
}
