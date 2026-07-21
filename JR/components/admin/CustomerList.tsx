"use client";
import { useState } from "react";
import Link from "next/link";
import { updateCustomerStatus } from "@/app/admin/customers/actions";

const GENDER_LABEL: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
  prefer_not_to_say: "Không muốn trả lời",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Đang hoạt động",
  inactive: "Tạm ngưng",
  banned: "Đã khoá",
};

const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-200 text-gray-600",
  banned: "bg-red-100 text-red-700",
};

export default function CustomerList({ customers }: { customers: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredCustomers = customers.filter((c) =>
    c.profiles?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    try {
      await updateCustomerStatus(id, newStatus);
    } catch (err: any) {
      alert(err?.message || "Không thể cập nhật trạng thái");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Tìm kiếm khách hàng..."
        className="border rounded px-2 py-1.5 text-sm mb-4 w-full md:w-1/3"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="w-full text-sm border rounded overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2">Ảnh</th>
            <th className="text-left p-2">Họ tên</th>
            <th className="text-left p-2">SĐT</th>
            <th className="text-left p-2">Giới tính</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Trạng thái</th>
            <th className="text-left p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length === 0 && (
            <tr>
              <td colSpan={7} className="p-3 text-center text-gray-400">
                Không tìm thấy khách hàng nào
              </td>
            </tr>
          )}
          {filteredCustomers.map((c) => (
            <tr key={c.id} className="border-t align-middle">
              <td className="p-2">
                <img
                  src={c.profiles?.avatar || "/default-avatar.png"}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover border"
                />
              </td>
              <td className="p-2 font-medium">
                {c.profiles?.fullname || "Chưa cập nhật"}
              </td>
              <td className="p-2">{c.profiles?.phone || "—"}</td>
              <td className="p-2">{GENDER_LABEL[c.profiles?.gender] || "—"}</td>
              <td className="p-2">{c.profiles?.email || "—"}</td>
              <td className="p-2">
                <select
                  defaultValue={c.status}
                  disabled={loadingId === c.id}
                  onChange={(e) => handleStatusChange(c.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded border-0 font-medium disabled:opacity-50 ${STATUS_COLOR[c.status]}`}
                >
                  {Object.entries(STATUS_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/customers/${c.id}`}
                    className="border rounded px-2 py-1 text-xs hover:bg-gray-50"
                  >
                    Xem
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
