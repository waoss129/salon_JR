"use client";

import { useState } from "react";
import {
  confirmProposalBatch,
  type ProposalBatchSummary,
} from "@/app/admin/schedules/proposals/actions";
import { useRouter } from "next/navigation";

const STATUS_LABEL: Record<string, string> = {
  awaiting_employee: "Chờ nhân viên chọn",
  awaiting_admin: "Chờ Admin chốt",
  confirmed: "Đã chốt",
};

export default function ScheduleProposalReview({
  batches,
}: {
  batches: ProposalBatchSummary[];
}) {
  const router = useRouter();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm(batchId: string) {
    setError(null);
    setConfirmingId(batchId);
    try {
      const result = await confirmProposalBatch(batchId);
      if (!result.emailSent) {
        alert(
          `Đã chốt lịch thành công, nhưng gửi mail xác nhận thất bại: ${
            result.emailError ?? "Lỗi không xác định"
          }. Bạn nên báo trực tiếp cho nhân viên.`,
        );
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể chốt lịch.");
    } finally {
      setConfirmingId(null);
    }
  }

  if (batches.length === 0) {
    return (
      <p className="text-gray-400">Chưa có đề xuất lịch nào cho tuần sau.</p>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {batches.map((b) => (
        <div key={b.batchId} className="rounded-lg border border-gray-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">{b.employeeName}</p>
              <p className="text-xs text-gray-400">
                Tuần {b.weekStart} → {b.weekEnd} · Hạn:{" "}
                {new Date(b.deadlineIso).toLocaleString("vi-VN")}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                b.status === "confirmed"
                  ? "bg-emerald-100 text-emerald-700"
                  : b.status === "awaiting_admin"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {STATUS_LABEL[b.status]}
              {b.isPastDeadline && b.status === "awaiting_employee"
                ? " (quá hạn, áp dụng mặc định)"
                : ""}
            </span>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-1">Ngày</th>
                <th className="pb-1">Loại</th>
                <th className="pb-1">Ca</th>
              </tr>
            </thead>
            <tbody>
              {b.items.map((it, idx) => (
                <tr key={idx} className="border-t border-gray-100">
                  <td className="py-1">{it.date}</td>
                  <td className="py-1">
                    {it.shiftType === "special" ? "Cuối tuần" : "Thường"}
                  </td>
                  <td className="py-1">
                    {it.shiftType === "special"
                      ? "Cả ngày"
                      : it.sessionShiftType === "CH"
                        ? "Chiều"
                        : "Sáng"}
                  </td>
                </tr>
              ))}
              {b.items.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-2 text-center text-gray-400">
                    Chưa có ca nào được chọn.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {b.status !== "confirmed" && (
            <button
              onClick={() => handleConfirm(b.batchId)}
              disabled={confirmingId === b.batchId || b.items.length === 0}
              className="mt-3 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {confirmingId === b.batchId ? "Đang chốt..." : "Chốt lịch"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
