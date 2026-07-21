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

  // dowNum: 1 = Thứ 2 ... 6 = Thứ 7, 7 = Chủ nhật — khớp CHECK constraint
  // của cột sessions.day_of_week (1-7). Tính theo giờ LOCAL (không dùng
  // new Date(dateStr) trực tiếp vì nó parse theo UTC, dễ lệch 1 ngày tuỳ
  // múi giờ trình duyệt).
  function dowNumOf(dateStr: string): number | null {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-").map(Number);
    const dow = new Date(y, m - 1, d).getDay(); // 0 = Chủ nhật
    return dow === 0 ? 7 : dow;
  }

  const dowNum = dowNumOf(date);

  // Lọc đúng theo cột day_of_week thật trong DB — trước đây suy luận qua
  // tên session (vd .name.includes("T2-T6")) nên dễ vỡ nếu đặt tên không
  // đúng quy ước, và mặc định luôn coi Chủ nhật là chưa có ca dù dữ liệu
  // thật có thể đã có. Giờ để dữ liệu tự quyết định, không giả định nữa.
  const applicableSessions = dowNum
    ? sessions.filter((s) => s.day_of_week === dowNum)
    : [];

  const morningSessions = applicableSessions.filter(
    (s) => s.shift_type === "SA",
  );
  const afternoonSessions = applicableSessions.filter(
    (s) => s.shift_type === "CH",
  );

  function toggleSession(id: number) {
    setSelectedSessions((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function handleDateChange(value: string) {
    setDate(value);
    // Ngày đổi -> ca áp dụng có thể đổi -> bỏ chọn các ca không còn phù hợp.
    const nextDowNum = dowNumOf(value);
    const nextApplicable = nextDowNum
      ? sessions.filter((s) => s.day_of_week === nextDowNum).map((s) => s.id)
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

      {date && applicableSessions.length === 0 && (
        <p className="text-sm text-amber-600">
          Ngày này hiện chưa có ca làm việc nào được cấu hình.
        </p>
      )}

      {date && applicableSessions.length > 0 && (
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
