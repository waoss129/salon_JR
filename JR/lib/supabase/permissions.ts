export const ROLE = {
  ADMIN: 1,
  CEO: 2,
  MANAGER: 3,
  BEAUTICIAN: 4,
  RECEPTIONIST: 5,
} as const;

export type Feature =
  | "dashboard"
  | "accounts"
  | "services"
  | "staff"
  | "customers"
  | "schedules"
  | "appointments"
  | "bills"
  | "statistics"
  | "promotions";

// view: được thấy menu + vào trang xem
// manage: được thêm/sửa/xoá (nếu không khai báo, coi như không ai được sửa)
export const PERMISSIONS: Record<
  Feature,
  { view: number[]; manage?: number[] }
> = {
  dashboard: { view: [1, 2, 3, 4, 5] },
  accounts: { view: [1, 2, 3, 4, 5], manage: [1, 2, 3, 4, 5] },

  staff: { view: [1, 2, 3], manage: [1, 2, 3] },

  // Role admin, ceo, quản lý, lễ tân được toàn quyền khách hàng.
  customers: { view: [1, 2, 3, 5], manage: [1, 2, 3, 5] },

  services: { view: [1, 2, 3], manage: [1, 2, 3] },

  // Role 5 chỉ xem lịch làm việc, không sửa.
  // Role 4 (beautician) CHỈ được xem lịch của CHÍNH MÌNH (lọc ở tầng query,
  // không phải toàn bộ lịch), và chỉ được tự check-in — không có quyền
  // "sửa" nào khác. Đây là quyền theo từng dòng dữ liệu, xem hàm
  // canCheckInOwnSchedule() bên dưới và ghi chú kèm theo.
  schedules: { view: [1, 2, 3, 4, 5], manage: [1, 2, 3] },

  // Role 4 chỉ xem lịch hẹn, không sửa.
  appointments: { view: [1, 2, 3, 4, 5], manage: [1, 2, 3, 5] },

  // Role 2 (CEO) chỉ xem hóa đơn, không được thêm/sửa.
  bills: { view: [1, 2, 3, 5], manage: [1, 3, 5] },

  // Role 5 (lễ tân) chỉ xem trang khuyến mãi (để biết mã/điều kiện đang chạy),
  // không thêm/sửa/xóa được — việc "áp dụng vào hóa đơn" là tự động (đã làm
  // ở BillFormModal + RLS riêng cho bảng promotions), không đi qua canManage này.
  promotions: { view: [1, 3, 5], manage: [1, 3] },

  // Role 3, 4, 5 KHÔNG thấy menu/trang Thống Kê — họ chỉ thấy số liệu tổng
  // quan sẵn có trên Dashboard (feature "dashboard" ở trên, khác trang này).
  statistics: { view: [1, 2] },
};

export function canView(roleId: number | null, feature: Feature): boolean {
  if (!roleId) return false;
  return PERMISSIONS[feature].view.includes(roleId);
}

export function canManage(roleId: number | null, feature: Feature): boolean {
  if (!roleId) return false;
  return PERMISSIONS[feature].manage?.includes(roleId) ?? false;
}

// ============================================================
// TRƯỜNG HỢP ĐẶC BIỆT: quyền theo TỪNG DÒNG DỮ LIỆU, không theo TRANG
// ============================================================
//
// Role 4 (Beautician) được phép tự check-in / cập nhật trạng thái ca làm
// việc CỦA CHÍNH MÌNH (vd: assigned -> checked_in -> completed), nhưng
// KHÔNG được sửa lịch của nhân viên khác. canManage("schedules") vẫn trả
// về false cho role 4 (đúng — họ không "quản lý" toàn bộ trang lịch).
//
// Hàm dưới đây chỉ xác nhận role có ĐỦ TƯ CÁCH để thử check-in hay không.
// Việc kiểm tra "đúng là lịch LÀM VIỆC CỦA CHÍNH NGƯỜI ĐÓ" (so khớp
// schedules.employee_id với id đang đăng nhập) PHẢI được làm thêm ở:
//   1. Server action updateScheduleStatus() — so sánh employee_id với
//      auth.uid() trước khi cho phép update khi roleId === 4.
//   2. Policy RLS UPDATE trên bảng `schedules` (khuyến nghị, để chặn cả
//      khi có ai đó gọi thẳng Supabase API bỏ qua server action).
// Chỉ dùng hàm này ở phía UI (ẩn/hiện nút check-in) là CHƯA đủ an toàn.
export function canCheckInOwnSchedule(roleId: number | null): boolean {
  return roleId === ROLE.BEAUTICIAN;
}
// Chỉ Admin (role 1) được đổi email — của chính mình lẫn của nhân viên khác.
// Áp dụng ở UI (ẩn/disable ô email khi không phải Admin) VÀ ở server action
// updateStaff() (đã thêm kiểm tra tương ứng trong app/admin/staff/actions.ts).
export function canChangeEmail(roleId: number | null): boolean {
  return roleId === ROLE.ADMIN;
}
