import { createAdminAuthClient } from "@/lib/supabase/server";
import { deleteService } from "@/app/admin/services/actions";
import ServiceModal from "@/components/admin/ServiceModal";
import ServiceTable from "@/components/admin/ServiceTable";
import { requireView } from "@/lib/supabase/admin-guard";

export default async function AdminServicesPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  await requireView("services");
  const supabase = await createAdminAuthClient();

  //giu nguyen logic lay supabase va categoryId

  // 1. Lấy và xử lý params an toàn
  const resolvedParams = await params;
  const type = resolvedParams.type;

  if (!type) return <div>Không tìm thấy loại dịch vụ!</div>;

  // 2. Ánh xạ (Map) từ chữ trên URL sang ID trong Database
  const categoryMap: { [key: string]: number } = {
    hair: 1,
    nail: 2,
    spa: 3,
  };

  const categoryId = categoryMap[type.toLowerCase()];

  if (!categoryId) {
    return <div>Danh mục "{type}" không tồn tại!</div>;
  }

  // 3. Truy vấn dữ liệu
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .eq("category_id", categoryId);

  if (error) {
    return <div>Lỗi truy vấn: {error.message}</div>;
  }

  // 4. Render giao diện
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold uppercase">
          Dịch Vụ {resolvedParams.type}
        </h1>
        <ServiceModal typeId={categoryId} />
      </div>

      {/* Thay bảng cũ bằng ServiceTable mới */}
      <ServiceTable services={services || []} typeId={categoryId} />
    </div>
  );
}
