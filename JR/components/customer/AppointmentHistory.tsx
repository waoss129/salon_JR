"use client";

import { useState, useTransition } from "react";
import {
  getMyAppointments,
  cancelMyAppointment,
  type CustomerAppointmentRow,
  type CustomerAppointmentStatus,
} from "@/app/(customer)/appointments/actions";

const STATUS_LABEL: Record<CustomerAppointmentStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Hoàn thành",
  cancelled: "Đã huỷ",
  no_show: "Đã quá giờ hẹn",
};

const STATUS_COLOR: Record<CustomerAppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-200 text-gray-600",
  no_show: "bg-red-100 text-red-700",
};

const CANCEL_MIN_HOURS_BEFORE = 2;

function canCancel(a: CustomerAppointmentRow) {
  if (!["pending", "confirmed"].includes(a.status)) return false;
  const hoursUntil =
    (new Date(a.appointment_date).getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntil >= CANCEL_MIN_HOURS_BEFORE;
}

function formatCurrency(amount: number) {
  return amount.toLocaleString("vi-VN") + "đ";
}

export function AppointmentHistory({
  initialAppointments,
}: {
  initialAppointments: CustomerAppointmentRow[];
}) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [filter, setFilter] = useState<CustomerAppointmentStatus | "">("");
  const [isPending, startTransition] = useTransition();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    startTransition(async () => {
      const data = await getMyAppointments();
      setAppointments(data);
    });
  }

  async function handleCancel(id: string) {
    if (!confirm("Bạn chắc chắn muốn huỷ lịch hẹn này chứ?")) return;
    setCancellingId(id);
    setError(null);
    try {
      await cancelMyAppointment(id);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể huỷ lịch hẹn");
    } finally {
      setCancellingId(null);
    }
  }

  const filtered = filter
    ? appointments.filter((a) => a.status === filter)
    : appointments;

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-extrabold text-stone-800 mb-6">
        Lịch sử đặt lịch
      </h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
            filter === ""
              ? "bg-orange-500 text-white border-orange-500"
              : "border-stone-200"
          }`}
        >
          Tất cả
        </button>
        {Object.entries(STATUS_LABEL).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value as CustomerAppointmentStatus)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
              filter === value
                ? "bg-orange-500 text-white border-orange-500"
                : "border-stone-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
          {error}
        </p>
      )}

      {isPending && (
        <div className="text-center py-10 text-stone-400">Đang tải...</div>
      )}

      {!isPending && filtered.length === 0 && (
        <div className="text-center py-10 text-stone-400">
          Chưa có lịch hẹn nào
        </div>
      )}

      <div className="space-y-4">
        {!isPending &&
          filtered.map((a) => {
            const time = new Date(a.appointment_date);
            const total = a.details.reduce((sum, d) => sum + d.price, 0);
            return (
              <div
                key={a.id}
                className="border border-stone-200 rounded-2xl p-5 flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-stone-800">
                      {a.details
                        .map((d) => d.service?.name)
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </p>
                    <p className="text-sm text-stone-500">
                      {time.toLocaleDateString("vi-VN")} ·{" "}
                      {time.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {a.schedule?.session && ` (${a.schedule.session.name})`}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[a.status]}`}
                  >
                    {STATUS_LABEL[a.status]}
                  </span>
                </div>

                <p className="text-sm text-stone-500">
                  Nhân viên phục vụ:{" "}
                  <span className="font-medium text-stone-700">
                    {a.schedule?.employee?.profile?.fullname ?? "Đang cập nhật"}
                  </span>
                </p>

                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-orange-600">
                    {formatCurrency(total)}
                  </span>
                  {canCancel(a) && (
                    <button
                      onClick={() => handleCancel(a.id)}
                      disabled={cancellingId === a.id}
                      className="text-sm text-red-500 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 disabled:opacity-50"
                    >
                      Huỷ lịch hẹn
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
