"use client";
import { useState } from "react";
import ServiceModal from "@/components/admin/ServiceModal";
import {
  deleteService,
  toggleServiceStatus,
} from "@/app/admin/services/actions";

type ServiceRow = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  duration: number | null;
  status: string | null;
};

export default function ServiceTable({
  services,
  typeId,
  canManage,
}: {
  services: ServiceRow[];
  typeId: number;
  // Người đang xem có được thêm/sửa/xóa/bật-tắt dịch vụ hay không — vd:
  // role 2 (CEO) chỉ xem, phải false. Mặc định false để an toàn
  // (fail-closed) nếu quên truyền.
  canManage?: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xóa dịch vụ "${name}"? Hành động này không thể hoàn tác.`))
      return;
    await deleteService(id);
  }

  async function handleToggleStatus(id: number, currentStatus: string | null) {
    await toggleServiceStatus(id, currentStatus);
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Tìm kiếm dịch vụ theo tên..."
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Tên dịch vụ
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Giá
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Thời gian
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Trạng thái
              </th>
              {canManage && (
                <th className="px-4 py-3 text-center font-medium text-gray-500">
                  Hành động
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {service.name}
                  </td>
                  <td className="px-4 py-3">
                    {new Intl.NumberFormat("vi-VN").format(service.price)}đ
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {service.duration ? `${service.duration} phút` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {canManage ? (
                      <button
                        onClick={() =>
                          handleToggleStatus(service.id, service.status)
                        }
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          service.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {service.status === "active"
                          ? "Đang kinh doanh"
                          : "Ngừng kinh doanh"}
                      </button>
                    ) : (
                      // Không có quyền quản lý (vd: CEO) -> chỉ hiện nhãn
                      // tĩnh, không cho bật/tắt.
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          service.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {service.status === "active"
                          ? "Đang kinh doanh"
                          : "Ngừng kinh doanh"}
                      </span>
                    )}
                  </td>
                  {canManage && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <ServiceModal typeId={typeId} service={service} />
                        <button
                          onClick={() => handleDelete(service.id, service.name)}
                          className="text-sm font-medium text-red-500 hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={canManage ? 5 : 4}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  Không tìm thấy dịch vụ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}