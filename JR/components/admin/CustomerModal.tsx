"use client";
import { useState } from "react";
import { addCustomer, updateCustomer } from "@/app/admin/customers/actions";

export default function CustomerModal({
  customerData,
}: {
  customerData?: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isEdit = !!customerData;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white p-2 rounded"
      >
        + THÊM KHÁCH HÀNG
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            action={async (formData) => {
              if (isEdit) await updateCustomer(customerData.id, formData);
              else await addCustomer(formData);
              setIsOpen(false);
            }}
            className="bg-white p-6 rounded shadow-lg w-96 space-y-3"
          >
            <h2 className="text-lg font-bold">
              {isEdit ? "Sửa thông tin" : "Thêm khách hàng"}
            </h2>
            <input
              name="fullname"
              defaultValue={customerData?.profiles?.fullname}
              placeholder="Họ tên"
              required
              className="border p-2 w-full"
            />

            {!isEdit && (
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="border p-2 w-full"
              />
            )}

            {/* Giới tính */}
            <select
              name="gender"
              defaultValue={customerData?.profiles?.gender}
              className="border p-2 mb-2 w-full"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
              <option value="prefer_not_to_say">Không muốn trả lời</option>
            </select>

            <input
              name="phone"
              defaultValue={customerData?.profiles?.phone}
              placeholder="SĐT"
              className="border p-2 w-full"
            />

            <button type="submit" className="bg-blue-600 text-white p-2 w-full">
              Lưu
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full text-gray-500"
            >
              Đóng
            </button>
          </form>
        </div>
      )}
    </>
  );
}
