"use client";
import React, { useState } from "react";

const AVATAR_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const AVATAR_MAX_SIZE = 5 * 1024 * 1024; // 5MB

// components/admin/CustomerForm.tsx
export default function CustomerForm({
  initialData,
  action,
}: {
  initialData: any;
  action: (formData: FormData) => void;
}) {
  console.log("Dữ liệu nhận vào Form:", initialData);

  // Xem trước ảnh đại diện ngay khi chọn file, trước khi submit lên server
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData.profiles?.avatar || null,
  );
  const [avatarError, setAvatarError] = useState<string | null>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
      setAvatarError("Ảnh đại diện phải là định dạng JPG, PNG, WEBP hoặc GIF.");
      e.target.value = "";
      return;
    }
    if (file.size > AVATAR_MAX_SIZE) {
      setAvatarError("Ảnh đại diện không được vượt quá 5MB.");
      e.target.value = "";
      return;
    }

    setAvatarError(null);
    setAvatarPreview(URL.createObjectURL(file));
  }

  return (
    <form
      action={action}
      className="bg-white p-6 rounded shadow border space-y-4"
    >
      {/* Thêm phần Avatar Upload */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={avatarPreview || "/default-avatar.png"}
          className="w-20 h-20 rounded-full border object-cover"
          alt="Avatar"
        />
        <div>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          {avatarError && (
            <p className="text-sm text-red-600 mt-1">{avatarError}</p>
          )}
        </div>
      </div>
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
