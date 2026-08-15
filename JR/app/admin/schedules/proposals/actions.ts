"use server";

import { createAdminAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
// TẮT: sendScheduleProposalEmail đã bị comment hết trong
// lib/email/sendScheduleProposalEmail.ts (không còn export nào) từ khi
// chuyển sang mô hình đăng ký mới (setup -> register -> review). Toàn bộ
// luồng "đề xuất lịch" ở file này đã ngừng dùng (2 trang gọi tới nó ở
// app/admin/schedule-proposal/* đều redirect ngay dòng đầu), giữ lại file
// này chỉ để không phải xoá — comment import để không vỡ build nữa.
// import { sendScheduleProposalEmail } from "@/lib/email/sendScheduleProposalEmail";
import { sendScheduleConfirmedEmail } from "@/lib/email/sendScheduleConfirmedEmail";

export type ProposalShiftInput = { date: string; sessionId: number };

export type CategoryOption = { id: number; name: string };

export type CandidateEmployee = {
  id: string;
  code: string; // mã chuyên viên rút gọn, vd #A1B2C3D4
  fullname: string;
  avatar: string | null;
};

export type NextWeekInfo = {
  weekStart: string; // Thứ 2 tuần sau, "YYYY-MM-DD"
  weekEnd: string; // Chủ nhật tuần sau
  deadlineIso: string; // 21h Thứ 7 TUẦN NÀY (trước khi tuần sau bắt đầu)
  weekdayDates: string[]; // 5 ngày Thứ 2 - Thứ 6 của tuần sau
  weekendDates: string[]; // [Thứ 7, Chủ nhật] của tuần sau
};

export type PendingProposalItem = {
  id: string; // batch id
  label: string; // text hiện trong dropdown thông báo
  weekStart: string;
};

export type PendingProposalsSummary = {
  // "Đề xuất của tôi" — đề xuất người đang đăng nhập cần vào tự chọn ca.
  // Chỉ có dữ liệu nếu role hiện tại thuộc nhóm được đề xuất lịch (3, 4, 5).
  ownPending: { count: number; items: PendingProposalItem[] };
  // "Cần duyệt" — đề xuất của NGƯỜI KHÁC đang chờ người đang đăng nhập chốt.
  // Chỉ có dữ liệu nếu role hiện tại thuộc nhóm được duyệt lịch (1, 2, 3).
  reviewPending: { count: number; items: PendingProposalItem[] };
};

const MIN_REGULAR_DAYS = 4; // tối thiểu 4/5 ngày thường (Thứ 2 - Thứ 6)
const MIN_SPECIAL_SHIFTS = 1; // tối thiểu 1 ca cuối tuần — được chọn cả Thứ 7 LẪN Chủ nhật nếu muốn, không giới hạn chỉ 1 trong 2 nữa

// ============================================================
// Quyền: chỉ role 1, 2, 3 được đề xuất lịch. Kiểm tra ở đây để báo lỗi
// thân thiện — RLS (schedule_proposal_batches/items, policy "admin_all_*")
// vẫn là lớp chặn cuối cùng nếu ai đó bỏ qua kiểm tra này.
// ============================================================
async function requireScheduleManager(): Promise<number> {
  const supabase = await createAdminAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Bạn cần đăng nhập lại.");

  const { data: employee } = await supabase
    .from("employees")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (!employee || ![1, 2, 3].includes(employee.role_id)) {
    throw new Error("Bạn không có quyền đề xuất lịch làm việc.");
  }

  return employee.role_id;
}

/**
 * Tính khoảng "tuần sau" (Thứ 2 -> Chủ nhật) dựa theo ngày hiện tại, và hạn
 * chót nhân viên phải chọn (21h Thứ 7 TUẦN NÀY — trước khi tuần sau bắt đầu).
 */
export async function getNextWeekInfo(): Promise<NextWeekInfo> {
  const now = new Date();
  const dow = now.getDay() === 0 ? 7 : now.getDay(); // 1 = Thứ 2 ... 7 = CN

  const thisMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  thisMonday.setDate(thisMonday.getDate() - dow + 1);

  const nextMonday = new Date(thisMonday);
  nextMonday.setDate(thisMonday.getDate() + 7);

  const nextSunday = new Date(nextMonday);
  nextSunday.setDate(nextMonday.getDate() + 6);

  // Hạn chót: 21h Thứ 7 của TUẦN NÀY (thisMonday + 5 ngày = Thứ 7).
  const thisSaturday = new Date(thisMonday);
  thisSaturday.setDate(thisMonday.getDate() + 5);
  thisSaturday.setHours(21, 0, 0, 0);

  // KHÔNG dùng d.toISOString().slice(0, 10) ở đây — toISOString() quy đổi
  // sang UTC, làm ngày bị lùi 1 hôm với múi giờ Việt Nam (UTC+7), khiến
  // weekStart/weekEnd trả về sai lệch 1 ngày so với Thứ 2 thật (đây chính
  // là lý do "tuần sau" trước đó bị tô nhầm bắt đầu từ Chủ nhật thay vì
  // Thứ 2). Lấy trực tiếp năm/tháng/ngày theo giờ local thay vì convert UTC.
  const toIso = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const weekdayDates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(nextMonday);
    d.setDate(nextMonday.getDate() + i);
    return toIso(d);
  });

  const weekendDates = [5, 6].map((offset) => {
    const d = new Date(nextMonday);
    d.setDate(nextMonday.getDate() + offset);
    return toIso(d);
  });

  return {
    weekStart: toIso(nextMonday),
    weekEnd: toIso(nextSunday),
    deadlineIso: thisSaturday.toISOString(),
    weekdayDates,
    weekendDates,
  };
}

