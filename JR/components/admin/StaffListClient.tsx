"use client";
import Link from "next/link";
// Trong components/admin/StaffListClient.tsx
import { updateStaffStatus, deleteStaff } from "@/app/admin/staff/actions";
import { useRouter } from "next/navigation";

// components/admin/StaffListClient.tsx
export default function StaffListClient({
  initialStaff,
  roleId,
}: {
  initialStaff: any[];
  roleId: number;
}) {
  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      await deleteStaff(id);
      window.location.reload(); // Refresh lại trang
    }
  };
  return (
    // Thêm overflow-x-auto để tránh vỡ giao diện trên màn hình nhỏ
    <div className="overflow-x-auto w-full border rounded-lg shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-3 font-semibold text-gray-700">Mã NV</th>
            <th className="p-3 font-semibold text-gray-700">Ảnh</th>
            <th className="p-3 font-semibold text-gray-700">Họ tên</th>
            <th className="p-3 font-semibold text-gray-700">Giới tính</th>
            <th className="p-3 font-semibold text-gray-700">SĐT</th>
            <th className="p-3 font-semibold text-gray-700">Email</th>
            <th className="p-3 font-semibold text-gray-700">Trạng thái</th>
            <th className="p-3 font-semibold text-gray-700">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {initialStaff.map((staff) => (
            <tr key={staff.id} className="hover:bg-gray-50">
              <td className="p-3 text-sm text-gray-600">
                {staff.id.slice(0, 6)}...
              </td>
              <td className="p-3">
                <img
                  src={staff.profiles?.avatar || "/default.png"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </td>
              <td className="p-3">
                {staff.profiles?.fullname || "Chưa cập nhật"}
              </td>
              <td className="p-3">{staff.profiles?.gender || "-"}</td>
              <td className="p-3">{staff.profiles?.phone || "-"}</td>
              <td className="p-3">{staff.profiles?.email || "-"}</td>
              <td className="p-2 border">
                <select
                  defaultValue={staff.status}
                  onChange={(e) => updateStaffStatus(staff.id, e.target.value)}
                >
                  <option value="active">Đang làm việc</option>
                  <option value="on_leave">Đang nghỉ phép</option>
                  <option value="inactive">Tạm nghỉ</option>
                  <option value="terminated">Đã nghĩ việc</option>
                </select>
              </td>
              <td className="p-3">
                <Link
                  href={`/admin/staff/details/${staff.id}`}
                  className="text-blue-600 hover:underline"
                >
                  XEM
                </Link>
                {/* Nút xóa */}
                <button
                  onClick={() => handleDelete(staff.id)}
                  className="text-red-600 hover:underline"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
