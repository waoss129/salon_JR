"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addStaff, updateStaff } from "@/app/admin/staff/actions";

export default function StaffModal({
  roleId,
  staffData,
}: {
  roleId: number;
  staffData?: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isEdit = !!staffData;
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        {isEdit ? "Sửa" : "+ Thêm nhân viên"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            action={async (formData) => {
              // Đảm bảo truyền đủ dữ liệu vào action
              await addStaff(formData, roleId);
              setIsOpen(false);
              router.refresh();
            }}
          >
            {/* Họ tên */}
            <input
              name="fullname"
              defaultValue={staffData?.profiles?.fullname}
              placeholder="Họ tên"
              className="border p-2 mb-2 w-full"
            />

            {/* Email (Chỉ hiện khi thêm mới) */}
            {!isEdit && (
              <input
                name="email"
                placeholder="Email"
                className="border p-2 mb-2 w-full"
              />
            )}

            {/* Giới tính */}
            <select
              name="gender"
              defaultValue={staffData?.profiles?.gender}
              className="border p-2 mb-2 w-full"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>

            {/* SĐT */}
            <input
              name="phone"
              defaultValue={staffData?.profiles?.phone}
              placeholder="Số điện thoại"
              className="border p-2 mb-2 w-full"
            />

            <button
              type="submit"
              className="bg-green-500 text-white p-2 w-full"
            >
              Lưu thông tin
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-2 text-gray-500 w-full text-center"
            >
              Đóng
            </button>
          </form>
        </div>
      )}
    </>
  );
}
