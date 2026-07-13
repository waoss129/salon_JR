"use server";

import { createAdminAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================================
// TYPES
// ============================================================

export type DiscountType = "percentage" | "fixed";

export type PromotionListItem = {
  id: string;
  name: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_value: number | null;
  is_first_time: boolean | null;
  day_of_week: number | null;
  start_date: string | null;
  end_date: string;
  is_active: boolean;
  serviceCount: number;
};

export type PromotionDetail = PromotionListItem & {
  serviceIds: number[];
};

export type PromotionPayload = {
  name: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number | null;
  isFirstTime?: boolean;
  dayOfWeek?: number | null;
  startDate?: string | null;
  endDate: string;
  serviceIds: number[];
};

export type SelectableService = {
  id: number;
  name: string;
  categories: { name: string } | null;
};

// ============================================================
// DANH SÁCH
// ============================================================

export async function getPromotions(
  filters: { search?: string } = {},
): Promise<{
  data: PromotionListItem[];
  error: string | null;
}> {
  const supabase = await createAdminAuthClient();

  let query = supabase
    .from("promotions")
    .select(
      `
      id,
      name,
      code,
      discount_type,
      discount_value,
      min_order_value,
      is_first_time,
      day_of_week,
      start_date,
      end_date,
      is_active,
      promotion_services ( service_id )
    `,
    )
    .order("created_at", { ascending: false });

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("getPromotions error:", error);
    return { data: [], error: error.message };
  }

  const promotions: PromotionListItem[] = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    discount_type: p.discount_type as DiscountType,
    discount_value: p.discount_value,
    min_order_value: p.min_order_value,
    is_first_time: p.is_first_time,
    day_of_week: p.day_of_week,
    start_date: p.start_date,
    end_date: p.end_date,
    is_active: p.is_active,
    serviceCount: (p.promotion_services ?? []).length,
  }));

  return { data: promotions, error: null };
}

// ============================================================
// CHI TIẾT (dùng để mở form sửa)
// ============================================================

export async function getPromotionDetail(
  id: string,
): Promise<{ data: PromotionDetail | null; error: string | null }> {
  const supabase = await createAdminAuthClient();

  const { data, error } = await supabase
    .from("promotions")
    .select(
      `
      id,
      name,
      code,
      discount_type,
      discount_value,
      min_order_value,
      is_first_time,
      day_of_week,
      start_date,
      end_date,
      is_active,
      promotion_services ( service_id )
    `,
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("getPromotionDetail error:", error);
    return {
      data: null,
      error: error?.message ?? "Không tìm thấy khuyến mãi.",
    };
  }

  return {
    data: {
      id: data.id,
      name: data.name,
      code: data.code,
      discount_type: data.discount_type as DiscountType,
      discount_value: data.discount_value,
      min_order_value: data.min_order_value,
      is_first_time: data.is_first_time,
      day_of_week: data.day_of_week,
      start_date: data.start_date,
      end_date: data.end_date,
      is_active: data.is_active,
      serviceCount: (data.promotion_services ?? []).length,
      serviceIds: (data.promotion_services ?? []).map((r) => r.service_id),
    },
    error: null,
  };
}

// Danh sách dịch vụ active, dùng cho phần chọn "áp dụng cho dịch vụ cụ thể".
export async function getSelectableServices(): Promise<{
  data: SelectableService[];
  error: string | null;
}> {
  const supabase = await createAdminAuthClient();

  const { data, error } = await supabase
    .from("services")
    .select("id, name, categories ( name )")
    .eq("status", "active")
    .order("name");

  if (error) {
    console.error("getSelectableServices error:", error);
    return { data: [], error: error.message };
  }

  return { data: (data ?? []) as unknown as SelectableService[], error: null };
}

// ============================================================
// TỰ ĐỘNG ÁP DỤNG KHUYẾN MÃI KHI TẠO HÓA ĐƠN
// ============================================================

