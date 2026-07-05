"use client";

export default function AccountForm({ data }: { data: any }) {
  // data.role_id hoặc data.employee_categories?.name để kiểm tra role
  const isStaff = data.role_id === 5; // Ví dụ role 5 là nhân viên

  return (
    <form className="bg-white p-6 rounded shadow space-y-4">
      {/* Upload Avatar - Sử dụng Image component hoặc input file */}
      <div className="mb-6">
        <img
          src={data.profiles?.avatar || "/default.png"}
          className="w-24 h-24 rounded-full"
        />
        <input type="file" className="mt-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          defaultValue={data.profiles?.fullname}
          placeholder="Họ tên"
          className="border p-2"
        />
        <input
          defaultValue={data.profiles?.email}
          disabled
          className="border p-2 bg-gray-100"
        />

        {/* Giới tính - Checkbox/Radio */}
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              defaultChecked={data.profiles?.gender === "male"}
            />{" "}
            Nam
          </label>
          <label>
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
          defaultValue={data.profiles?.dob}
          className="border p-2"
        />
      </div>

      {/* Render có điều kiện theo Role */}
      {isStaff && (
        <div className="border-t pt-4">
          <h2 className="font-bold">Thông tin công việc</h2>
          <input
            defaultValue={data.level}
            placeholder="Trình độ"
            className="border p-2 w-full mt-2"
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Lưu thay đổi
      </button>
    </form>
  );
}
