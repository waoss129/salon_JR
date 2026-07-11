"use client";

import { useState, useTransition } from "react";
import {
  getAppointments,
  updateAppointmentStatus,
  type AppointmentRow,
  type AppointmentStatus,
} from "@/app/admin/appointments/actions";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Hoàn thành",
  cancelled: "Đã huỷ",
  no_show: "Khách không đến",
};

const STATUS_COLOR: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-200 text-gray-600",
  no_show: "bg-red-100 text-red-700",
};

// Với mỗi trạng thái hiện tại, admin được phép chuyển sang những trạng thái nào
const NEXT_ACTIONS: Record<
  AppointmentStatus,
  { label: string; next: AppointmentStatus }[]
> = {
  pending: [
    { label: "Xác nhận", next: "confirmed" },
    { label: "Huỷ", next: "cancelled" },
  ],
  confirmed: [
    { label: "Hoàn thành", next: "completed" },
    { label: "Không đến", next: "no_show" },
    { label: "Huỷ", next: "cancelled" },
  ],
  completed: [],
  cancelled: [],
  no_show: [],
};

function formatTime(time: string) {
  return time?.slice(0, 5) ?? "";
}

function formatCurrency(amount: number) {
  return amount.toLocaleString("vi-VN") + "đ";
}

export function AppointmentManager({
  initialAppointments,
  initialDate,
}: {
  initialAppointments: AppointmentRow[];
  initialDate: string;
}) {
  const [appointments, setAppointments] =
    useState<AppointmentRow[]>(initialAppointments);
  const [date, setDate] = useState(initialDate);
  const [status, setStatus] = useState<AppointmentStatus | "">("");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  function refresh(
    nextDate: string,
    nextStatus: AppointmentStatus | "",
    nextSearch: string,
  ) {
    startTransition(async () => {
      const data = await getAppointments({
        date: nextDate,
        status: nextStatus || undefined,
        search: nextSearch || undefined,
      });
      setAppointments(data);
    });
  }

  function shiftDay(days: number) {
    const [y, m, d] = date.split("-").map(Number);
    const next = new Date(y, m - 1, d);
    next.setDate(next.getDate() + days);
    const nextDate = next.toISOString().slice(0, 10);
    setDate(nextDate);
    refresh(nextDate, status, search);
  }

  async function handleStatusChange(
    appointmentId: string,
    next: AppointmentStatus,
  ) {
    setUpdatingId(appointmentId);
    try {
      await updateAppointmentStatus(appointmentId, next);
      refresh(date, status, search);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Không thể cập nhật trạng thái",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Tìm theo tên khách hàng"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            refresh(date, status, e.target.value);
          }}
          className="border rounded px-2 py-1.5 text-sm flex-1 min-w-[180px]"
        />
        <select
          value={status}
          onChange={(e) => {
            const value = e.target.value as AppointmentStatus | "";
            setStatus(value);
            refresh(date, value, search);
          }}
          className="border rounded px-2 py-1.5 text-sm"
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          onClick={() => shiftDay(-1)}
          className="border rounded px-2 py-1.5 text-sm"
          aria-label="Ngày trước"
        >
          &lsaquo;
        </button>
        <span className="text-sm text-gray-500 whitespace-nowrap">{date}</span>
        <button
          onClick={() => shiftDay(1)}
          className="border rounded px-2 py-1.5 text-sm"
          aria-label="Ngày sau"
        >
          &rsaquo;
        </button>
      </div>

      <table className="w-full text-sm border rounded overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2">Khách hàng</th>
            <th className="text-left p-2">Giờ hẹn</th>
            <th className="text-left p-2">Nhân viên</th>
            <th className="text-left p-2">Dịch vụ</th>
            <th className="text-left p-2">Tổng tiền</th>
            <th className="text-left p-2">Trạng thái</th>
            <th className="text-left p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {isPending && (
            <tr>
              <td colSpan={7} className="p-3 text-center text-gray-400">
                Đang tải...
              </td>
            </tr>
          )}
          {!isPending && appointments.length === 0 && (
            <tr>
              <td colSpan={7} className="p-3 text-center text-gray-400">
                Chưa có lịch hẹn nào trong ngày này
              </td>
            </tr>
          )}
          {!isPending &&
            appointments.map((a) => {
              const total = a.details.reduce((sum, d) => sum + d.price, 0);
              const time = new Date(a.appointment_date);
              const actions = NEXT_ACTIONS[a.status];

              return (
                <tr key={a.id} className="border-t align-top">
                  <td className="p-2">
                    <div>
                      {a.customer?.profile?.fullname ?? "Chưa cập nhật tên"}
                    </div>
                    {a.customer?.profile?.phone && (
                      <div className="text-xs text-gray-400">
                        {a.customer.profile.phone}
                      </div>
                    )}
                  </td>
                  <td className="p-2">
                    {time.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {a.schedule?.session && (
                      <div className="text-xs text-gray-400">
                        {a.schedule.session.name} (
                        {formatTime(a.schedule.session.start_time)} -{" "}
                        {formatTime(a.schedule.session.end_time)})
                      </div>
                    )}
                  </td>
                  <td className="p-2">
                    {a.schedule?.employee?.profile?.fullname ?? "—"}
                  </td>
                  <td className="p-2">
                    {a.details.length === 0
                      ? "—"
                      : a.details
                          .map((d) => d.service?.name)
                          .filter(Boolean)
                          .join(", ")}
                  </td>
                  <td className="p-2">{formatCurrency(total)}</td>
                  <td className="p-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${STATUS_COLOR[a.status]}`}
                    >
                      {STATUS_LABEL[a.status]}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-1">
                      {actions.map((action) => (
                        <button
                          key={action.next}
                          onClick={() => handleStatusChange(a.id, action.next)}
                          disabled={updatingId === a.id}
                          className="border rounded px-2 py-1 text-xs disabled:opacity-50"
                        >
                          {action.label}
                        </button>
                      ))}
                      {actions.length === 0 && (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
