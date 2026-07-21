"use server";

import { createAdminAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// role_id 3, 4, 5 trong bảng roles là các vai trò "nhân viên" thực sự
// được phép xếp lịch làm việc (vd: lễ tân, kỹ thuật viên, quản lý...).
// Các role khác (admin, khách hàng, ...) không thuộc phạm vi trang này.
// Nếu sau này danh sách role thay đổi, chỉ cần sửa mảng ở đây.
const EMPLOYEE_ROLE_IDS = [3, 4, 5];

export type ScheduleStatus =
  | "assigned" // Admin đã xếp ca
  | "checked_in" // Nhân viên đã check-in
  | "completed" // Nhân viên đã check-out
  | "absent" // Vắng mặt
  | "cancelled"; // Ca bị huỷ

export type SessionRow = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  // day_of_week: 1 = Thứ 2 ... 6 = Thứ 7, 7 = Chủ nhật (theo CHECK constraint
  // của bảng sessions: day_of_week >= 1 AND day_of_week <= 7).
  day_of_week: number | null;
  shift_type: "SA" | "CH" | null;
};

export type EmployeeOption = {
  id: string;
  fullname: string;
  avatar: string | null;
  role_id: number;
  role_name: string | null;
};

/**
 * Lấy danh sách ca làm việc (dùng cho form thêm lịch, checkbox sáng/chiều)
 *
 * LƯU Ý: trước đây hàm này chỉ SELECT id, name, start_time, end_time — thiếu
 * day_of_week và shift_type dù bảng sessions đã có sẵn 2 cột này. Hậu quả:
 * mọi nơi cần biết "ca này áp dụng ngày nào trong tuần" (MyProposalForm,
 * ProposeScheduleModal, AddScheduleForm) không có dữ liệu thật để dùng —
 * MyProposalForm thì lấy phải giá trị undefined, còn 2 chỗ kia phải tự suy
 * luận qua tên session (dễ vỡ nếu đặt tên không đúng quy ước). Sửa lại lấy
 * đủ 2 cột để mọi nơi tiêu thụ SessionRow đều dùng chung 1 nguồn dữ liệu
 * đúng, không cần đoán qua tên nữa.
 */
