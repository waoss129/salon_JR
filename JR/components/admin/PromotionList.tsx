"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deletePromotion,
  getPromotions,
  togglePromotionActive,
  type PromotionListItem,
} from "@/app/admin/promotions/actions";
import PromotionModal from "./PromotionModal";

const WEEKDAY_LABEL: Record<number, string> = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  7: "Chủ nhật",
};

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

function formatDiscount(p: PromotionListItem) {
  return p.discount_type === "percentage"
    ? `${p.discount_value}%`
    : formatCurrency(p.discount_value);
}

function formatCondition(p: PromotionListItem) {
  if (p.is_first_time) return "Khách hàng lần đầu";
  if (p.min_order_value != null)
    return `Hóa đơn ≥ ${formatCurrency(p.min_order_value)}`;
  if (p.day_of_week != null) return WEEKDAY_LABEL[p.day_of_week] ?? "—";
  if (p.serviceCount > 0) return `${p.serviceCount} dịch vụ áp dụng`;
  return "Không điều kiện";
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN");
}

export default function PromotionList({
  canManage,
}: {
  // Người đang xem có được thêm/sửa/xóa/bật-tắt khuyến mãi hay không —
  // vd: role 5 (lễ tân) và role 2 (CEO) chỉ xem, phải false. Mặc định
  // false để an toàn (fail-closed) nếu quên truyền.
  canManage?: boolean;
}) {
  const [promotions, setPromotions] = useState<PromotionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  const fetchPromotions = useCallback(async () => {
    const { data, error } = await getPromotions({
      search: search || undefined,
    });
    if (error) {
      console.error(error);
      return;
    }
    setPromotions(data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(fetchPromotions, 300);
    return () => clearTimeout(timeout);
  }, [fetchPromotions]);

  async function handleToggleActive(p: PromotionListItem) {
    const { error } = await togglePromotionActive(p.id, !p.is_active);
    if (error) {
      alert(error);
      return;
    }
    fetchPromotions();
  }

  async function handleDelete(p: PromotionListItem) {
    if (!confirm(`Xóa khuyến mãi "${p.name}"?`)) return;
    const { error } = await deletePromotion(p.id);
    if (error) {
      alert(error);
      return;
    }
    fetchPromotions();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">
            Tìm theo tên / mã khuyến mãi
          </label>
          <input
            type="text"
            placeholder="Nhập tên hoặc mã..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>

        {canManage && (
          <button
            onClick={() => {
              setEditingId(undefined);
              setShowModal(true);
            }}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Thêm mới
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Tên khuyến mãi
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Mã
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Giảm giá
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Điều kiện
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Thời gian
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Trạng thái
              </th>
              {canManage && (
                <th className="px-4 py-3 text-center font-medium text-gray-500">
                  Hành động
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td
                  colSpan={canManage ? 7 : 6}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  Đang tải...
                </td>
              </tr>
            ) : promotions.length === 0 ? (
              <tr>
                <td
                  colSpan={canManage ? 7 : 6}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  Chưa có khuyến mãi nào.
                </td>
              </tr>
            ) : (
              promotions.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{p.code}</td>
                  <td className="px-4 py-3">{formatDiscount(p)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatCondition(p)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(p.start_date)} → {formatDate(p.end_date)}
                  </td>
                  <td className="px-4 py-3">
                    {canManage ? (
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          p.is_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.is_active ? "Đang hoạt động" : "Ngừng hoạt động"}
                      </button>
                    ) : (
                      // Không có quyền quản lý -> chỉ hiện nhãn tĩnh, không
                      // cho bật/tắt.
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          p.is_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.is_active ? "Đang hoạt động" : "Ngừng hoạt động"}
                      </span>
                    )}
                  </td>
                  {canManage && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            setEditingId(p.id);
                            setShowModal(true);
                          }}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="text-sm font-medium text-red-500 hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {canManage && showModal && (
        <PromotionModal
          promotionId={editingId}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchPromotions();
          }}
        />
      )}
    </div>
  );
}