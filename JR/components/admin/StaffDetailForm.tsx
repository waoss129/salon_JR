"use client";

import { useTransition } from "react";
import { updateStaff } from "@/app/admin/staff/actions";

export default function StaffDetailForm({ data }: { data: any }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      key={JSON.stringify(data)}
      action={(formData) =>
        startTransition(() => updateStaff(data.id, formData))
      }
      className="space-y-8 bg-white p-8 rounded shadow"
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Thông tin cá nhân */}
        <div className="col-span-2 mb-4">
          <img
            src={data.profiles?.avatar || "/default-avatar.png"}
            className="w-24 h-24 rounded-full border mb-2"
            alt="Avatar"
          />
        </div>
        <div className="col-span-2 text-lg font-bold border-b pb-2">
          Thông tin cá nhân
        </div>
        <input
          name="fullname"
          defaultValue={data.profiles?.fullname || ""}
          placeholder="Họ và tên"
          className="border p-2 rounded w-full"
        />
        <input
          name="email"
          defaultValue={data.profiles?.email || ""}
          disabled
          className="border p-2 rounded bg-gray-50 w-full"
        />
        <input
          type="date"
          name="dob"
          defaultValue={data.profiles?.dob}
          className="border p-2 rounded"
        />
        <input
          name="phone"
          defaultValue={data.profiles?.phone || ""}
          placeholder="Số điện thoại"
          className="border p-2 rounded w-full"
        />
        <input
          name="address"
          defaultValue={data.profiles?.address || ""}
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
