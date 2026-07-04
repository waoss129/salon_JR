"use client";
import { useState } from "react";
import { addCustomer } from "@/app/admin/customers/actions";

export default function CustomerModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white p-2 rounded"
      >
        + THÊM KHÁCH HÀNG
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            action={async (formData) => {
              await addCustomer(formData);
              setIsOpen(false);
            }}
            className="bg-white p-6 rounded shadow-lg w-96 space-y-3"
          >
            <h2 className="text-lg font-bold">Thêm khách hàng mới</h2>
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
            <button type="submit" className="bg-blue-600 text-white p-2 w-full">
              Lưu
            </button>
          </form>
        </div>
      )}
    </>
  );
}
