"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import {
  getBills,
  type BillListItem,
  type BillStatus,
} from "@/app/admin/bills/actions";
import BillFormModal from "./BillFormModal";
import BillDetailModal from "./BillDetailModal";

const STATUS_LABEL: Record<BillStatus, string> = {
  unpaid: "Chưa thanh toán",
  paid: "Đã thanh toán",
  refunded: "Đã hoàn tiền",
};

const STATUS_STYLE: Record<BillStatus, string> = {
  unpaid: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  refunded: "bg-gray-100 text-gray-600",
};

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

function formatDateTime(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BillList({
  canManage,
}: {
  // Người đang xem có được tạo hóa đơn mới / xác nhận thanh toán hay
  // không — vd: role 2 (CEO) chỉ xem, phải false. Mặc định false để an
  // toàn (fail-closed) nếu quên truyền.
  canManage?: boolean;
}) {
  const [bills, setBills] = useState<BillListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);

  const fetchBills = useCallback(() => {
    startTransition(async () => {
      const { data, error } = await getBills({
        date: date || undefined,
        search: search || undefined,
      });
      if (error) {
        console.error(error);
        return;
      }
      setBills(data);
      setLoading(false);
    });
  }, [date, search]);

  // Debounce nhẹ để không gọi action liên tục khi gõ tìm kiếm.
  useEffect(() => {
    const timeout = setTimeout(fetchBills, 300);
    return () => clearTimeout(timeout);
  }, [fetchBills]);

  const hasFilter = Boolean(date || search);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Ngày lập</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Tìm theo tên / SĐT</label>
            <input
              type="text"
              placeholder="Nhập tên hoặc số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
          {hasFilter && (
            <button
              onClick={() => {
                setDate("");
                setSearch("");
              }}
              className="h-9 self-end text-sm text-gray-500 hover:text-gray-700"
            >
              Xóa lọc
            </button>
          )}
        </div>

        {canManage && (
          <button
            onClick={() => setShowFormModal(true)}
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
                Mã hóa đơn
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Khách hàng
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                SĐT
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                Tổng tiền
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Ngày lập
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Ngày thanh toán
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  Đang tải...
                </td>
              </tr>
            ) : bills.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  Không có hóa đơn nào.
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    {bill.billCode}
                  </td>
                  <td className="px-4 py-3">{bill.customerName}</td>
                  <td className="px-4 py-3">{bill.phone}</td>
                  <td className="px-4 py-3 text-right">
                    {formatCurrency(bill.totalPrice)}
                  </td>
                  <td className="px-4 py-3">
                    {formatDateTime(bill.createdAt)}
                  </td>
                  <td className="px-4 py-3">{formatDateTime(bill.paidAt)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[bill.status]}`}
                    >
                      {STATUS_LABEL[bill.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedBillId(bill.id)}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {canManage && showFormModal && (
        <BillFormModal
          onClose={() => setShowFormModal(false)}
          onCreated={() => {
            setShowFormModal(false);
            fetchBills();
          }}
        />
      )}

      {selectedBillId && (
        <BillDetailModal
          billId={selectedBillId}
          canManage={canManage}
          onClose={() => setSelectedBillId(null)}
          onUpdated={fetchBills}
        />
      )}
    </div>
  );
}