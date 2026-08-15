import PromotionList from "@/components/admin/PromotionList";
import { requireView } from "@/lib/supabase/admin-guard";
import { canManage } from "@/lib/supabase/permissions";
import { createAdminAuthClient } from "@/lib/supabase/server";

export default async function PromotionsPage() {
  await requireView("promotions");

  // Lấy role của người đang xem để quyết định có hiện nút "+ Thêm mới" và
  // các nút Sửa/Xóa/Bật-tắt hay không — vd: role 5 (lễ tân) và role 2 (CEO)
  // chỉ được xem trang khuyến mãi (xem PERMISSIONS.promotions.manage trong
  // lib/supabase/permissions.ts).
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
  const canManagePromotions = canManage(viewerRoleId, "promotions");

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        Quản lý khuyến mãi
      </h1>
      <PromotionList canManage={canManagePromotions} />
    </div>
  );
}