import { createAdminAuthClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { canView, canManage, type Feature } from "@/lib/supabase/permissions";

export async function getCurrentAdminRoleId(): Promise<number | null> {
  const supabase = await createAdminAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("employees")
    .select("role_id")
    .eq("id", user.id)
    .single();

  return data?.role_id ?? null;
}

/**
 * Gọi ở đầu mỗi page.tsx (Server Component) cần bảo vệ. Nếu không đủ
 * quyền xem, tự động đá về /admin/dashboard.
 */
export async function requireView(feature: Feature) {
  const roleId = await getCurrentAdminRoleId();
  if (!canView(roleId, feature)) {
    redirect("/admin/dashboard");
  }
  return roleId;
}

/**
 * Gọi ở đầu mỗi Server Action làm thay đổi dữ liệu (thêm/sửa/xoá).
 *
 * KHÔNG dùng redirect() ở đây như requireView() — Server Action thường
 * được gọi từ trong modal/form qua startTransition ở client, nếu redirect
 * sẽ phá luồng try/catch đang hiển thị lỗi trong UI (redirect() ném ra
 * NEXT_REDIRECT, dễ bị catch nhầm thành lỗi thường). Thay vào đó throw
 * Error để client hiển thị đúng thông báo "không có quyền".
 */
export async function requireManage(feature: Feature): Promise<number> {
  const roleId = await getCurrentAdminRoleId();
  if (!canManage(roleId, feature)) {
    throw new Error("Bạn không có quyền thực hiện thao tác này");
  }
  return roleId;
}

/**
 * Giống requireManage nhưng dùng cho Server Action CHỈ ĐỌC dữ liệu (vd
 * thống kê, lọc lại theo bộ lọc mới) — vẫn throw thay vì redirect vì lý
 * do tương tự: các action này thường được gọi lại nhiều lần từ client
 * sau khi trang đã load (đổi filter/tháng/tuần), không phải lúc render
 * trang lần đầu.
 */
export async function requireViewAction(feature: Feature): Promise<number> {
  const roleId = await getCurrentAdminRoleId();
  if (!canView(roleId, feature)) {
    throw new Error("Bạn không có quyền xem dữ liệu này");
  }
  return roleId;
}
