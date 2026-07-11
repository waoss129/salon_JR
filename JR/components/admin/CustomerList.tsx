"use client";
import { useState } from "react";
import Link from "next/link";
import CustomerModal from "./CustomerModal"; // Import modal sửa/thêm của bạn
import {
  updateCustomerStatus,
  deleteCustomer,
} from "@/app/admin/customers/actions";

export default function CustomerList({ customers }: { customers: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredCustomers = customers.filter((c) =>
    c.profiles?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    await updateCustomerStatus(id, newStatus);
    setLoadingId(null);
  };

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Tìm kiếm khách hàng..."
        className="border p-2 mb-4 w-full md:w-1/3 rounded"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="w-full text-left border-collapse border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 border">Hình ảnh</th>
            <th className="p-3 border">Họ tên</th>
            <th className="p-3 border">SĐT</th>
            <th className="p-3 border">Giới tính</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Trạng thái</th>
            <th className="p-3 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="p-3 border">
                <img
                  src={c.profiles?.avatar || "/default-avatar.png"}
                  alt={c.profiles?.fullname || "Avatar"}
                  className="w-10 h-10 rounded-full object-cover border"
                />
              </td>
              <td className="p-3 border">
                {c.profiles?.fullname || "Chưa cập nhật"}
              </td>
              <td className="p-3 border">{c.profiles?.phone || "-"}</td>
              <td className="p-3 border">{c.profiles?.gender || "-"}</td>
              <td className="p-3 border">{c.profiles?.email || "-"}</td>
              <td className="p-2 border">
                <select
                  defaultValue={c.status}
                  disabled={loadingId === c.id}
                  onChange={(e) => handleStatusChange(c.id, e.target.value)} // Dùng c.id (đúng)
                  className="border p-1 rounded"
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Tạm ngưng</option>
                  <option value="banned">Đã khóa</option>
                </select>
              </td>

              <td className="p-3 border flex gap-2">
                <Link
                  href={`/admin/customers/${c.id}`} // Đảm bảo c.id này khớp với ID trong bảng customers
                  className="text-blue-600 hover:underline"
                >
                  XEM
                </Link>
                <button
                  onClick={async () => {
                    if (confirm("Bạn có chắc chắn muốn xóa?")) {
                      await deleteCustomer(c.id);
                    }
                  }}
                  className="text-red-600 hover:underline"
                >
                  XÓA
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
