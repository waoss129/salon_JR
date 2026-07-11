"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import {
  updateProfile,
  type ProfileWithEmployee,
} from "@/app/admin/accounts/actions";

const GENDER_OPTIONS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Đang lưu..." : "Lưu thay đổi"}
    </button>
  );
}

export default function ProfileForm({
  account,
}: {
  account: ProfileWithEmployee;
}) {
  const [state, formAction] = useActionState(updateProfile, {
    success: false,
    message: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    account.avatar,
  );

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  return (
    <form action={formAction} className="space-y-8">
      {state.message && (
        <div
          className={`rounded-md p-3 text-sm ${
            state.success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-100">
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Ảnh đại diện"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              Chưa có ảnh
            </div>
          )}
        </div>
        <div>
          <label className="block cursor-pointer text-sm font-medium text-gray-700">
            Đổi ảnh đại diện
            <input
              type="file"
              name="avatar_file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mt-2 block text-sm text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-gray-200"
            />
          </label>
        </div>
      </div>

      {/* Thông tin cá nhân */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Họ tên" required>
          <input
            type="text"
            name="fullname"
            defaultValue={account.fullname ?? ""}
            required
            className="input"
          />
        </Field>

        <Field label="Giới tính">
          <select
            name="gender"
            defaultValue={account.gender ?? ""}
            className="input"
          >
            <option value="">-- Chọn giới tính --</option>
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Ngày sinh">
          <input
            type="date"
            name="dob"
            defaultValue={account.dob ?? ""}
            className="input"
          />
        </Field>

        <Field label="Số điện thoại">
          <input
            type="tel"
            name="phone"
            defaultValue={account.phone ?? ""}
            placeholder="09xxxxxxxx"
            className="input"
          />
        </Field>

        <Field label="Địa chỉ" full>
          <input
            type="text"
            name="address"
            defaultValue={account.address ?? ""}
            className="input"
          />
        </Field>
      </div>

      <hr className="border-gray-200" />

      {/* Thông tin công việc */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Trình độ">
          <input
            type="text"
            name="level"
            defaultValue={account.level ?? ""}
            placeholder="VD: Đại học, Cao đẳng..."
            className="input"
          />
        </Field>

        <Field label="Bằng cấp">
          <input
            type="text"
            name="certificate_name"
            defaultValue={account.certificate_name ?? ""}
            placeholder="VD: Kỹ sư CNTT"
            className="input"
          />
        </Field>

        <Field label="Ngày vào làm">
          <input
            type="date"
            name="joined_at"
            defaultValue={account.joined_at ?? ""}
            className="input"
          />
        </Field>
      </div>

      <div className="flex justify-end pt-2">
        <SubmitButton />
      </div>

      {/* Style tiện dụng cho input, tương thích Tailwind */}
      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #111827;
          box-shadow: 0 0 0 1px #111827;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
  required,
  full,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
