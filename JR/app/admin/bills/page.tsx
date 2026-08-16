import BillList from "@/components/admin/BillList";
import { requireView } from "@/lib/supabase/admin-guard";
import { canManage } from "@/lib/supabase/permissions";
import { createAdminAuthClient } from "@/lib/supabase/server";

export default async function BillsPage() {
  await requireView("bills");

  // Lấy role của người đang xem để quyết định có hiện nút "+ Thêm mới" và
  // "Xác nhận thanh toán" hay không — vd: role 2 (CEO) chỉ được xem hóa
  // đơn (xem PERMISSIONS.bills.manage trong lib/supabase/permissions.ts).
  const supabase = await createAdminAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let viewerRoleId: number | null = null;
  if (user) {
    const { data: employee } = await supabase
      .from("employees")
      .select("role_id")
      .eq("id", user.id)
      .single();
    viewerRoleId = employee?.role_id ?? null;
  }
  const canManageBills = canManage(viewerRoleId, "bills");

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        Quản lý hóa đơn
      </h1>
      <BillList canManage={canManageBills} />
    </div>
  );
}