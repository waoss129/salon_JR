"use client";
import React from "react";

// components/admin/CustomerForm.tsx
export default function CustomerForm({
  initialData,
  action,
}: {
  initialData: any;
  action: (formData: FormData) => void;
}) {
  console.log("Dữ liệu nhận vào Form:", initialData);
  return (
    <form
      action={action}
      className="bg-white p-6 rounded shadow border space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Họ tên:</label>
          <input
            name="fullname"
            defaultValue={initialData.profiles?.fullname}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>SĐT:</label>
          <input
            name="phone"
            defaultValue={initialData.profiles?.phone}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Giới tính:</label>
          <select
            name="gender"
            defaultValue={initialData.profiles?.gender}
            className="w-full border p-2 rounded"
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
            <option value="prefer_not_to_say">Không muốn trả lời</option>
          </select>
        </div>
        <div>
          <label>Ngày sinh:</label>
          <input
            type="date"
            name="dob"
            defaultValue={initialData.profiles?.dob || ""}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>
      <div>
        <label>Địa chỉ:</label>
        <input
          name="address"
          defaultValue={initialData.profiles?.address || ""}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Email</label>
          <input
            disabled
            value={initialData.email}
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>
        <div>
          <label>Mật khẩu</label>
          <input
            disabled
            type="password"
            value="********"
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Lưu thay đổi
      </button>
    </form>
  );
}
