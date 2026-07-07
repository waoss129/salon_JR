"use client";
import { useState } from "react";
import CustomerModal from "./CustomerModal"; // Import modal sửa/thêm của bạn

export default function CustomerList({ customers }: { customers: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter((c) =>
    c.profiles?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
            <th className="p-3 border">Họ tên</th>
            <th className="p-3 border">SĐT</th>
            <th className="p-3 border">Giới tính</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="p-3 border">
                {c.profiles?.fullname || "Chưa cập nhật"}
              </td>
              <td className="p-3 border">{c.profiles?.phone || "-"}</td>
              <td className="p-3 border">{c.profiles?.gender || "-"}</td>
              <td className="p-3 border">{c.profiles?.email || "-"}</td>
              <td className="p-3 border">
                {/* Truyền dữ liệu customer hiện tại vào modal để sửa */}
                <CustomerModal customerData={c} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
