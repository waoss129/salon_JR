"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateStaff } from "@/app/admin/staff/actions";
import { ROLE } from "@/lib/supabase/permissions";

export default function StaffDetailForm({
  data,
  viewerRoleId,
}: {
  data: any;
  viewerRoleId: number | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Chỉ chuyên viên (Beautician, role_id = 4) mới cần "Cấp bậc" — quản lý
  // (3) và lễ tân (5) không có khái niệm này.
  const showLevel = data.role_id === ROLE.BEAUTICIAN;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    try {
      await updateStaff(data.id, formData);
      setSuccess(true);
      setPreviewUrl(null);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Không thể lưu thay đổi");
    }
  }

  return (
    <form
      action={(formData) => startTransition(() => handleSubmit(formData))}
      className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
    >
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3">
          Đã lưu thay đổi thành công!
        </p>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
        <img
          src={previewUrl || data.profiles?.avatar || "/default-avatar.png"}
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
            onChange={handleFileChange}
            className="text-sm"
          />
        </div>
      </div>

      {/* Thông tin cá nhân */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Thông tin cá nhân
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Họ và tên
            </label>
            <input
              name="fullname"
              defaultValue={data.profiles?.fullname}
              placeholder="Họ và tên"
              className="border rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Email
            </label>
            {/* Không phải input — email bị khoá tuyệt đối sau khi nhân viên
                kích hoạt tài khoản, không ai (kể cả Admin) sửa được qua giao
                diện. Chỉ hiển thị để tham khảo. */}
            <div className="border rounded-lg px-3 py-2 w-full text-sm bg-slate-50 text-slate-500">
              {data.profiles?.email || "Chưa kích hoạt tài khoản"}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Giới tính
            </label>
            <div className="flex items-center gap-4 border rounded-lg px-3 py-2">
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  defaultChecked={data.profiles?.gender === "male"}
                />
                Nam
              </label>
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  defaultChecked={data.profiles?.gender === "female"}
                />
                Nữ
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Ngày sinh
            </label>
            <input
              type="date"
              name="dob"
              defaultValue={data.profiles?.dob}
              className="border rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Số điện thoại
            </label>
            <input
              name="phone"
              defaultValue={data.profiles?.phone}
              placeholder="Số điện thoại"
              className="border rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Địa chỉ
            </label>
            <input
              name="address"
              defaultValue={data.profiles?.address}
              placeholder="Địa chỉ"
              className="border rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>
        </div>
      </div>

      {/* Thông tin công việc */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4 pt-2 border-t border-slate-100">
          Thông tin công việc
        </h3>
        <div
          className={`grid grid-cols-1 gap-4 ${showLevel ? "md:grid-cols-3" : "md:grid-cols-2"}`}
        >
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Ngày vào làm
            </label>
            <input
              type="date"
              name="joined_at"
              defaultValue={data.joined_at}
              className="border rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Chứng nhận
            </label>
            <input
              name="certificate_name"
              defaultValue={data.certificate_name}
              placeholder="Chứng nhận"
              className="border rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>
          {showLevel && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Cấp bậc
              </label>
              <input
                name="level"
                defaultValue={data.level}
                placeholder="Cấp bậc"
                className="border rounded-lg px-3 py-2 w-full text-sm"
              />
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 transition"
      >
        {isPending ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}
