import { createAdminAuthClient } from "@/lib/supabase/server";
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
        <ServiceModal typeId={categoryId} />
      </div>

      <ServiceTable services={services || []} typeId={categoryId} />
    </div>
  );
}
