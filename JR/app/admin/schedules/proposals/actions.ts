"use server";

import { createAdminAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendScheduleProposalEmail } from "@/lib/email/sendScheduleProposalEmail";

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

const MIN_REGULAR_SHIFTS = 4;
const MIN_SPECIAL_SHIFTS = 1;

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

  const toIso = (d: Date) => d.toISOString().slice(0, 10);

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

/**
 * Tạo 1 gói đề xuất lịch cho 1 nhân viên, cho đúng tuần sau. Admin có thể
 * đề xuất nhiều hơn 1 ca/ngày (SA + CH cùng ngày), miễn tổng ca thường >= 4
 * và tổng ca đặc biệt >= 1 (để nhân viên còn dư mà chọn). Chưa ghi gì vào
 * bảng `schedules` thật — chỉ tạo bản đề xuất, chờ nhân viên chọn rồi admin
 * chốt (Giai đoạn B, C).
 */
export async function createScheduleProposal(input: {
  employeeId: string;
  regularShifts: ProposalShiftInput[]; // ca cho các ngày Thứ 2 - Thứ 6 của tuần sau, không giới hạn 1 ca/ngày
  specialShifts: ProposalShiftInput[]; // ca cho Thứ 7 / Chủ nhật của tuần sau, không giới hạn 1 ca/ngày
}) {
  await requireScheduleManager();

  const supabase = await createAdminAuthClient();
  const { weekStart, weekEnd, deadlineIso, weekdayDates, weekendDates } =
    await getNextWeekInfo();

  if (input.regularShifts.length < MIN_REGULAR_SHIFTS) {
    throw new Error(
      `Cần đề xuất ít nhất ${MIN_REGULAR_SHIFTS} ca thường để nhân viên có đủ để chọn.`,
    );
  }
  if (input.specialShifts.length < MIN_SPECIAL_SHIFTS) {
    throw new Error(`Cần đề xuất ít nhất ${MIN_SPECIAL_SHIFTS} ca đặc biệt.`);
  }

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

  // Gửi mail thông báo — KHÔNG để lỗi gửi mail làm hỏng thao tác tạo đề xuất
  // (đề xuất đã lưu thành công vào DB rồi, chỉ là chưa báo được cho nhân viên
  // qua email; admin vẫn thấy được đề xuất này trong hệ thống bình thường).
  const { data: profile } = await supabase
    .from("profiles")
    .select("fullname, email")
    .eq("id", input.employeeId)
    .single();

  let emailSent = false;
  let emailError: string | undefined;

  if (profile?.email) {
    const emailShifts = [
      ...input.regularShifts.map((s) => ({
        date: s.date,
        shiftType: "regular" as const,
      })),
      ...input.specialShifts.map((s) => ({
        date: s.date,
        shiftType: "special" as const,
      })),
    ];

    // Cần tên ca (Sáng/Chiều) để hiển thị trong mail — tra lại từ bảng sessions.
    const sessionIds = [...input.regularShifts, ...input.specialShifts].map(
      (s) => s.sessionId,
    );
    const { data: sessionRows } = await supabase
      .from("sessions")
      .select("id, name")
      .in("id", sessionIds);
    const sessionNameMap = new Map(
      (sessionRows ?? []).map((s) => [s.id, s.name]),
    );

    const shiftsForEmail = [
      ...input.regularShifts.map((s) => ({
        date: s.date,
        shiftLabel: (sessionNameMap.get(s.sessionId) ?? "")
          .toUpperCase()
          .startsWith("SA")
          ? "Sáng"
          : "Chiều",
        isSpecial: false,
      })),
      ...input.specialShifts.map((s) => ({
        date: s.date,
        shiftLabel: (sessionNameMap.get(s.sessionId) ?? "")
          .toUpperCase()
          .startsWith("SA")
          ? "Sáng"
          : "Chiều",
        isSpecial: true,
      })),
    ];

    const result = await sendScheduleProposalEmail({
      toEmail: profile.email,
      employeeName: profile.fullname ?? "bạn",
      weekStart,
      weekEnd,
      deadlineIso,
      shifts: shiftsForEmail,
    });
    emailSent = result.success;
    emailError = result.error;
  } else {
    emailError = "Nhân viên chưa có email trong hồ sơ.";
  }

  return { batchId: batch.id as string, emailSent, emailError };
}
