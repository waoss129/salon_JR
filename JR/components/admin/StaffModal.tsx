"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addStaff } from "@/app/admin/staff/actions";

export default function StaffModal({ roleId }: { roleId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activationUrl, setActivationUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function closeAndReset() {
    setIsOpen(false);
    setActivationUrl(null);
    setError(null);
    setCopied(false);
    router.refresh();
  }

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    try {
      const result = await addStaff(formData, roleId);
      // Không đóng modal ngay — admin cần thấy link kích hoạt để copy gửi
      // cho nhân viên (chưa có email/SĐT để hệ thống tự gửi được)
      setActivationUrl(result.activationUrl);
    } catch (err: any) {
      setError(err?.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  async function handleCopyLink() {
    if (!activationUrl) return;
    await navigator.clipboard.writeText(activationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-black text-white rounded px-3 py-1.5 text-sm hover:bg-slate-800 transition"
      >
        + Thêm nhân viên
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          {activationUrl ? (
            // Trạng thái thành công: hiện link kích hoạt để admin copy gửi đi
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h3 className="font-semibold text-base mb-2">
                Đã tạo nhân viên thành công
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                Gửi link này cho nhân viên (Zalo, tin nhắn...) để họ tự đặt
                email và mật khẩu. Link có hạn dùng trong 72 giờ.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <input
                  readOnly
                  value={activationUrl}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 border rounded px-2 py-1.5 text-xs font-mono bg-gray-50"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="border rounded px-3 py-1.5 text-sm whitespace-nowrap"
                >
                  {copied ? "Đã copy" : "Copy"}
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeAndReset}
                  className="bg-black text-white rounded px-3 py-1.5 text-sm"
                >
                  Xong
                </button>
              </div>
            </div>
          ) : (
            <form
              action={(formData) =>
                startTransition(() => handleSubmit(formData))
              }
              className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-base">Thêm nhân viên mới</h3>
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
                  <label className="text-sm font-medium block mb-1">
                    Họ tên
                  </label>
                  <input
                    name="fullname"
                    placeholder="Nhập họ tên"
                    className="w-full border rounded px-2 py-1.5 text-sm"
                    required
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
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">
                    Số điện thoại{" "}
                    <span className="text-gray-400 font-normal">(nếu có)</span>
                  </label>
                  <input
                    name="phone"
                    placeholder="Nhập số điện thoại"
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>

                <p className="text-xs text-gray-400">
                  Email sẽ do nhân viên tự đặt khi kích hoạt tài khoản, không
                  nhập ở đây.
                </p>
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
                  {isPending ? "Đang lưu..." : "Lưu thông tin"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}