/**
 * Số lượng + danh sách đề xuất lịch đang chờ xử lý, dùng cho chuông thông
 * báo ở header. Trả về CẢ 2 phần, tuỳ role hiện tại mà phần nào có dữ liệu:
 *  - ownPending: role 3, 4, 5 (đều là nhân viên có thể được đề xuất lịch)
 *    — đề xuất của CHÍNH mình đang ở trạng thái 'awaiting_employee'.
 *  - reviewPending: role 1, 2, 3 (được quyền duyệt lịch) — TOÀN BỘ đề xuất
 *    đang ở trạng thái 'awaiting_admin', chờ chốt.
 * Role 3 (Quản lý) có cả 2 vai nên cả 2 phần đều có dữ liệu; role 4, 5 chỉ
 * có ownPending; role 1, 2 chỉ có reviewPending.
 */
export async function getPendingProposalsSummary(): Promise<PendingProposalsSummary> {
  const empty = { count: 0, items: [] as PendingProposalItem[] };
  const supabase = await createAdminAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ownPending: empty, reviewPending: empty };

  const { data: employee } = await supabase
    .from("employees")
    .select("role_id")
    .eq("id", user.id)
    .single();

  const roleId = employee?.role_id ?? null;

  let ownPending = empty;
  let reviewPending = empty;

  // Nhân viên có thể được đề xuất lịch: Quản lý (3), Chuyên viên (4), Lễ tân (5).
  if (roleId && [3, 4, 5].includes(roleId)) {
    const { data: batches, error } = await supabase
      .from("schedule_proposal_batches")
      .select("id, week_start")
      .eq("employee_id", user.id)
      .eq("status", "awaiting_employee")
      .order("week_start");

    if (error) throw new Error(error.message);

    ownPending = {
      count: batches?.length ?? 0,
      items: (batches ?? []).map((b) => ({
        id: b.id,
        label: `Lịch tuần ${b.week_start} đang chờ bạn chọn`,
        weekStart: b.week_start,
      })),
    };
  }

  // Người được duyệt lịch: Admin (1), CEO (2), Quản lý (3).
  if (roleId && [1, 2, 3].includes(roleId)) {
    const { data: batches, error } = await supabase
      .from("schedule_proposal_batches")
      .select(
        "id, week_start, employee:employees!schedule_proposal_batches_employee_id_fkey ( profile:profiles!fk_employees_profiles ( fullname ) )",
      )
      .eq("status", "awaiting_admin")
      .order("week_start");

    if (error) throw new Error(error.message);

    reviewPending = {
      count: batches?.length ?? 0,
      items: (batches ?? []).map((b: any) => ({
        id: b.id,
        label: `${b.employee?.profile?.fullname ?? "Nhân viên"} đã chọn xong lịch tuần ${b.week_start}, chờ chốt`,
        weekStart: b.week_start,
      })),
    };
  }

  return { ownPending, reviewPending };
}

