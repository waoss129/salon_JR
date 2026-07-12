"use server";

// TODO: chỉnh lại đường dẫn import cho đúng với dự án của bạn.
// Đây là đường dẫn phổ biến cho Next.js App Router + Supabase SSR.
import { createAdminAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================================
// TYPES
// ============================================================

export type BillStatus = "unpaid" | "paid" | "refunded";

export type BillListItem = {
  id: string;
  billCode: string;
  customerName: string;
  phone: string;
  totalPrice: number;
  createdAt: string;
  paidAt: string | null;
  status: BillStatus;
};

export type BillableAppointment = {
  id: string;
  appointment_date: string;
  customers: {
    id: string;
    profiles: {
      fullname: string | null;
      phone: string | null;
      dob: string | null;
      gender: string | null;
    } | null;
  } | null;
};

export type ActiveService = {
  id: number;
  name: string;
  price: number;
  category_id: number;
  categories: { name: string } | null;
};

export type CreateBillServiceLine = {
  serviceId: number;
  quantity: number;
  priceAtTime: number;
};

export type CreateBillPayload = {
  appointmentId: string;
  services: CreateBillServiceLine[];
  promotionId?: string | null;
  discountAmount?: number;
};

export type BillDetail = {
  id: string;
  total_price: number;
  discount_amount: number;
  status: BillStatus;
  created_at: string;
  updated_at: string;
  appointments: {
    id: string;
    appointment_date: string;
    customers: {
      id: string;
      profiles: {
        fullname: string | null;
        phone: string | null;
        dob: string | null;
        gender: string | null;
      } | null;
    } | null;
  } | null;
  lines: {
    id: string;
    quantity: number;
    price_at_time: number;
    subtotal: number;
    services: { name: string; categories: { name: string } | null } | null;
  }[];
};

// ============================================================
// DANH SÁCH HÓA ĐƠN
// ============================================================

export async function getBills(
  filters: { date?: string; search?: string } = {},
): Promise<{ data: BillListItem[]; error: string | null }> {
  const supabase = await createAdminAuthClient();

  let query = supabase
    .from("bills")
    .select(
      `
      id,
      total_price,
      status,
      created_at,
      updated_at,
      appointments!inner (
        id,
        customers!inner (
          id,
          profiles!inner ( fullname, phone )
        )
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (filters.date) {
    query = query
      .gte("created_at", `${filters.date}T00:00:00`)
      .lte("created_at", `${filters.date}T23:59:59`);
  }

  if (filters.search) {
    // Filter trên bảng embedded (profiles) — cú pháp dot-path của PostgREST/Supabase-js.
    query = query.or(
      `fullname.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`,
      { foreignTable: "appointments.customers.profiles" },
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("getBills error:", error);
    return { data: [], error: error.message };
  }

  const bills: BillListItem[] = (data ?? []).map((b: any) => ({
    id: b.id,
    billCode: `#${b.id.slice(0, 8).toUpperCase()}`,
    customerName: b.appointments?.customers?.profiles?.fullname ?? "—",
    phone: b.appointments?.customers?.profiles?.phone ?? "—",
    totalPrice: b.total_price,
    createdAt: b.created_at,
    // Xấp xỉ "ngày thanh toán" bằng lần cập nhật gần nhất khi status = paid.
    // DB hiện chưa có cột paid_at riêng, nên đây chỉ là giá trị gần đúng.
    paidAt: b.status === "paid" ? b.updated_at : null,
    status: b.status,
  }));

  return { data: bills, error: null };
}

// ============================================================
// TẠO HÓA ĐƠN — CHỌN APPOINTMENT ĐÃ COMPLETED & CHƯA CÓ BILL
// ============================================================