export type PromotionEligibilityInput = {
  customerId: string;
  appointmentDate: string; // dùng để xác định thứ trong tuần
  lineSubtotals: { serviceId: number; subtotal: number }[]; // từng dòng dịch vụ đang có trong hóa đơn
};

export type BestPromotionResult = {
  promotionId: string;
  promotionCode: string;
  promotionName: string;
  discountAmount: number;
} | null;

function weekdayMondayBased(dateStr: string): number {
  const day = new Date(dateStr).getDay(); // JS: 0 = Chủ nhật, 1 = Thứ 2, ... 6 = Thứ 7
  return day === 0 ? 7 : day; // quy về 1 = Thứ 2 ... 7 = Chủ nhật (đúng quy ước đã dùng trong form)
}

export async function getBestPromotionForBill(
  input: PromotionEligibilityInput,
): Promise<BestPromotionResult> {
  const supabase = await createAdminAuthClient();
  const nowIso = new Date().toISOString();

  const { data: promotions, error } = await supabase
    .from("promotions")
    .select(
      `
      id,
      name,
      code,
      discount_type,
      discount_value,
      min_order_value,
      is_first_time,
      day_of_week,
      start_date,
      end_date,
      promotion_services ( service_id )
    `,
    )
    .eq("is_active", true)
    .gte("end_date", nowIso)
    .or(`start_date.is.null,start_date.lte.${nowIso}`);

  if (error || !promotions || promotions.length === 0) {
    if (error) console.error("getBestPromotionForBill error:", error);
    return null;
  }

  // "Khách hàng lần đầu" = đây là lịch hẹn duy nhất của khách tính đến hiện tại
  // (chưa từng có appointment nào khác trước đó — không phân biệt trạng thái).
  const { count: appointmentCount } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("customer_id", input.customerId);

  const isFirstTimeCustomer = (appointmentCount ?? 0) <= 1;

  const totalSubtotal = input.lineSubtotals.reduce(
    (sum, l) => sum + l.subtotal,
    0,
  );
  const appointmentWeekday = weekdayMondayBased(input.appointmentDate);

  let best: BestPromotionResult = null;

  for (const promo of promotions) {
    if (promo.is_first_time && !isFirstTimeCustomer) continue;
    if (promo.min_order_value != null && totalSubtotal < promo.min_order_value)
      continue;
    if (promo.day_of_week != null && promo.day_of_week !== appointmentWeekday)
      continue;

    const restrictedServiceIds = (promo.promotion_services ?? []).map(
      (r) => r.service_id,
    );

    let base = totalSubtotal;
    if (restrictedServiceIds.length > 0) {
      const matchedLines = input.lineSubtotals.filter((l) =>
        restrictedServiceIds.includes(l.serviceId),
      );
      if (matchedLines.length === 0) continue; // hóa đơn không có dịch vụ nào nằm trong khuyến mãi này
      base = matchedLines.reduce((sum, l) => sum + l.subtotal, 0);
    }

    const discountAmount =
      promo.discount_type === "percentage"
        ? Math.round((base * promo.discount_value) / 100)
        : Math.min(promo.discount_value, base);

    if (discountAmount <= 0) continue;

    if (!best || discountAmount > best.discountAmount) {
      best = {
        promotionId: promo.id,
        promotionCode: promo.code,
        promotionName: promo.name,
        discountAmount,
      };
    }
  }

  return best;
}

