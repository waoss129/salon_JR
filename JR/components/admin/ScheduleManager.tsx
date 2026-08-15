"use client";

import { useState, useTransition } from "react";
import {
  getSchedules,
  updateScheduleStatus,
  type EmployeeOption,
  type SessionRow,
  type ScheduleStatus,
} from "@/app/admin/schedules/actions";
import { AddScheduleForm } from "./ScheduleForm";
import { canManage } from "@/lib/supabase/permissions";

type Role = { id: number; role_name: string };

type ScheduleRow = {
  id: string;
  date: string;
  status: ScheduleStatus;
  session: {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
  } | null;
  employee: {
    id: string;
    role_id: number;
    roles: { role_name: string } | null;
    profile: { fullname: string; avatar: string | null } | null;
  } | null;
};

const STATUS_LABEL: Record<ScheduleStatus, string> = {
  assigned: "Đã xếp lịch",
  checked_in: "Đang làm",
  completed: "Hoàn thành",
  absent: "Vắng mặt",
  cancelled: "Đã huỷ",
};

export function ScheduleManager({
  initialSchedules,
  sessions,
  roles,
  employees,
  initialWeekStart,
  initialWeekEnd,
  viewerRoleId,
  viewerEmployeeId,
}: {
  initialSchedules: ScheduleRow[];
  sessions: SessionRow[];
  roles: Role[];
  employees: EmployeeOption[];
  initialWeekStart: string;
  initialWeekEnd: string;
  viewerRoleId?: number | null;
  viewerEmployeeId?: string | null;
}) {
  const [schedules, setSchedules] = useState<ScheduleRow[]>(initialSchedules);
  const [weekStart, setWeekStart] = useState(initialWeekStart);
  const [weekEnd, setWeekEnd] = useState(initialWeekEnd);
  const [roleId, setRoleId] = useState<number | "">("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Role 4 (Beautician) và Role 5 (Lễ tân): chỉ xem lịch của chính mình,
  // không có bộ lọc, không thêm được lịch (xem canViewOwnScheduleOnly()
  // trong lib/supabase/permissions.ts).
  const isSelfServiceOnly = viewerRoleId === 4 || viewerRoleId === 5;

  // Cả role 4 (beautician) và role 5 (lễ tân) đều được tự check-in/hoàn
  // thành ca của chính mình — khớp canCheckInOwnSchedule() trong
  // lib/supabase/permissions.ts.
  const canCheckIn = viewerRoleId === 4 || viewerRoleId === 5;

  const canAddSchedule = canManage(viewerRoleId ?? null, "schedules");

  // Có cột "Hành động" hay không, tuỳ theo đang ở chế độ tự xem (role 4/5)
  // hay chế độ quản lý (role 1/2/3).
  const showActionColumn = isSelfServiceOnly ? canCheckIn : canAddSchedule;
  const baseColumnCount = isSelfServiceOnly ? 3 : 5; // Ngày/Ca/Trạng thái, hoặc +Nhân viên/Vai trò
  const columnCount = baseColumnCount + (showActionColumn ? 1 : 0);

  // Danh sách nhân viên cho form Thêm lịch phải khớp với bộ lọc vai trò
  // đang chọn ở ngoài — nếu không lọc ở đây, form sẽ luôn hiện cả 3 role
  // gộp lại bất kể admin đang lọc gì.
  const employeesForForm = roleId
    ? employees.filter((e) => e.role_id === roleId)
    : employees;

  function shiftDate(dateStr: string, days: number) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function refresh(
    nextRoleId: number | "",
    nextSearch: string,
    nextWeekStart = weekStart,
    nextWeekEnd = weekEnd,
  ) {
    startTransition(async () => {
      const data = await getSchedules({
        weekStart: nextWeekStart,
        weekEnd: nextWeekEnd,
        roleId: nextRoleId || undefined,
        search: nextSearch || undefined,
        onlyEmployeeId:
          isSelfServiceOnly && viewerEmployeeId ? viewerEmployeeId : undefined,
      });
      setSchedules(data as ScheduleRow[]);
    });
  }

  function goToWeek(direction: -1 | 1) {
    const nextStart = shiftDate(weekStart, direction * 7);
    const nextEnd = shiftDate(weekEnd, direction * 7);
    setWeekStart(nextStart);
    setWeekEnd(nextEnd);
    refresh(roleId, search, nextStart, nextEnd);
  }

  async function handleCheckIn(scheduleId: string, nextStatus: ScheduleStatus) {
    setActionError(null);
    setCheckingInId(scheduleId);
    try {
      await updateScheduleStatus(scheduleId, nextStatus);
      refresh(roleId, search);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Không thể cập nhật trạng thái",
      );
    } finally {
      setCheckingInId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!isSelfServiceOnly && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Tìm theo tên nhân viên"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              refresh(roleId, e.target.value);
            }}
            className="border rounded px-2 py-1.5 text-sm flex-1 min-w-[180px]"
          />
          <select
            value={roleId}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : "";
              setRoleId(value);
              refresh(value, search);
            }}
            className="border rounded px-2 py-1.5 text-sm"
          >
            <option value="">Tất cả vai trò</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.role_name}
              </option>
            ))}
          </select>
          <button
            onClick={() => goToWeek(-1)}
            className="border rounded px-2 py-1.5 text-sm"
            aria-label="Tuần trước"
          >
            &lsaquo;
          </button>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {weekStart} - {weekEnd}
          </span>
          <button
            onClick={() => goToWeek(1)}
            className="border rounded px-2 py-1.5 text-sm"
            aria-label="Tuần sau"
          >
            &rsaquo;
          </button>
          {canAddSchedule && (
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="bg-black text-white rounded px-3 py-1.5 text-sm"
              >
                + Thêm lịch
              </button>
            </div>
          )}
        </div>
      )}

      {isSelfServiceOnly && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToWeek(-1)}
            className="border rounded px-2 py-1.5 text-sm"
            aria-label="Tuần trước"
          >
            &lsaquo;
          </button>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Lịch làm việc của bạn — {weekStart} - {weekEnd}
          </span>
          <button
            onClick={() => goToWeek(1)}
            className="border rounded px-2 py-1.5 text-sm"
            aria-label="Tuần sau"
          >
            &rsaquo;
          </button>
        </div>
      )}

      {actionError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-2.5">
          {actionError}
        </p>
      )}

      <table className="w-full text-sm border rounded overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            {!isSelfServiceOnly && <th className="text-left p-2">Nhân viên</th>}
            {!isSelfServiceOnly && <th className="text-left p-2">Vai trò</th>}
            <th className="text-left p-2">Ngày</th>
            <th className="text-left p-2">Ca</th>
            <th className="text-left p-2">Trạng thái</th>
            {showActionColumn && <th className="text-left p-2">Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {isPending && (
            <tr>
              <td colSpan={columnCount} className="p-3 text-center text-gray-400">
                Đang tải...
              </td>
            </tr>
          )}
          {!isPending && schedules.length === 0 && (
            <tr>
              <td colSpan={columnCount} className="p-3 text-center text-gray-400">
                {isSelfServiceOnly
                  ? "Bạn chưa được xếp lịch làm việc trong tuần này"
                  : "Chưa có lịch làm việc nào trong tuần này"}
              </td>
            </tr>
          )}
          {!isPending &&
            schedules.map((s) => (
              <tr key={s.id} className="border-t">
                {!isSelfServiceOnly && (
                  <td className="p-2">
                    {s.employee?.profile?.fullname ?? "—"}
                  </td>
                )}
                {!isSelfServiceOnly && (
                  <td className="p-2">{s.employee?.roles?.role_name ?? "—"}</td>
                )}
                <td className="p-2">{s.date}</td>
                <td className="p-2">{s.session?.name ?? "—"}</td>
                <td className="p-2">{STATUS_LABEL[s.status]}</td>
                {isSelfServiceOnly && canCheckIn && (
                  <td className="p-2">
                    {s.status === "assigned" && (
                      <button
                        onClick={() => handleCheckIn(s.id, "checked_in")}
                        disabled={checkingInId === s.id}
                        className="bg-black text-white rounded px-3 py-1.5 text-xs disabled:opacity-50"
                      >
                        {checkingInId === s.id ? "Đang xử lý..." : "Check-in"}
                      </button>
                    )}
                    {s.status === "checked_in" && (
                      <button
                        onClick={() => handleCheckIn(s.id, "completed")}
                        disabled={checkingInId === s.id}
                        className="bg-emerald-600 text-white rounded px-3 py-1.5 text-xs disabled:opacity-50"
                      >
                        {checkingInId === s.id ? "Đang xử lý..." : "Hoàn thành"}
                      </button>
                    )}
                    {!["assigned", "checked_in"].includes(s.status) && (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                )}
                {!isSelfServiceOnly && canAddSchedule && (
                  <td className="p-2">
                    <select
                      value={s.status}
                      disabled={checkingInId === s.id}
                      onChange={(e) =>
                        handleCheckIn(s.id, e.target.value as ScheduleStatus)
                      }
                      className="border rounded px-2 py-1 text-xs disabled:opacity-50"
                    >
                      {Object.entries(STATUS_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-base font-medium mb-4">Thêm lịch làm việc</h2>
            <AddScheduleForm
              sessions={sessions}
              employees={employeesForForm}
              onCancel={() => setShowForm(false)}
              onSuccess={() => {
                setShowForm(false);
                refresh(roleId, search);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}