"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getBusinessHoursForDate } from "@/lib/supabase/business_hours";

export type ServiceInfo = {
  id: number;
  name: string;
  price: number;
  duration: number | null;
  category_id: number;
  description: string | null;
};

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

/**
 * Tạo lịch hẹn: chỉ ghi nhận ngày/giờ/dịch vụ khách muốn, CHƯA gán nhân
 * viên hay ca làm việc cụ thể (schedule_id để null). Admin sẽ xem thông
 * báo và gán nhân viên phù hợp sau, qua trang /admin/appointments.
 */
export async function createAppointment(params: {
  serviceId: number;
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:mm'
  note?: string;
}): Promise<{ appointmentId: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Vui lòng đăng nhập để đặt lịch");

  // Chặn đặt lịch nếu tài khoản đang bị khoá hoặc tạm ngưng
  const { data: customer } = await supabase
    .from("customers")
    .select("status")
    .eq("id", user.id)
    .single();

  if (customer?.status === "inactive") {
    throw new Error(
      "Tài khoản của bạn đang tạm ngưng, không thể đặt lịch mới lúc này",
    );
  }

  const hours = getBusinessHoursForDate(params.date);
  if (!hours) {
    throw new Error(
      "JoyRide không mở cửa vào ngày này, vui lòng chọn ngày khác",
    );
  }
  const slotHour = Number(params.time.split(":")[0]);
  if (slotHour < hours.start || slotHour >= hours.end) {
    throw new Error("Khung giờ không hợp lệ");
  }

  const { data: service, error: serviceErr } = await supabase
    .from("services")
    .select("id, price")
    .eq("id", params.serviceId)
    .single();
  if (serviceErr || !service) throw new Error("Dịch vụ không hợp lệ");

  const appointmentDate = `${params.date}T${params.time}:00`;

  const { data: appointment, error: apptErr } = await supabase
    .from("appointments")
    .insert({
      customer_id: user.id,
      schedule_id: null,
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
