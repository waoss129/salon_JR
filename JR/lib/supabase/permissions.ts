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
  services: { view: [1, 2, 3], manage: [1, 2, 3] },
  staff: { view: [1, 2, 3], manage: [1, 2, 3] },
  customers: { view: [1, 2, 3, 5], manage: [1, 2, 3] },
  schedules: { view: [1, 2, 3, 4, 5], manage: [1, 2, 3] },
  appointments: { view: [1, 2, 3, 4, 5], manage: [1, 2, 3] },
  bills: { view: [1, 2, 5], manage: [1, 2, 5] },
  statistics: { view: [1, 2] }, // tạm thời chỉ Admin/CEO
  promotions: { view: [1, 2, 3], manage: [1, 2, 3] }, // chỉ Admin/CEO/Manager
};

export function canView(roleId: number | null, feature: Feature): boolean {
  if (!roleId) return false;
  return PERMISSIONS[feature].view.includes(roleId);
}

export function canManage(roleId: number | null, feature: Feature): boolean {
  if (!roleId) return false;
  return PERMISSIONS[feature].manage?.includes(roleId) ?? false;
}
