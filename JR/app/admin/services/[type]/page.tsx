import { createAdminAuthClient } from "@/lib/supabase/server";
import ServiceModal from "@/components/admin/ServiceModal";
import ServiceTable from "@/components/admin/ServiceTable";
import { requireView } from "@/lib/supabase/admin-guard";
import { canManage } from "@/lib/supabase/permissions";

export default async function AdminServicesPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  await requireView("services");
  const supabase = await createAdminAuthClient();

  const resolvedParams = await params;
  const type = resolvedParams.type;

  if (!type) return <div>Không tìm thấy loại dịch vụ!</div>;

  const categoryMap: { [key: string]: number } = {
    hair: 1,
    nail: 2,
    spa: 3,
  };

  const categoryId = categoryMap[type.toLowerCase()];

  if (!categoryId) {
    return <div>Danh mục "{type}" không tồn tại!</div>;
  }

  // Lấy role của người đang xem để quyết định có hiện nút "+ Thêm dịch vụ"
  // và cột Hành động (Sửa/Xóa/Bật-tắt) hay không — vd: role 2 (CEO) chỉ
  // được xem trang dịch vụ (xem PERMISSIONS.services.manage trong
  // lib/supabase/permissions.ts).
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
  const canManageServices = canManage(viewerRoleId, "services");

  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .eq("category_id", categoryId)
    .order("name");

  if (error) {
    return <div>Lỗi truy vấn: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Dịch vụ {resolvedParams.type.toUpperCase()}
        </h1>
        {canManageServices && <ServiceModal typeId={categoryId} />}
      </div>

      <ServiceTable
        services={services || []}
        typeId={categoryId}
        canManage={canManageServices}
      />
    </div>
  );
}