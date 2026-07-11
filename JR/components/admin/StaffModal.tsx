"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addStaff } from "@/app/admin/staff/actions";

export default function StaffModal({ roleId }: { roleId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    try {
      await addStaff(formData, roleId);
      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      // Không đóng modal khi lỗi, để user sửa lại và submit tiếp
      setError(err?.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        + Thêm nhân viên
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            action={(formData) => startTransition(() => handleSubmit(formData))}
            className="bg-white p-4 rounded w-full max-w-md"
          >
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <input
              name="fullname"
              placeholder="Họ tên"
              className="border p-2 mb-2 w-full"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              className="border p-2 mb-2 w-full"
              required
            />

            <select
              name="gender"
              defaultValue="male"
              className="border p-2 mb-2 w-full"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>

            <input
              name="phone"
              placeholder="Số điện thoại"
              className="border p-2 mb-2 w-full"
            />

            <button
              type="submit"
              disabled={isPending}
              className="bg-green-500 text-white p-2 w-full disabled:opacity-50"
            >
              {isPending ? "Đang lưu..." : "Lưu thông tin"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-2 text-gray-500 w-full text-center"
            >
              Đóng
            </button>
          </form>
        </div>
      )}
    </>
  );
}
