"use client";

import { useTransition } from "react";
import { updateStaff } from "@/app/admin/staff/actions";

export default function StaffDetailForm({ data }: { data: any }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) =>
        startTransition(() => updateStaff(data.id, formData))
      }
      className="space-y-6 bg-white p-8 rounded shadow"
    >
      {/* Avatar Upload */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={data.profiles?.avatar || "/default-avatar.png"}
          className="w-24 h-24 rounded-full border object-cover"
          alt="Avatar"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Thay đổi ảnh đại diện
          </label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="text-sm mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Thông tin cá nhân */}
        <div className="col-span-2 text-lg font-bold border-b pb-2">
          Thông tin cá nhân
        </div>

        <input
          name="fullname"
          defaultValue={data.profiles?.fullname}
          placeholder="Họ và tên"
          className="border p-2 rounded w-full"
        />
        <input
          name="email"
          defaultValue={data.profiles?.email} //xoa thuoc tinh disable thi moi sua duoc
          placeholder="Email"
          className="border p-2 rounded bg-gray-100 w-full"
        />

        <div className="flex items-center gap-4 border p-2 rounded">
          <span className="text-gray-500 text-sm">Giới tính:</span>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="gender"
              value="male"
              defaultChecked={data.profiles?.gender === "male"}
            />{" "}
            Nam
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="gender"
              value="female"
              defaultChecked={data.profiles?.gender === "female"}
            />{" "}
            Nữ
          </label>
        </div>

        <input
          type="date"
          name="dob"
          defaultValue={data.profiles?.dob}
          className="border p-2 rounded"
        />
        <input
          name="phone"
          defaultValue={data.profiles?.phone}
          placeholder="Số điện thoại"
          className="border p-2 rounded"
        />
        <input
          name="address"
          defaultValue={data.profiles?.address}
          placeholder="Địa chỉ"
          className="border p-2 rounded col-span-2 w-full"
        />

        {/* Thông tin công việc & Bằng cấp */}
        <div className="col-span-2 text-lg font-bold border-b pb-2 mt-4">
          Thông tin công việc
        </div>
        <input
          type="date"
          name="joined_at"
          defaultValue={data.joined_at}
          className="border p-2 rounded"
        />
        <input
          name="certificate_name"
          defaultValue={data.certificate_name}
          placeholder="Tên chứng chỉ"
          className="border p-2 rounded"
        />
        <input
          name="level"
          defaultValue={data.level}
          placeholder="Trình độ"
          className="border p-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700"
      >
        {isPending ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}
