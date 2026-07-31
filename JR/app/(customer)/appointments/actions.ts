"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CustomerAppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type CustomerAppointmentRow = {
  id: string;
  appointment_date: string;
  status: CustomerAppointmentStatus;
  schedule: {
    session: { name: string; start_time: string; end_time: string } | null;
    employee: {
      profile: { fullname: string | null } | null;
    } | null;
  } | null;
  details: {
    id: string;
    price: number;
    description: string | null;
    service: { name: string } | null;
  }[];
};

const CANCEL_MIN_HOURS_BEFORE = 2;
const NO_SHOW_GRACE_MINUTES = 30;

/**
 * Tự động chuyển các lịch hẹn đã trễ quá NO_SHOW_GRACE_MINUTES phút
 * (mà vẫn đang pending/confirmed) sang no_show. Chỉ áp dụng cho lịch hẹn
 * của chính khách hàng đang gọi (an toàn theo RLS, không đụng khách khác).
 */
async function expireLateAppointments(customerId: string) {
  const supabase = await createClient();
  const cutoff = new Date(
    Date.now() - NO_SHOW_GRACE_MINUTES * 60 * 1000,
  ).toISOString();

  // Tách riêng 2 trường hợp thay vì gộp chung thành no_show
  await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("customer_id", customerId)
    .eq("status", "pending")          // pending quá giờ -> huỷ (admin chưa kịp duyệt)
    .lt("appointment_date", cutoff);

  await supabase
    .from("appointments")
    .update({ status: "no_show" })
    .eq("customer_id", customerId)
    .eq("status", "confirmed")        // confirmed quá giờ -> mới tính "không đến"
    .lt("appointment_date", cutoff);
}

export async function getMyAppointments(): Promise<CustomerAppointmentRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Vui lòng đăng nhập");

  await expireLateAppointments(user.id);

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      status,
      schedule:schedules!appointments_schedule_id_fkey (
        session:sessions ( name, start_time, end_time ),
        employee:employees!schedules_employee_id_fkey (
          profile:profiles!fk_employees_profiles ( fullname )
        )
      ),
      details ( id, price, description, service:services ( name ) )
    `,
    )
    .eq("customer_id", user.id)
    .order("appointment_date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as CustomerAppointmentRow[];
}

/**
 * Khách tự huỷ lịch hẹn của mình - chỉ được huỷ khi còn cách giờ hẹn
 * ít nhất CANCEL_MIN_HOURS_BEFORE tiếng.
 */
export async function cancelMyAppointment(appointmentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Vui lòng đăng nhập");

  const { data: appointment, error: fetchErr } = await supabase
    .from("appointments")
    .select("id, customer_id, appointment_date, status")
    .eq("id", appointmentId)
    .single();
  if (fetchErr || !appointment) throw new Error("Không tìm thấy lịch hẹn");
  if (appointment.customer_id !== user.id) {
    throw new Error("Bạn không có quyền huỷ lịch hẹn này");
  }
  if (!["pending", "confirmed"].includes(appointment.status)) {
    throw new Error("Lịch hẹn này không thể huỷ");
  }

  const hoursUntil =
    (new Date(appointment.appointment_date).getTime() - Date.now()) /
    (1000 * 60 * 60);
  if (hoursUntil < CANCEL_MIN_HOURS_BEFORE) {
    throw new Error(
      `Chỉ có thể huỷ lịch hẹn trước ít nhất ${CANCEL_MIN_HOURS_BEFORE} tiếng`,
    );
  }

  const { error: updateErr } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", appointmentId);
  if (updateErr) throw new Error(updateErr.message);

  revalidatePath("/appointments");
}