export async function getBillableAppointments(
  search?: string,
): Promise<{ data: BillableAppointment[]; error: string | null }> {
  const supabase = await createAdminAuthClient();

  // Loại các appointment đã có hóa đơn rồi.
  const { data: billedRows, error: billedError } = await supabase
    .from("bills")
    .select("appointment_id");

  if (billedError) {
    console.error(
      "getBillableAppointments (billed lookup) error:",
      billedError,
    );
    return { data: [], error: billedError.message };
  }

  const billedIds = (billedRows ?? []).map((r) => r.appointment_id);

  let query = supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      customers!inner (
        id,
        profiles!inner ( fullname, phone, dob, gender )
      )
    `,
    )
    .eq("status", "completed")
    .order("appointment_date", { ascending: false });

  if (billedIds.length > 0) {
    query = query.not("id", "in", `(${billedIds.join(",")})`);
  }

  if (search) {
    query = query.or(`fullname.ilike.%${search}%,phone.ilike.%${search}%`, {
      foreignTable: "customers.profiles",
    });
  }

  const { data, error } = await query;

  if (error) {
    console.error("getBillableAppointments error:", error);
    return { data: [], error: error.message };
  }

  return { data: (data as any) ?? [], error: null };
}

// Lấy dịch vụ gốc đã đặt của 1 appointment (bảng `details`) để auto-fill dòng dịch vụ đầu tiên.
export async function getAppointmentOriginalService(appointmentId: string) {
  const supabase = await createAdminAuthClient();

  const { data, error } = await supabase
    .from("details")
    .select(
      `
      service_id,
      price,
      services (
        id,
        name,
        price,
        category_id,
        categories ( name )
      )
    `,
    )
    .eq("appointment_id", appointmentId)
    .maybeSingle();

  if (error) {
    console.error("getAppointmentOriginalService error:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Danh sách dịch vụ đang active, dùng cho dropdown "thêm dịch vụ phát sinh".
export async function getActiveServices(): Promise<{
  data: ActiveService[];
  error: string | null;
}> {
  const supabase = await createAdminAuthClient();

  const { data, error } = await supabase
    .from("services")
    .select("id, name, price, category_id, categories ( name )")
    .eq("status", "active")
    .order("name");

  if (error) {
    console.error("getActiveServices error:", error);
    return { data: [], error: error.message };
  }

  return { data: (data as any) ?? [], error: null };
}

export async function createBill(
  payload: CreateBillPayload,
): Promise<{ data?: { id: string }; error: string | null }> {
  const supabase = await createAdminAuthClient();

  if (!payload.services.length) {
    return { error: "Hóa đơn phải có ít nhất 1 dịch vụ." };
  }

  const subtotalSum = payload.services.reduce(
    (sum, s) => sum + s.quantity * s.priceAtTime,
    0,
  );
  const discountAmount = payload.discountAmount ?? 0;
  const totalPrice = subtotalSum - discountAmount;

  const { data: bill, error: billError } = await supabase
    .from("bills")
    .insert({
      appointment_id: payload.appointmentId,
      promotion_id: payload.promotionId ?? null,
      total_price: totalPrice,
      discount_amount: discountAmount,
      status: "unpaid",
    })
    .select()
    .single();

  if (billError || !bill) {
    console.error("createBill error:", billError);
    return { error: billError?.message ?? "Không thể tạo hóa đơn." };
  }

  const billServiceRows = payload.services.map((s) => ({
    bill_id: bill.id,
    service_id: s.serviceId,
    quantity: s.quantity,
    price_at_time: s.priceAtTime,
  }));

  const { error: bsError } = await supabase
    .from("bill_services")
    .insert(billServiceRows);

  if (bsError) {
    console.error("createBill bill_services error:", bsError);
    // Rollback hóa đơn vừa tạo vì thêm dòng dịch vụ thất bại.
    await supabase.from("bills").delete().eq("id", bill.id);
    return { error: bsError.message };
  }

  revalidatePath("/admin/bills");
  return { data: { id: bill.id }, error: null };
}

// ============================================================
// CHI TIẾT / XÁC NHẬN THANH TOÁN
// ============================================================

export async function getBillDetail(
  billId: string,
): Promise<{ data: BillDetail | null; error: string | null }> {
  const supabase = await createAdminAuthClient();

  const { data: bill, error } = await supabase
    .from("bills")
    .select(
      `
      id,
      total_price,
      discount_amount,
      status,
      created_at,
      updated_at,
      appointments (
        id,
        appointment_date,
        customers (
          id,
          profiles ( fullname, phone, dob, gender )
        )
      )
    `,
    )
    .eq("id", billId)
    .single();

  if (error || !bill) {
    console.error("getBillDetail error:", error);
    return { data: null, error: error?.message ?? "Không tìm thấy hóa đơn." };
  }

  const { data: lines, error: lineError } = await supabase
    .from("bill_services")
    .select(
      `
      id,
      quantity,
      price_at_time,
      subtotal,
      services ( name, categories ( name ) )
    `,
    )
    .eq("bill_id", billId);

  if (lineError) {
    console.error("getBillDetail lines error:", lineError);
  }

  return {
    data: { ...(bill as any), lines: (lines as any) ?? [] },
    error: null,
  };
}

// Thu ngân xác nhận đã nhận tiền: unpaid -> paid.
export async function confirmBillPayment(billId: string): Promise<{
  data?: { id: string; status: BillStatus };
  error: string | null;
}> {
  const supabase = await createAdminAuthClient();

  const { data, error } = await supabase
    .from("bills")
    .update({ status: "paid" })
    .eq("id", billId)
    .eq("status", "unpaid") // tránh xác nhận 2 lần hoặc xác nhận nhầm bill đã refund
    .select()
    .single();

  if (error || !data) {
    console.error("confirmBillPayment error:", error);
    return {
      error:
        error?.message ??
        "Không thể xác nhận thanh toán (hóa đơn có thể đã được xử lý).",
    };
  }

  revalidatePath("/admin/bills");
  return { data: { id: data.id, status: data.status }, error: null };
}
