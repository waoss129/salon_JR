"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addCustomer } from "@/app/admin/customers/actions";

export default function CustomerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    try {
      await addCustomer(formData);
      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-black text-white rounded px-3 py-1.5 text-sm hover:bg-slate-800 transition"
      >
        + Thêm khách hàng
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form
            action={(formData) => startTransition(() => handleSubmit(formData))}
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base">Thêm khách hàng</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
                {error}
              </p>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Họ tên</label>
                <input
                  name="fullname"
                  placeholder="Nhập họ tên"
                  required
                  className="w-full border rounded px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Nhập email"
                  required
                  className="w-full border rounded px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">
                  Giới tính
                </label>
                <select
                  name="gender"
                  defaultValue="male"
                  className="w-full border rounded px-2 py-1.5 text-sm"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                  <option value="prefer_not_to_say">Không muốn trả lời</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">
                  Số điện thoại
                </label>
                <input
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  className="w-full border rounded px-2 py-1.5 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="border rounded px-3 py-1.5 text-sm"
              >
                Huỷ
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="bg-black text-white rounded px-3 py-1.5 text-sm disabled:opacity-50"
              >
                {isPending ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
