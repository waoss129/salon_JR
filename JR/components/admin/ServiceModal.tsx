"use client";
import { useState } from "react";
import { addService, updateService } from "@/app/admin/services/actions";

type ServiceRow = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  duration: number | null;
  status: string | null;
};

export default function ServiceModal({
  typeId,
  service,
}: {
  typeId: number;
  service?: ServiceRow;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          service
            ? "text-sm font-medium text-blue-600 hover:underline"
            : "rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        }
      >
        {service ? "Sửa" : "+ Thêm dịch vụ"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            action={async (formData) => {
              service
                ? await updateService(service.id, formData)
                : await addService(formData);
              setIsOpen(false);
            }}
            className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {service ? "Chỉnh sửa dịch vụ" : "Thêm mới dịch vụ"}
            </h2>

            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Tên dịch vụ
              </label>
              <input
                name="name"
                defaultValue={service?.name}
                placeholder="VD: ROSE"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  Giá (đ)
                </label>
                <input
                  name="price"
                  defaultValue={service?.price}
                  placeholder="VD: 645000"
                  type="number"
                  min={0}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  Thời gian (phút)
                </label>
                <input
                  name="duration"
                  defaultValue={service?.duration ?? undefined}
                  placeholder="VD: 60"
                  type="number"
                  min={0}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">Mô tả</label>
              <textarea
                name="description"
                defaultValue={service?.description ?? undefined}
                placeholder="Mô tả ngắn về dịch vụ..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                rows={3}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Trạng thái
              </label>
              <select
                name="status"
                defaultValue={service?.status ?? "active"}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              >
                <option value="active">Đang kinh doanh</option>
                <option value="inactive">Ngừng kinh doanh</option>
              </select>
            </div>

            <input type="hidden" name="category_id" value={typeId} />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
