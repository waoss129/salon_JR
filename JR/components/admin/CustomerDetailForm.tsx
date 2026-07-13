"use client";
import React, { useState } from "react";

const AVATAR_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const AVATAR_MAX_SIZE = 5 * 1024 * 1024;

const GENDER_LABEL: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
  prefer_not_to_say: "Không muốn trả lời",
};

export default function CustomerForm({
  initialData,
  action,
}: {
  initialData: any;
  action: (formData: FormData) => void;
}) {
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
      className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6"
    >
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
        <img
          src={avatarPreview || "/default-avatar.png"}
          className="w-24 h-24 rounded-full border object-cover"
          alt="Avatar"
        />
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Ảnh đại diện
          </label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            className="text-sm"
          />
          {avatarError && (
            <p className="text-sm text-red-600 mt-1">{avatarError}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
            Họ tên
          </label>
          <input
            name="fullname"
            defaultValue={initialData.profiles?.fullname}
            className="border rounded-lg px-3 py-2 w-full text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
            Số điện thoại
          </label>
          <input
            name="phone"
            defaultValue={initialData.profiles?.phone}
            className="border rounded-lg px-3 py-2 w-full text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
            Giới tính
          </label>
          <select
            name="gender"
            defaultValue={initialData.profiles?.gender}
            className="border rounded-lg px-3 py-2 w-full text-sm"
          >
            {Object.entries(GENDER_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
            Ngày sinh
          </label>
          <input
            type="date"
            name="dob"
            defaultValue={initialData.profiles?.dob || ""}
            className="border rounded-lg px-3 py-2 w-full text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
            Địa chỉ
          </label>
          <input
            name="address"
            defaultValue={initialData.profiles?.address || ""}
            className="border rounded-lg px-3 py-2 w-full text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
            Email
          </label>
          <input
            disabled
            value={initialData.email}
            className="border rounded-lg px-3 py-2 w-full text-sm bg-gray-100 text-gray-500"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
            Mật khẩu
          </label>
          <input
            disabled
            type="password"
            value="********"
            className="border rounded-lg px-3 py-2 w-full text-sm bg-gray-100 text-gray-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
      >
        Lưu thay đổi
      </button>
    </form>
  );
}
