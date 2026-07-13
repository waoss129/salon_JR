"use client";
import { useState } from "react";
import ServiceModal from "@/components/admin/ServiceModal";
import { deleteService } from "@/app/admin/services/actions";

export default function ServiceTable({
  services,
  typeId,
}: {
  services: any[];
  typeId: number;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Logic lọc: Tìm theo tên dịch vụ (không phân biệt hoa thường)
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Ô tìm kiếm */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Tìm kiếm dịch vụ theo tên..."
          className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Bảng dữ liệu */}
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2">Tên Dịch Vụ</th>
            <th className="p-2">Giá</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <tr key={service.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{service.name}</td>
                <td className="p-2">
                  {new Intl.NumberFormat("vi-VN").format(service.price)}đ
                </td>
                <td className="p-2 flex gap-2">
                  <ServiceModal typeId={typeId} service={service} />
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
            ))
          ) : (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                Không tìm thấy dịch vụ nào!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