export async function createPromotion(
  payload: PromotionPayload,
): Promise<{ data?: { id: string }; error: string | null }> {
  const supabase = await createAdminAuthClient();

  const { data: promotion, error: promoError } = await supabase
    .from("promotions")
    .insert({
      name: payload.name,
      code: payload.code,
      discount_type: payload.discountType,
      discount_value: payload.discountValue,
      min_order_value: payload.minOrderValue ?? null,
      is_first_time: payload.isFirstTime ?? false,
      day_of_week: payload.dayOfWeek ?? null,
      start_date: payload.startDate ?? null,
      end_date: payload.endDate,
      is_active: true,
    })
    .select()
    .single();

  if (promoError || !promotion) {
    console.error("createPromotion error:", promoError);
    return { error: promoError?.message ?? "Không thể tạo khuyến mãi." };
  }

  if (payload.serviceIds.length > 0) {
    const rows = payload.serviceIds.map((serviceId) => ({
      promotion_id: promotion.id,
      service_id: serviceId,
    }));
    const { error: linkError } = await supabase
      .from("promotion_services")
      .insert(rows);
    if (linkError) {
      console.error("createPromotion promotion_services error:", linkError);
      await supabase.from("promotions").delete().eq("id", promotion.id);
      return { error: linkError.message };
    }
  }

  revalidatePath("/admin/promotions");
  return { data: { id: promotion.id }, error: null };
}

// ============================================================
// CẬP NHẬT
// ============================================================

export async function updatePromotion(
  id: string,
  payload: PromotionPayload,
): Promise<{ error: string | null }> {
  const supabase = await createAdminAuthClient();

  const { error: promoError } = await supabase
    .from("promotions")
    .update({
      name: payload.name,
      code: payload.code,
      discount_type: payload.discountType,
      discount_value: payload.discountValue,
      min_order_value: payload.minOrderValue ?? null,
      is_first_time: payload.isFirstTime ?? false,
      day_of_week: payload.dayOfWeek ?? null,
      start_date: payload.startDate ?? null,
      end_date: payload.endDate,
    })
    .eq("id", id);

  if (promoError) {
    console.error("updatePromotion error:", promoError);
    return { error: promoError.message };
  }

  // Đơn giản: xóa hết liên kết dịch vụ cũ rồi thêm lại theo lựa chọn mới.
  const { error: deleteLinkError } = await supabase
    .from("promotion_services")
    .delete()
    .eq("promotion_id", id);

  if (deleteLinkError) {
    console.error("updatePromotion delete links error:", deleteLinkError);
    return { error: deleteLinkError.message };
  }

  if (payload.serviceIds.length > 0) {
    const rows = payload.serviceIds.map((serviceId) => ({
      promotion_id: id,
      service_id: serviceId,
    }));
    const { error: linkError } = await supabase
      .from("promotion_services")
      .insert(rows);
    if (linkError) {
      console.error("updatePromotion insert links error:", linkError);
      return { error: linkError.message };
    }
  }

  revalidatePath("/admin/promotions");
  return { error: null };
}

// ============================================================
// BẬT / TẮT HOẠT ĐỘNG
// ============================================================

export async function togglePromotionActive(
  id: string,
  isActive: boolean,
): Promise<{ error: string | null }> {
  const supabase = await createAdminAuthClient();

  const { error } = await supabase
    .from("promotions")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    console.error("togglePromotionActive error:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/promotions");
  return { error: null };
}

// ============================================================
// XÓA
// ============================================================

export async function deletePromotion(
  id: string,
): Promise<{ error: string | null }> {
  const supabase = await createAdminAuthClient();

  // promotion_services sẽ tự xóa theo nếu bạn đã set ON DELETE CASCADE cho FK đó.
  // Nếu chưa, xóa thủ công liên kết trước để tránh lỗi khóa ngoại.
  await supabase.from("promotion_services").delete().eq("promotion_id", id);

  const { error } = await supabase.from("promotions").delete().eq("id", id);

  if (error) {
    console.error("deletePromotion error:", error);
    // Trường hợp phổ biến: promotion đã được dùng trong bảng `bills` (bills.promotion_id)
    // -> vi phạm khóa ngoại, không xóa được. Nên đề nghị người dùng "Ngừng" thay vì xóa.
    if (error.message.includes("violates foreign key constraint")) {
      return {
        error:
          "Khuyến mãi này đã được dùng trong hóa đơn nên không thể xóa. Hãy dùng chức năng 'Ngừng hoạt động' thay vì xóa.",
      };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/promotions");
  return { error: null };
}