/**
 * Danh sách danh mục chuyên môn (Hair/Nail/Spa...) để lọc nhân viên.
 */
export async function getEmployeeCategories(): Promise<CategoryOption[]> {
  const supabase = await createAdminAuthClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("status", "active")
    .order("name");

  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Nhân viên (role 4, đang active) thuộc 1 danh mục chuyên môn cụ thể.
 */
export async function getEmployeesByCategory(
  categoryId: number,
): Promise<CandidateEmployee[]> {
  const supabase = await createAdminAuthClient();

  const { data: empCats, error: empCatErr } = await supabase
    .from("employee_categories")
    .select("employee_id")
    .eq("category_id", categoryId);

  if (empCatErr) throw new Error(empCatErr.message);

  const employeeIds = (empCats ?? []).map((e) => e.employee_id);
  if (employeeIds.length === 0) return [];

  const { data: employees, error: empErr } = await supabase
    .from("employees")
    .select(
      "id, status, profile:profiles!fk_employees_profiles ( fullname, avatar )",
    )
    .in("id", employeeIds)
    .eq("role_id", 4)
    .eq("status", "active");

  if (empErr) throw new Error(empErr.message);

  return (employees ?? []).map((e: any) => ({
    id: e.id,
    code: `#${(e.id as string).slice(0, 8).toUpperCase()}`,
    fullname: e.profile?.fullname ?? "Chưa cập nhật tên",
    avatar: e.profile?.avatar ?? null,
  }));
}

// ============================================================
// GIAI ĐOẠN B (tiếp) — NHÂN VIÊN XEM & CHỌN LẠI
// ============================================================

export type ProposalItemView = {
  id: string;
  date: string;
  shiftType: "regular" | "special";
  sessionId: number;
  sessionName: string;
  sessionShiftType: "SA" | "CH" | null;
};

export type MyProposalBatch = {
  id: string;
  weekStart: string;
  weekEnd: string;
  deadlineIso: string;
  status: "awaiting_employee" | "awaiting_admin" | "confirmed";
  isPastDeadline: boolean;
  items: ProposalItemView[];
};

/**
 * Lấy đề xuất lịch của CHÍNH nhân viên đang đăng nhập cho tuần sau (nếu có).
 */
export async function getMyPendingProposal(): Promise<MyProposalBatch | null> {
  const supabase = await createAdminAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Bạn cần đăng nhập lại.");

  const { weekStart } = await getNextWeekInfo();

  const { data: batch, error } = await supabase
    .from("schedule_proposal_batches")
    .select("id, week_start, week_end, deadline, status")
    .eq("employee_id", user.id)
    .eq("week_start", weekStart)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!batch) return null;

  const { data: items, error: itemsError } = await supabase
    .from("schedule_proposal_items")
    .select(
      "id, date, shift_type, session_id, session:sessions ( name, shift_type )",
    )
    .eq("batch_id", batch.id)
    .order("date");

  if (itemsError) throw new Error(itemsError.message);

  return {
    id: batch.id,
    weekStart: batch.week_start,
    weekEnd: batch.week_end,
    deadlineIso: batch.deadline,
    status: batch.status,
    isPastDeadline: new Date(batch.deadline) < new Date(),
    items: (items ?? []).map((it: any) => ({
      id: it.id,
      date: it.date,
      shiftType: it.shift_type,
      sessionId: it.session_id,
      sessionName: it.session?.name ?? "",
      sessionShiftType: it.session?.shift_type ?? null,
    })),
  };
}

/**
 * Nhân viên gửi lựa chọn CUỐI CÙNG cho batch của mình — được tự do giữ
 * nguyên, đổi ca khác, hoặc thêm ngày admin chưa đề xuất. Ràng buộc vẫn
 * giữ nguyên: mỗi ngày thường (T2-T6) chỉ 1 ca, tối thiểu 4/5 ngày; cuối
 * tuần chọn tối thiểu 1, tối đa 2 ngày (T7 và/hoặc CN, độc lập nhau —
 * KHÔNG loại trừ nhau như phía admin).
 */
