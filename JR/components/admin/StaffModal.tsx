"use client";
import { useState } from "react";
import { addStaff } from "@/app/admin/staff/actions";

export default function StaffModal({ roleId }: { roleId: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        + THÊM NHÂN VIÊN
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            action={async (formData) => {
              //roleId da co san tu props cua component nay
              await addStaff(formData, roleId);
              setIsOpen(false);
            }}
            className="bg-white p-6 rounded shadow-lg w-96 space-y-3"
          >
            <h2 className="text-lg font-bold">Thêm nhân viên mới</h2>

            <input
              name="fullname"
              placeholder="Họ và tên"
              className="border p-2 w-full"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="border p-2 w-full"
              required
            />
            <input
              name="phone"
              placeholder="Số điện thoại"
              className="border p-2 w-full"
            />

            <select name="gender" className="border p-2 w-full">
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>

            {/* Input ẩn để giữ roleId */}
            <input type="hidden" name="role_id" value={roleId} />

            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 p-2 px-4 rounded"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 px-4 rounded"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
