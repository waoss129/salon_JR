"use client";

import { useState, useTransition } from "react";
import {
  createSchedules,
  type EmployeeOption,
  type SessionRow,
} from "@/app/admin/schedules/actions";

export function AddScheduleForm({
  sessions,
  employees,
  onSuccess,
  onCancel,
}: {
  sessions: SessionRow[];
  employees: EmployeeOption[];
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Tính thứ trong tuần từ chuỗi "YYYY-MM-DD" theo giờ LOCAL (không dùng
  // new Date(dateStr) trực tiếp vì nó parse theo UTC, dễ lệch 1 ngày tuỳ
  // múi giờ trình duyệt).
  // getDay(): 0 = Chủ nhật, 1-5 = Thứ 2 - Thứ 6, 6 = Thứ 7
  function getWeekdayGroup(dateStr: string): "T2-T6" | "T7" | "CN" | null {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-").map(Number);
    const dow = new Date(y, m - 1, d).getDay();
    if (dow >= 1 && dow <= 5) return "T2-T6";
    if (dow === 6) return "T7";
    return "CN"; // Chủ nhật - hiện tại chưa có ca nào áp dụng
  }

  const weekdayGroup = getWeekdayGroup(date);

  // Gợi ý lâu dài: nên thêm cột `applies_to` (enum: weekday/saturday/sunday)
  // vào bảng sessions thay vì suy luận từ chuỗi tên như dưới đây.
  const applicableSessions =
    weekdayGroup && weekdayGroup !== "CN"
      ? sessions.filter((s) => s.name.toUpperCase().includes(weekdayGroup))
      : [];

  const morningSessions = applicableSessions.filter((s) =>
    s.name.toUpperCase().startsWith("SA"),
  );
  const afternoonSessions = applicableSessions.filter((s) =>
    s.name.toUpperCase().startsWith("CH"),
  );

  function toggleSession(id: number) {
    setSelectedSessions((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function handleDateChange(value: string) {
    setDate(value);
    // Ngày đổi -> nhóm thứ có thể đổi -> bỏ chọn các ca không còn phù hợp
    const nextGroup = getWeekdayGroup(value);
    const nextApplicable =
      nextGroup && nextGroup !== "CN"
        ? sessions
            .filter((s) => s.name.toUpperCase().includes(nextGroup))
            .map((s) => s.id)
        : [];
    setSelectedSessions((prev) =>
      prev.filter((id) => nextApplicable.includes(id)),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!employeeId || !date || selectedSessions.length === 0) {
      setError("Vui lòng chọn nhân viên, ngày và ít nhất một ca làm việc");
      return;
    }

    startTransition(async () => {
      try {
        await createSchedules({
          employeeId,
          date,
          sessionIds: selectedSessions,
        });
        setSelectedSessions([]);
        setDate("");
        onSuccess?.();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Có lỗi xảy ra, vui lòng thử lại",
        );
      }
    });
  }

  function renderSessionGroup(title: string, group: SessionRow[]) {
    return (
      <div className="flex-1">
        <p className="text-sm font-medium mb-2">{title}</p>
        <div className="flex flex-col gap-2">
          {group.length === 0 && (
            <p className="text-sm text-gray-400">Chưa có ca nào</p>
          )}
          {group.map((session) => (
            <label key={session.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedSessions.includes(session.id)}
                onChange={() => toggleSession(session.id)}
              />
              <span>
                {session.name} ({session.start_time.slice(0, 5)} -{" "}
                {session.end_time.slice(0, 5)})
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium block mb-1">Nhân viên</label>
        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="w-full border rounded px-2 py-1.5"
        >
          <option value="">-- Chọn nhân viên --</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.fullname}
              {emp.role_name ? ` (${emp.role_name})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Ngày làm việc</label>
        <input
          type="date"
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-full border rounded px-2 py-1.5"
        />
      </div>

      {!date && (
        <p className="text-sm text-gray-400">
          Chọn ngày làm việc để hệ thống tự lọc ca phù hợp
        </p>
      )}

      {weekdayGroup === "CN" && (
        <p className="text-sm text-amber-600">
          Ngày này rơi vào Chủ nhật — hiện chưa có ca làm việc nào áp dụng cho
          Chủ nhật
        </p>
      )}

      {date && weekdayGroup !== "CN" && (
        <div className="flex gap-6">
          {renderSessionGroup("Buổi sáng", morningSessions)}
          {renderSessionGroup("Buổi chiều", afternoonSessions)}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border rounded px-3 py-1.5 text-sm"
          >
            Huỷ
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="bg-black text-white rounded px-3 py-1.5 text-sm disabled:opacity-50"
        >
          {isPending ? "Đang lưu..." : "Thêm lịch làm việc"}
        </button>
      </div>
    </form>
  );
}