export async function submitMyProposalSelection(input: {
  batchId: string;
  regularShifts: ProposalShiftInput[];
  specialShifts: ProposalShiftInput[];
}) {
  const supabase = await createAdminAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Bạn cần đăng nhập lại.");

  const { data: batch, error: batchErr } = await supabase
    .from("schedule_proposal_batches")
    .select("id, employee_id, deadline")
    .eq("id", input.batchId)
    .single();

  if (batchErr || !batch) throw new Error("Không tìm thấy đề xuất lịch.");
  if (batch.employee_id !== user.id) {
    throw new Error("Bạn không có quyền sửa đề xuất này.");
  }
  if (new Date(batch.deadline) < new Date()) {
    throw new Error(
      "Đã quá hạn chọn ca (21:00 Thứ 7). Lịch đề xuất ban đầu đã tự động được áp dụng, vui lòng liên hệ Admin nếu cần thay đổi.",
    );
  }

  const { weekdayDates, weekendDates } = await getNextWeekInfo();
  const weekdaySet = new Set(weekdayDates);
  const weekendSet = new Set(weekendDates);

  if (input.regularShifts.some((s) => !weekdaySet.has(s.date))) {
    throw new Error("Ca thường phải rơi vào Thứ 2 - Thứ 6 của tuần sau.");
  }
  if (input.specialShifts.some((s) => !weekendSet.has(s.date))) {
    throw new Error(
      "Ca cuối tuần phải rơi vào Thứ 7 hoặc Chủ nhật của tuần sau.",
    );
  }

  const regularDates = new Set(input.regularShifts.map((s) => s.date));
  if (regularDates.size !== input.regularShifts.length) {
    throw new Error("Mỗi ngày thường chỉ được chọn 1 ca (Sáng hoặc Chiều).");
  }
  if (regularDates.size < MIN_REGULAR_DAYS) {
    throw new Error(`Cần chọn ít nhất ${MIN_REGULAR_DAYS}/5 ngày thường.`);
  }

  const specialDates = new Set(input.specialShifts.map((s) => s.date));
  if (specialDates.size !== input.specialShifts.length) {
    throw new Error("Mỗi ngày cuối tuần chỉ được chọn 1 ca.");
  }
  if (specialDates.size < 1) {
    throw new Error(
      "Cần chọn ít nhất 1 ngày cuối tuần (Thứ 7 và/hoặc Chủ nhật).",
    );
  }

  // Thay toàn bộ items cũ bằng lựa chọn cuối cùng của nhân viên (đơn giản và
  // chắc chắn hơn là dò từng thay đổi, vì nhân viên có thể đổi hẳn sang ca
  // khác admin chưa từng đề xuất).
  const { error: deleteError } = await supabase
    .from("schedule_proposal_items")
    .delete()
    .eq("batch_id", input.batchId);
  if (deleteError) throw new Error(deleteError.message);

  const newItems = [
    ...input.regularShifts.map((s) => ({
      batch_id: input.batchId,
      session_id: s.sessionId,
      date: s.date,
      shift_type: "regular" as const,
    })),
    ...input.specialShifts.map((s) => ({
      batch_id: input.batchId,
      session_id: s.sessionId,
      date: s.date,
      shift_type: "special" as const,
    })),
  ];

  const { error: insertError } = await supabase
    .from("schedule_proposal_items")
    .insert(newItems);
  if (insertError) throw new Error(insertError.message);

  const { error: updateBatchError } = await supabase
    .from("schedule_proposal_batches")
    .update({
      status: "awaiting_admin",
      employee_responded_at: new Date().toISOString(),
    })
    .eq("id", input.batchId);
  if (updateBatchError) throw new Error(updateBatchError.message);

  revalidatePath("/admin/schedule-proposal");
  revalidatePath("/admin/schedules");
}

