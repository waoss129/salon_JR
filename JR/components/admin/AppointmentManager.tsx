"use client";

import { useState, useTransition } from "react";
import {
  getAppointments,
  updateAppointmentStatus,
  getAvailableEmployeesForAppointment,
  assignAppointmentEmployee,
  type AppointmentRow,
  type AppointmentStatus,
  type AvailableEmployeeOption,
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

const NEXT_ACTIONS: Record<
  AppointmentStatus,
  { label: string; next: AppointmentStatus }[]
> = {
  pending: [{ label: "Huỷ", next: "cancelled" }],
  confirmed: [
    { label: "Hoàn thành", next: "completed" },
    { label: "Không đến", next: "no_show" },
    { label: "Huỷ", next: "cancelled" },
  ],
  completed: [],
  cancelled: [],
  no_show: [],
};

// Lịch hẹn ở trạng thái này thì admin còn có thể gán/đổi nhân viên
const ASSIGNABLE_STATUSES: AppointmentStatus[] = ["pending", "confirmed"];

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

  // State cho modal "Gán nhân viên"
  const [assigningFor, setAssigningFor] = useState<AppointmentRow | null>(null);
  const [employeeOptions, setEmployeeOptions] = useState<
    AvailableEmployeeOption[]
  >([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

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

  async function openAssignModal(appointment: AppointmentRow) {
    setAssigningFor(appointment);
    setEmployeeOptions([]);
    setAssignError(null);
    setLoadingOptions(true);
    try {
      const options = await getAvailableEmployeesForAppointment(appointment.id);
      setEmployeeOptions(options);
    } catch (err) {
      setAssignError(
        err instanceof Error
          ? err.message
          : "Không thể tải danh sách nhân viên",
      );
    } finally {
      setLoadingOptions(false);
    }
  }

  async function handleAssign(scheduleId: string) {
    if (!assigningFor) return;
    setUpdatingId(assigningFor.id);
    try {
      await assignAppointmentEmployee(assigningFor.id, scheduleId);
      setAssigningFor(null);
      refresh(date, status, search);
    } catch (err) {
      setAssignError(
        err instanceof Error ? err.message : "Không thể gán nhân viên",
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
              const canAssign = ASSIGNABLE_STATUSES.includes(a.status);

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
                      {canAssign && (
                        <button
                          onClick={() => openAssignModal(a)}
                          disabled={updatingId === a.id}
                          className="border rounded px-2 py-1 text-xs bg-violet-50 text-violet-700 disabled:opacity-50"
                        >
                          Gán nhân viên
                        </button>
                      )}
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
                      {actions.length === 0 && !canAssign && (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* Modal gán nhân viên */}
      {assigningFor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Gán nhân viên phù hợp</h3>
              <button
                onClick={() => setAssigningFor(null)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-3">
              Khách hàng:{" "}
              <span className="font-medium text-gray-700">
                {assigningFor.customer?.profile?.fullname ?? "—"}
              </span>{" "}
              · Dịch vụ:{" "}
              <span className="font-medium text-gray-700">
                {assigningFor.details
                  .map((d) => d.service?.name)
                  .filter(Boolean)
                  .join(", ") || "—"}
              </span>
            </p>

            {loadingOptions && (
              <div className="text-sm text-gray-400 py-4 text-center">
                Đang tìm nhân viên trống phù hợp...
              </div>
            )}

            {!loadingOptions && assignError && (
              <div className="text-sm text-red-500 py-2">{assignError}</div>
            )}

            {!loadingOptions &&
              !assignError &&
              employeeOptions.length === 0 && (
                <div className="text-sm text-gray-400 py-4 text-center">
                  Không có nhân viên nào đang trống và phù hợp chuyên môn trong
                  ngày này.
                </div>
              )}

            {!loadingOptions && employeeOptions.length > 0 && (
              <ul className="space-y-1 max-h-64 overflow-y-auto">
                {employeeOptions.map((opt) => (
                  <li key={opt.scheduleId}>
                    <button
                      onClick={() => handleAssign(opt.scheduleId)}
                      disabled={updatingId === assigningFor.id}
                      className="w-full text-left border rounded px-3 py-2 text-sm hover:bg-violet-50 disabled:opacity-50 flex items-center justify-between"
                    >
                      <span>{opt.employeeName ?? "Nhân viên chưa rõ tên"}</span>
                      {opt.employeeLevel && (
                        <span className="text-xs text-gray-400">
                          {opt.employeeLevel}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
