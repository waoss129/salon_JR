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
  | "payroll"
  | "promotions";

// view: được thấy menu + vào trang xem
// manage: được thêm/sửa/xoá (nếu không khai báo, coi như không ai được sửa)
export const PERMISSIONS: Record<
  Feature,
  { view: number[]; manage?: number[] }
> = {
  dashboard: { view: [1, 2, 3, 4, 5] },
  accounts: { view: [1, 2, 3, 4, 5], manage: [1, 2, 3, 4, 5] },

  // Role 2 (CEO) chỉ xem trang nhân viên, không thêm/sửa/xoá.
  staff: { view: [1, 2, 3], manage: [1, 3] },

  // Role admin, ceo, quản lý, lễ tân được toàn quyền khách hàng.
  customers: { view: [1, 3, 5], manage: [1, 3, 5] },

  // Role 2 (CEO) chỉ xem trang dịch vụ, không thêm/sửa/xoá.
  services: { view: [1, 2, 3], manage: [1, 3] },

  // LƯU Ý: view [1,2,3,4,5] ở đây chỉ là quyền VÀO TRANG lịch, không có
  // nghĩa là thấy TOÀN BỘ lịch của mọi nhân viên. Có 2 role bị giới hạn
  // theo DÒNG DỮ LIỆU (row-level), phải lọc ở tầng query/RLS chứ không
  // xử lý được ở file này — xem canViewOwnScheduleOnly() bên dưới:
  //   - Role 4 (beautician): chỉ xem lịch của CHÍNH MÌNH.
  //   - Role 5 (lễ tân): chỉ xem lịch của CHÍNH MÌNH.
  // Role 1, 2, 3 xem được toàn bộ lịch của tất cả nhân viên.
  // Role 4 VÀ Role 5 đều được tự check-in/hoàn thành ca của CHÍNH MÌNH,
  // không có quyền "sửa" nào khác (không sửa lịch người khác, không xoá,
  // không đổi sang trạng thái vắng mặt/huỷ) — xem canCheckInOwnSchedule().
  schedules: { view: [1, 2, 3, 4, 5], manage: [1, 2, 3] },

  // Role 4 chỉ xem lịch hẹn, không sửa.
  appointments: { view: [1, 2, 3, 4, 5], manage: [1, 3] },

  // Role 2 (CEO) chỉ xem hóa đơn, không được thêm/sửa.
  bills: { view: [1, 2, 3, 5], manage: [1, 3, 5] },

  // Role 5 (lễ tân) và Role 2 (CEO) chỉ xem trang khuyến mãi (để biết
  // mã/điều kiện đang chạy), không thêm/sửa/xóa được — việc "áp dụng vào
  // hóa đơn" là tự động (đã làm ở BillFormModal + RLS riêng cho bảng
  // promotions), không đi qua canManage này. UI phía role 5 và role 2 cần
  // ẩn nút Sửa/Xoá trên trang khuyến mãi tương ứng.
  promotions: { view: [1, 2, 3, 5], manage: [1, 3] },

  // Role 3, 4, 5 KHÔNG thấy menu/trang Thống Kê — họ chỉ thấy số liệu tổng
  // quan sẵn có trên Dashboard (feature "dashboard" ở trên, khác trang này).
  statistics: { view: [1, 2] },
  payroll: { view: [1, 2] },
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
// Role 4 (Beautician) và Role 5 (Lễ tân) chỉ được xem lịch làm việc của
// CHÍNH MÌNH, không được xem lịch của nhân viên khác — dù canView("schedules")
// trả về true cho cả hai (vì họ vẫn được vào trang lịch).
//
// Hàm dưới đây chỉ xác nhận role có bị giới hạn "chỉ xem lịch của chính
// mình" hay không (dùng để quyết định filter ở query). Việc kiểm tra
// "đúng là lịch của CHÍNH NGƯỜI ĐANG ĐĂNG NHẬP" (so khớp schedules.employee_id
// với id đang đăng nhập) PHẢI được làm thêm ở:
//   1. Server action / query lấy danh sách lịch — luôn thêm điều kiện
//      .eq("employee_id", currentUserId) khi canViewOwnScheduleOnly(roleId)
//      trả về true, thay vì lấy toàn bộ bảng schedules.
//   2. Policy RLS SELECT trên bảng `schedules` (khuyến nghị, để chặn cả
//      khi có ai đó gọi thẳng Supabase API bỏ qua server action/query trên).
// Chỉ lọc ở phía UI (component hiển thị) là CHƯA đủ an toàn — dữ liệu
// vẫn có thể lộ ra nếu client gọi thẳng API.
export function canViewOwnScheduleOnly(roleId: number | null): boolean {
  return roleId === ROLE.BEAUTICIAN || roleId === ROLE.RECEPTIONIST;
}

// Role 4 (Beautician) VÀ Role 5 (Receptionist) được phép tự check-in / cập
// nhật trạng thái ca làm việc CỦA CHÍNH MÌNH (vd: assigned -> checked_in ->
// completed), nhưng KHÔNG được sửa lịch của nhân viên khác. canManage
// ("schedules") vẫn trả về false cho cả 2 role này (đúng — họ không "quản
// lý" toàn bộ trang lịch, chỉ tự thao tác trên đúng dòng của mình).
//
// Hàm dưới đây chỉ xác nhận role có ĐỦ TƯ CÁCH để thử check-in hay không.
// Việc kiểm tra "đúng là lịch LÀM VIỆC CỦA CHÍNH NGƯỜI ĐÓ" (so khớp
// schedules.employee_id với id đang đăng nhập) PHẢI được làm thêm ở:
//   1. Server action updateScheduleStatus() — so sánh employee_id với
//      auth.uid() trước khi cho phép update khi roleId === 4 hoặc 5.
//   2. Policy RLS UPDATE trên bảng `schedules` (khuyến nghị, để chặn cả
//      khi có ai đó gọi thẳng Supabase API bỏ qua server action).
// Chỉ dùng hàm này ở phía UI (ẩn/hiện nút check-in) là CHƯA đủ an toàn.
export function canCheckInOwnSchedule(roleId: number | null): boolean {
  return roleId === ROLE.BEAUTICIAN || roleId === ROLE.RECEPTIONIST;
}
// Chỉ Admin (role 1) được đổi email — của chính mình lẫn của nhân viên khác.
// Áp dụng ở UI (ẩn/disable ô email khi không phải Admin) VÀ ở server action
// updateStaff() (đã thêm kiểm tra tương ứng trong app/admin/staff/actions.ts).
export function canChangeEmail(roleId: number | null): boolean {
  return roleId === ROLE.ADMIN;
}