/**
 * Tạo 1 gói đề xuất lịch cho 1 nhân viên, cho đúng tuần sau.
 * Ràng buộc: mỗi ngày Thứ 2 - Thứ 6 chỉ được 1 ca (Sáng hoặc Chiều), tối
 * thiểu 4/5 ngày phải có ca; cuối tuần tối thiểu 1 ngày (Thứ 7 và/hoặc
 * Chủ nhật, được chọn cả 2 nếu muốn), mỗi ngày cuối tuần cũng chỉ 1 ca.
 * Chưa ghi gì vào bảng `schedules` thật — chỉ tạo bản đề xuất, chờ nhân
 * viên chọn rồi admin chốt (Giai đoạn B, C).
 *
 * TẮT: sendScheduleProposalEmail không còn dùng được (xem comment import ở
 * đầu file) — hàm này vẫn TẠO ĐƯỢC đề xuất lịch bình thường (dữ liệu vẫn
 * lưu vào DB đầy đủ), chỉ riêng bước gửi mail thông báo bị bỏ qua, luôn trả
 * về emailSent: false kèm lý do. Hàm này cũng không còn được gọi từ UI nào
 * (2 trang duy nhất từng gọi tới đều đã redirect), nên trên thực tế không
 * ảnh hưởng gì.
 */
