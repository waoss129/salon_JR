import { createAdminAuthClient } from "@/lib/supabase/server";
import { deleteService } from "@/app/admin/services/actions";
import ServiceModal from "@/components/admin/ServiceModal";

export default async function AdminServicesPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
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

      <table className="mt-4 w-full border text-left">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2">Tên Dịch Vụ</th>
            <th className="p-2">Giá</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {services?.map((service) => (
            <tr key={service.id} className="border-b">
              <td className="p-2">{service.name}</td>
              <td className="p-2">
                {new Intl.NumberFormat("vi-VN").format(service.price)}
              </td>
              <td className="p-2 flex gap-2">
                <ServiceModal typeId={categoryId} service={service} />{" "}
                {/* Nút Sửa */}
                <form action={deleteService.bind(null, service.id)}>
                  <button
                    type="submit"
                    className="text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