export async function getSessions(): Promise<SessionRow[]> {
  const supabase = await createAdminAuthClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, name, start_time, end_time, day_of_week, shift_type")
    .order("start_time");

  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Lấy danh sách vai trò dùng cho bộ lọc "tìm theo vai trò" — chỉ trả về
 * các role thuộc EMPLOYEE_ROLE_IDS, không lấy toàn bộ bảng roles (bảng
 * này còn chứa các role không liên quan như admin, khách hàng...).
 */
export async function getRoles() {
  const supabase = await createAdminAuthClient();
  const { data, error } = await supabase
    .from("roles")
    .select("id, role_name")
    .in("id", EMPLOYEE_ROLE_IDS)
    .order("role_name");

  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Lấy danh sách nhân viên đang hoạt động, kèm họ tên + avatar.
 *
 * Lưu ý: employees.id và profiles.id đều tham chiếu độc lập tới
 * auth.users.id — KHÔNG có foreign key trực tiếp giữa employees và
 * profiles. Vì vậy không thể dùng embedding tự động của Supabase
 * (profiles!some_fkey), phải query 2 lần rồi merge bằng tay theo id.
 */
export async function getEmployees(roleId?: number): Promise<EmployeeOption[]> {
  const supabase = await createAdminAuthClient();

  let query = supabase
    .from("employees")
    .select("id, role_id, status, roles ( role_name )")
    .eq("status", "active")
    .in("role_id", EMPLOYEE_ROLE_IDS);

  // roleId (nếu có) chỉ được áp dụng khi nó nằm trong nhóm role nhân viên
  // hợp lệ — tránh trường hợp truyền nhầm 1 role_id ngoài phạm vi cho phép
  if (roleId && EMPLOYEE_ROLE_IDS.includes(roleId))
    query = query.eq("role_id", roleId);

  const { data: employeesData, error } = await query;
  if (error) throw new Error(error.message);
  if (!employeesData || employeesData.length === 0) return [];

  const ids = employeesData.map((e: any) => e.id);
  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("id, fullname, avatar")
    .in("id", ids);

  if (profilesError) throw new Error(profilesError.message);

  const profileMap = new Map((profilesData ?? []).map((p: any) => [p.id, p]));

  return employeesData.map((row: any) => {
    const profile = profileMap.get(row.id);
    return {
      id: row.id,
      fullname: profile?.fullname ?? "Chưa cập nhật tên",
      avatar: profile?.avatar ?? null,
      role_id: row.role_id,
      role_name: row.roles?.role_name ?? null,
    };
  });
}

/**
 * Lấy lịch làm việc trong khoảng ngày (dùng cho lịch tuần), có thể lọc theo
 * vai trò, tìm theo tên nhân viên, hoặc CHỈ lấy lịch của 1 nhân viên cụ thể
 * (dùng cho role 4 — mỗi người chỉ được xem lịch của chính mình).
 */
export async function getSchedules(params: {
  weekStart: string;
  weekEnd: string;
  roleId?: number;
  search?: string;
  onlyEmployeeId?: string;
}) {
  const supabase = await createAdminAuthClient();

  // employees <-> profiles không có FK trực tiếp (xem ghi chú ở getEmployees),
  // nên chỉ join sessions + employees ở đây, còn profile lấy riêng bên dưới.
  let query = supabase
    .from("schedules")
    .select(
      `
      id,
      date,
      status,
      session:sessions ( id, name, start_time, end_time ),
      employee:employees!inner ( id, role_id, roles ( role_name ) )
    `,
    )
    .gte("date", params.weekStart)
    .lte("date", params.weekEnd)
    .in("employee.role_id", EMPLOYEE_ROLE_IDS)
    .order("date");

  if (params.roleId && EMPLOYEE_ROLE_IDS.includes(params.roleId)) {
    query = query.eq("employee.role_id", params.roleId);
  }

  if (params.onlyEmployeeId) {
    query = query.eq("employee_id", params.onlyEmployeeId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return [];

  const employeeIds = [
    ...new Set(data.map((row: any) => row.employee?.id).filter(Boolean)),
  ];
  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("id, fullname, avatar")
    .in("id", employeeIds);

  if (profilesError) throw new Error(profilesError.message);

  const profileMap = new Map((profilesData ?? []).map((p: any) => [p.id, p]));

  let rows = data.map((row: any) => ({
    ...row,
    employee: row.employee
      ? { ...row.employee, profile: profileMap.get(row.employee.id) ?? null }
      : null,
  }));

  if (params.search) {
    const term = params.search.toLowerCase();
    rows = rows.filter((r) =>
      r.employee?.profile?.fullname?.toLowerCase().includes(term),
    );
  }

  return rows;
}

/**
 * Tạo lịch làm việc mới cho 1 nhân viên trong 1 ngày, có thể chọn nhiều ca
 * (vd: chọn cả ca sáng lẫn ca chiều -> tạo 2 dòng schedules).
 * Kiểm tra trùng lịch trước khi insert.
 */
export async function createSchedules(input: {
  employeeId: string;
  date: string;
  sessionIds: number[];
}) {
  if (!input.employeeId || !input.date || input.sessionIds.length === 0) {
    throw new Error("Thiếu thông tin nhân viên, ngày hoặc ca làm việc");
  }

  const supabase = await createAdminAuthClient();

  const { data: existing, error: existingError } = await supabase
    .from("schedules")
    .select("session_id")
    .eq("employee_id", input.employeeId)
    .eq("date", input.date)
    .in("session_id", input.sessionIds);

  if (existingError) throw new Error(existingError.message);
  if (existing && existing.length > 0) {
    throw new Error(
      "Nhân viên đã có lịch cho một trong các ca đã chọn trong ngày này",
    );
  }

  const rows = input.sessionIds.map((sessionId) => ({
    employee_id: input.employeeId,
    session_id: sessionId,
    date: input.date,
    status: "assigned" satisfies ScheduleStatus,
  }));

  const { error } = await supabase.from("schedules").insert(rows);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/schedules");
}

/**
 * Cập nhật trạng thái 1 lịch làm việc (vd: huỷ ca, đánh dấu vắng mặt,
 * hoặc beautician tự check-in/check-out ca của chính mình).
 *
 * Quyền hạn:
 *  - role 1, 2, 3: sửa được mọi lịch, mọi trạng thái.
 *  - role 4 (beautician): CHỈ được sửa lịch có employee_id = chính mình,
 *    và chỉ được chuyển sang 'checked_in' hoặc 'completed' (không được tự
 *    đánh dấu vắng mặt/huỷ ca của mình).
 *  - role khác (vd 5): không được gọi hàm này.
 *
 * Lưu ý: đây là lớp kiểm tra ở tầng ứng dụng — nên đi kèm với RLS tương ứng
 * trên bảng `schedules` (xem migration admin_rls_policies.sql) làm lớp bảo
 * vệ thứ 2, không thay thế cho nhau.
 */
export async function updateScheduleStatus(
  scheduleId: string,
  status: ScheduleStatus,
) {
  const supabase = await createAdminAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Chưa đăng nhập");

  const { data: employee, error: employeeError } = await supabase
    .from("employees")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (employeeError || !employee) {
    throw new Error("Không xác định được vai trò người dùng");
  }

  const roleId = employee.role_id;
  const MANAGER_ROLE_IDS = [1, 2, 3];

  if (!MANAGER_ROLE_IDS.includes(roleId)) {
    if (roleId !== 4) {
      throw new Error("Bạn không có quyền cập nhật lịch làm việc");
    }

    // Role 4: chỉ được sửa đúng lịch của chính mình.
    const { data: schedule, error: scheduleError } = await supabase
      .from("schedules")
      .select("employee_id")
      .eq("id", scheduleId)
      .single();

    if (scheduleError || !schedule) {
      throw new Error("Không tìm thấy lịch làm việc");
    }
    if (schedule.employee_id !== user.id) {
      throw new Error("Bạn chỉ được check-in lịch làm việc của chính mình");
    }
    if (!["checked_in", "completed"].includes(status)) {
      throw new Error(
        "Bạn chỉ được chuyển trạng thái sang 'Đang làm' hoặc 'Hoàn thành'",
      );
    }
  }

  const { error } = await supabase
    .from("schedules")
    .update({ status })
    .eq("id", scheduleId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/schedules");
}

/**
 * Xoá 1 lịch làm việc
 */
export async function deleteSchedule(scheduleId: string) {
  const supabase = await createAdminAuthClient();
  const { error } = await supabase
    .from("schedules")
    .delete()
    .eq("id", scheduleId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/schedules");
}