export async function createScheduleProposal(input: {
  employeeId: string;
  regularShifts: ProposalShiftInput[]; // mỗi ngày Thứ 2 - Thứ 6 CHỈ được 1 ca (Sáng hoặc Chiều)
  specialShifts: ProposalShiftInput[]; // cuối tuần: tối thiểu 1 ngày, được chọn cả Thứ 7 lẫn Chủ nhật nếu muốn
}) {
  await requireScheduleManager();

  const supabase = await createAdminAuthClient();
  const { weekStart, weekEnd, deadlineIso, weekdayDates, weekendDates } =
    await getNextWeekInfo();

  const weekdaySet = new Set(weekdayDates);
  const weekendSet = new Set(weekendDates);

  if (input.regularShifts.some((s) => !weekdaySet.has(s.date))) {
    throw new Error("Ca thường phải rơi vào Thứ 2 - Thứ 6 của tuần sau.");
  }
  if (input.specialShifts.some((s) => !weekendSet.has(s.date))) {
    throw new Error(
      "Ca đặc biệt phải rơi vào Thứ 7 hoặc Chủ nhật của tuần sau.",
    );
  }

  // Mỗi ngày thường chỉ được đúng 1 ca (Sáng HOẶC Chiều, không cả 2).
  const regularDateCounts = new Map<string, number>();
  for (const s of input.regularShifts) {
    regularDateCounts.set(s.date, (regularDateCounts.get(s.date) ?? 0) + 1);
  }
  for (const [date, count] of regularDateCounts) {
    if (count > 1) {
      throw new Error(
        `Ngày ${date} chỉ được chọn 1 ca (Sáng hoặc Chiều), không được cả 2.`,
      );
    }
  }

  // Tối thiểu 4/5 ngày thường phải có ca.
  if (regularDateCounts.size < MIN_REGULAR_DAYS) {
    throw new Error(
      `Cần chọn ca cho ít nhất ${MIN_REGULAR_DAYS}/5 ngày thường (Thứ 2 - Thứ 6).`,
    );
  }

  // Mỗi ngày cuối tuần cũng chỉ được đúng 1 ca (giống ngày thường) — nhưng
  // được chọn CẢ Thứ 7 lẫn Chủ nhật nếu muốn, không giới hạn chỉ 1 trong 2.
  const specialDates = new Set(input.specialShifts.map((s) => s.date));
  if (specialDates.size !== input.specialShifts.length) {
    throw new Error("Mỗi ngày cuối tuần chỉ được chọn 1 ca.");
  }
  if (specialDates.size < MIN_SPECIAL_SHIFTS) {
    throw new Error(
      "Cần chọn ít nhất 1 ngày cuối tuần (Thứ 7 và/hoặc Chủ nhật).",
    );
  }

  // Không cho trùng (date, sessionId) trong cùng 1 lần đề xuất.
  const allShifts = [...input.regularShifts, ...input.specialShifts];
  const seen = new Set<string>();
  for (const s of allShifts) {
    const key = `${s.date}-${s.sessionId}`;
    if (seen.has(key)) {
      throw new Error("Có ca bị chọn trùng, vui lòng kiểm tra lại.");
    }
    seen.add(key);
  }

  const { data: existing } = await supabase
    .from("schedule_proposal_batches")
    .select("id")
    .eq("employee_id", input.employeeId)
    .eq("week_start", weekStart)
    .maybeSingle();

  if (existing) {
    throw new Error("Nhân viên này đã có đề xuất lịch cho tuần sau rồi.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: batch, error: batchError } = await supabase
    .from("schedule_proposal_batches")
    .insert({
      employee_id: input.employeeId,
      week_start: weekStart,
      week_end: weekEnd,
      deadline: deadlineIso,
      proposed_by: user?.id ?? null,
    })
    .select()
    .single();

  if (batchError || !batch) {
    throw new Error(batchError?.message ?? "Không thể tạo đề xuất lịch.");
  }

  const items = [
    ...input.regularShifts.map((s) => ({
      batch_id: batch.id,
      session_id: s.sessionId,
      date: s.date,
      shift_type: "regular" as const,
    })),
    ...input.specialShifts.map((s) => ({
      batch_id: batch.id,
      session_id: s.sessionId,
      date: s.date,
      shift_type: "special" as const,
    })),
  ];

  const { error: itemsError } = await supabase
    .from("schedule_proposal_items")
    .insert(items);

  if (itemsError) {
    // Rollback batch nếu thêm items thất bại, tránh để lại batch rỗng.
    await supabase
      .from("schedule_proposal_batches")
      .delete()
      .eq("id", batch.id);
    throw new Error(itemsError.message);
  }

  revalidatePath("/admin/schedules");

  // TẮT: trước đây gửi mail #1 (thông báo có đề xuất mới) bằng
  // sendScheduleProposalEmail — hàm đó không còn dùng được (xem đầu file).
  // Trả về thẳng emailSent: false, không thử gửi nữa, tránh crash hàm.
  return {
    batchId: batch.id as string,
    emailSent: false,
    emailError:
      "Tính năng gửi mail đề xuất đã ngừng sử dụng (đã chuyển sang mô hình đăng ký ca mới).",
  };
}

// ============================================================
// GIAI ĐOẠN C — ADMIN DUYỆT & CHỐT LỊCH
// ============================================================

export type ProposalBatchSummary = {
  batchId: string;
  employeeId: string;
  employeeName: string;
  weekStart: string;
  weekEnd: string;
  deadlineIso: string;
  status: "awaiting_employee" | "awaiting_admin" | "confirmed";
  isPastDeadline: boolean;
  items: {
    date: string;
    shiftType: "regular" | "special";
    sessionName: string;
    sessionShiftType: "SA" | "CH" | null;
  }[];
};

/**
 * Lấy toàn bộ đề xuất lịch (mọi nhân viên) cho tuần sau, kèm các ca đang
 * ĐƯỢC CHỌN (is_selected = true) — dù nhân viên đã tự chọn, hay do quá hạn
 * nên giữ mặc định (is_selected vẫn true từ lúc tạo).
 */
export async function getProposalsForNextWeek(): Promise<
  ProposalBatchSummary[]
> {
  await requireScheduleManager();
  const supabase = await createAdminAuthClient();
  const { weekStart } = await getNextWeekInfo();

  const { data: batches, error } = await supabase
    .from("schedule_proposal_batches")
    .select(
      `
      id, employee_id, week_start, week_end, deadline, status,
      employee:employees!schedule_proposal_batches_employee_id_fkey ( profile:profiles!fk_employees_profiles ( fullname ) )
    `,
    )
    .eq("week_start", weekStart)
    .order("created_at");

  if (error) throw new Error(error.message);
  if (!batches || batches.length === 0) return [];

  const batchIds = batches.map((b) => b.id);
  const { data: items, error: itemsError } = await supabase
    .from("schedule_proposal_items")
    .select("batch_id, date, shift_type, session:sessions ( name, shift_type )")
    .in("batch_id", batchIds)
    .eq("is_selected", true)
    .order("date");

  if (itemsError) throw new Error(itemsError.message);

  const itemsByBatch = new Map<string, any[]>();
  for (const it of items ?? []) {
    const arr = itemsByBatch.get(it.batch_id) ?? [];
    arr.push(it);
    itemsByBatch.set(it.batch_id, arr);
  }

  const now = new Date();
  return (batches as any[]).map((b) => ({
    batchId: b.id,
    employeeId: b.employee_id,
    employeeName: b.employee?.profile?.fullname ?? "—",
    weekStart: b.week_start,
    weekEnd: b.week_end,
    deadlineIso: b.deadline,
    status: b.status,
    isPastDeadline: new Date(b.deadline) < now,
    items: (itemsByBatch.get(b.id) ?? []).map((it: any) => ({
      date: it.date,
      shiftType: it.shift_type,
      sessionName: it.session?.name ?? "",
      sessionShiftType: it.session?.shift_type ?? null,
    })),
  }));
}

/**
 * Admin chốt 1 batch: copy các ca đang được chọn (is_selected = true) thành
 * dòng thật trong bảng `schedules` (status = 'assigned'), đánh dấu batch đã
 * confirmed, rồi gửi mail #2 báo cho nhân viên biết lịch đã chốt.
 *
 * Mail #2 dùng sendScheduleConfirmedEmail — hàm NÀY vẫn hoạt động bình
 * thường (không bị comment như sendScheduleProposalEmail), nên không cần
 * sửa gì ở phần dưới.
 */
export async function confirmProposalBatch(batchId: string) {
  await requireScheduleManager();
  const supabase = await createAdminAuthClient();

  const { data: batch, error: batchErr } = await supabase
    .from("schedule_proposal_batches")
    .select("id, employee_id, status")
    .eq("id", batchId)
    .single();

  if (batchErr || !batch) throw new Error("Không tìm thấy đề xuất lịch.");
  if (batch.status === "confirmed") {
    throw new Error("Đề xuất này đã được chốt trước đó, không thể chốt lại.");
  }

  const { data: items, error: itemsErr } = await supabase
    .from("schedule_proposal_items")
    .select("session_id, date, shift_type, session:sessions ( shift_type )")
    .eq("batch_id", batchId)
    .eq("is_selected", true);

  if (itemsErr) throw new Error(itemsErr.message);
  if (!items || items.length === 0) {
    throw new Error(
      "Không có ca nào được chọn để chốt — không thể tạo lịch rỗng.",
    );
  }

  const scheduleRows = items.map((it) => ({
    employee_id: batch.employee_id,
    session_id: it.session_id,
    date: it.date,
    status: "assigned" as const,
  }));

  const { error: insertErr } = await supabase
    .from("schedules")
    .insert(scheduleRows);
  if (insertErr) throw new Error(insertErr.message);

  const { error: updateErr } = await supabase
    .from("schedule_proposal_batches")
    .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
    .eq("id", batchId);
  if (updateErr) throw new Error(updateErr.message);

  revalidatePath("/admin/schedules");
  revalidatePath("/admin/schedule-proposal/review");

  // Gửi mail #2 — KHÔNG để lỗi mail làm hỏng việc chốt lịch (đã lưu thành
  // công vào schedules rồi, chỉ là chưa báo được cho nhân viên qua email).
  const { data: profile } = await supabase
    .from("profiles")
    .select("fullname, email")
    .eq("id", batch.employee_id)
    .single();

  if (!profile?.email) {
    return {
      emailSent: false,
      emailError: "Nhân viên chưa có email trong hồ sơ.",
    };
  }

  const shiftsForEmail = items.map((it: any) => ({
    date: it.date,
    shiftLabel:
      it.shift_type === "special"
        ? "Cả ngày"
        : it.session?.shift_type === "CH"
          ? "Chiều"
          : "Sáng",
    isSpecial: it.shift_type === "special",
  }));

  const result = await sendScheduleConfirmedEmail({
    toEmail: profile.email,
    employeeName: profile.fullname ?? "bạn",
    shifts: shiftsForEmail,
  });

  return { emailSent: result.success, emailError: result.error };
}