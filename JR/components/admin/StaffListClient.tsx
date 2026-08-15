"use client";
import { useState } from "react";
import Link from "next/link";
import { updateStaffStatus } from "@/app/admin/staff/actions";

const STATUS_LABEL: Record<string, string> = {
  active: "Đang làm việc",
  on_leave: "Đang nghỉ phép",
  inactive: "Tạm khoá (Admin)",
  terminated: "Đã nghỉ việc",
};

const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  on_leave: "bg-amber-100 text-amber-700",
  inactive: "bg-gray-200 text-gray-600",
  terminated: "bg-red-100 text-red-700",
};

export default function StaffListClient({
  initialStaff,
  canManage,
}: {
  initialStaff: any[];
  roleId: number;
  // Người đang xem trang có quyền sửa (đổi trạng thái) nhân viên hay
  // không — vd: CEO (role 2) chỉ xem, phải false. Nếu không truyền, mặc
  // định false để an toàn (fail-closed).
  canManage?: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await updateStaffStatus(id, status);
    } catch (err: any) {
      alert(err?.message || "Không thể cập nhật trạng thái");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredStaff = initialStaff.filter(
    (staff) =>
      staff.profiles?.fullname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      staff.id.slice(0, 6).toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc mã NV..."
          className="border rounded px-2 py-1.5 text-sm w-full md:w-1/3"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="w-full text-sm border rounded overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2">Mã NV</th>
            <th className="text-left p-2">Ảnh</th>
            <th className="text-left p-2">Họ tên</th>
            <th className="text-left p-2">Giới tính</th>
            <th className="text-left p-2">SĐT</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Trạng thái</th>
            <th className="text-left p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.length === 0 && (
            <tr>
              <td colSpan={8} className="p-3 text-center text-gray-400">
                Không tìm thấy nhân viên nào
              </td>
            </tr>
          )}
          {filteredStaff.map((staff) => (
            <tr key={staff.id} className="border-t align-middle">
              <td className="p-2 text-gray-500">{staff.id.slice(0, 6)}...</td>
              <td className="p-2">
                <img
                  src={staff.profiles?.avatar || "/default-avatar.png"}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover border"
                />
              </td>
              <td className="p-2 font-medium">
                {staff.profiles?.fullname || "Chưa cập nhật"}
              </td>
              <td className="p-2">
                {staff.profiles?.gender === "male"
                  ? "Nam"
                  : staff.profiles?.gender === "female"
                    ? "Nữ"
                    : "—"}
              </td>
              <td className="p-2">{staff.profiles?.phone || "—"}</td>
              <td className="p-2">{staff.profiles?.email || "—"}</td>
              <td className="p-2">
                {canManage ? (
                  <select
                    defaultValue={staff.status}
                    disabled={updatingId === staff.id}
                    onChange={(e) =>
                      handleStatusChange(staff.id, e.target.value)
                    }
                    className={`text-xs px-2 py-1 rounded border-0 font-medium disabled:opacity-50 ${STATUS_COLOR[staff.status]}`}
                  >
                    {Object.entries(STATUS_LABEL).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  // Không có quyền quản lý (vd: CEO) -> chỉ hiện nhãn
                  // trạng thái tĩnh, không cho đổi.
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${STATUS_COLOR[staff.status]}`}
                  >
                    {STATUS_LABEL[staff.status]}
                  </span>
                )}
              </td>
              <td className="p-2">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/staff/details/${staff.id}`}
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