"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  submitMyProposalSelection,
  type MyProposalBatch,
} from "@/app/admin/schedules/proposals/actions";
import type { SessionRow } from "@/app/admin/schedules/actions";

const WEEKDAY_LABEL: Record<number, string> = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  0: "Chủ nhật",
};

function dateDayOfWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

// Format ngày theo giờ LOCAL, dạng YYYY-MM-DD — KHÔNG dùng d.toISOString()
// ở đây. toISOString() quy đổi sang UTC: với múi giờ Việt Nam (UTC+7), nửa
// đêm giờ VN của 1 ngày bị lùi về 17h hôm trước theo UTC, khiến chuỗi ngày
// trả về bị lùi mất 1 ngày so với ngày thực tế trên lịch — đây chính là lỗi
// đã gặp và sửa ở ProposeScheduleModal.tsx / getNextWeekInfo() (server),
// nhưng bị bỏ sót ở file này vì trước đó chưa có dữ liệu thật để lộ ra.
function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateLabel(dateStr: string) {
  const dow = dateDayOfWeek(dateStr);
  const d = Number(dateStr.slice(8, 10));
  const m = Number(dateStr.slice(5, 7));
  return `${WEEKDAY_LABEL[dow]} (${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")})`;
}

function shiftLabel(session: SessionRow) {
  if (session.shift_type === "CH") return "Chiều";
  if (session.shift_type === "SA") return "Sáng";
  return "Cả ngày";
}

function sessionsForDate(sessions: SessionRow[], dateStr: string) {
  const dow = dateDayOfWeek(dateStr);
  const dowNum = dow === 0 ? 7 : dow;
  return sessions.filter((s) => s.day_of_week === dowNum);
}

const MIN_REGULAR_DAYS = 4;

export default function MyProposalForm({
  proposal,
  sessions,
}: {
  proposal: MyProposalBatch;
  sessions: SessionRow[];
}) {
  const router = useRouter();

  const weekdayDates = useMemo(() => {
    const set = new Set<string>();
    proposal.items.forEach((it) => {
      if (it.shiftType === "regular") set.add(it.date);
    });
    const [wy, wm, wd] = proposal.weekStart.split("-").map(Number);
    const monday = new Date(wy, wm - 1, wd);
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      set.add(toLocalISODate(d));
    }
    return Array.from(set).sort();
  }, [proposal]);

  const weekendDates = useMemo(() => {
    const [wy, wm, wd] = proposal.weekStart.split("-").map(Number);
    const monday = new Date(wy, wm - 1, wd);
    return [5, 6].map((offset) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + offset);
      return toLocalISODate(d);
    });
  }, [proposal]);

  const initialRegular: Record<string, number | null> = {};
  const initialWeekend: Record<string, number | null> = {};
  proposal.items.forEach((it) => {
    if (it.shiftType === "regular") initialRegular[it.date] = it.sessionId;
    if (it.shiftType === "special") initialWeekend[it.date] = it.sessionId;
  });

  const [regularSelections, setRegularSelections] =
    useState<Record<string, number | null>>(initialRegular);
  const [weekendSelections, setWeekendSelections] =
    useState<Record<string, number | null>>(initialWeekend);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function selectRegular(date: string, sessionId: number) {
    setRegularSelections((prev) => ({
      ...prev,
      [date]: prev[date] === sessionId ? null : sessionId,
    }));
  }

  function toggleWeekend(date: string, sessionId: number) {
    setWeekendSelections((prev) => ({
      ...prev,
      [date]: prev[date] === sessionId ? null : sessionId,
    }));
  }

  const regularDaysSelected = weekdayDates.filter(
    (d) => regularSelections[d] != null,
  ).length;
  const weekendDaysSelected = weekendDates.filter(
    (d) => weekendSelections[d] != null,
  ).length;

  async function handleSubmit() {
    setError(null);
    setSuccess(false);

    if (regularDaysSelected < MIN_REGULAR_DAYS) {
      return setError(`Cần chọn ít nhất ${MIN_REGULAR_DAYS}/5 ngày thường.`);
    }
    if (weekendDaysSelected < 1) {
      return setError(
        "Cần chọn ít nhất 1 ngày cuối tuần (Thứ 7 và/hoặc Chủ nhật).",
      );
    }

    const regularShifts = weekdayDates
      .filter((d) => regularSelections[d] != null)
      .map((d) => ({ date: d, sessionId: regularSelections[d] as number }));

    const specialShifts = weekendDates
      .filter((d) => weekendSelections[d] != null)
      .map((d) => ({ date: d, sessionId: weekendSelections[d] as number }));

    setSaving(true);
    try {
      await submitMyProposalSelection({
        batchId: proposal.id,
        regularShifts,
        specialShifts,
      });
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu lựa chọn.");
    } finally {
      setSaving(false);
    }
  }

  if (proposal.isPastDeadline) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        Đã quá hạn chọn ca (21:00 Thứ 7). Lịch đề xuất ban đầu đã tự động được
        áp dụng — vui lòng liên hệ Admin nếu cần thay đổi.
      </div>
    );
  }

  if (proposal.status === "confirmed") {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
        Lịch tuần này đã được Admin xác nhận, không thể thay đổi thêm.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">
        Bạn có thể giữ nguyên, đổi ca khác, hoặc thêm ngày admin chưa đề xuất —
        miễn đủ tối thiểu {MIN_REGULAR_DAYS}/5 ngày thường và ít nhất 1 ngày
        cuối tuần. Hạn chọn: 21:00 Thứ 7.
      </p>

      <div className="flex items-center gap-4 text-sm">
        <span>
          Ngày thường:{" "}
          <strong
            className={
              regularDaysSelected < MIN_REGULAR_DAYS
                ? "text-red-500"
                : "text-emerald-600"
            }
          >
            {regularDaysSelected}
          </strong>
          /tối thiểu {MIN_REGULAR_DAYS}/5
        </span>
        <span>
          Cuối tuần:{" "}
          <strong
            className={
              weekendDaysSelected < 1 ? "text-red-500" : "text-emerald-600"
            }
          >
            {weekendDaysSelected}
          </strong>
          /tối thiểu 1
        </span>
      </div>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">
          Ngày thường (chọn 1 ca/ngày)
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {weekdayDates.map((date) => {
            const options = sessionsForDate(sessions, date);
            return (
              <div key={date} className="rounded-md border border-gray-200 p-2">
                <p className="mb-2 text-center text-xs font-medium text-gray-600">
                  {formatDateLabel(date)}
                </p>
                <div className="flex flex-col gap-1">
                  {options.map((s) => {
                    const active = regularSelections[date] === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => selectRegular(date, s.id)}
                        className={`rounded px-2 py-1 text-xs ${
                          active
                            ? "bg-black text-white"
                            : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {shiftLabel(s)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">
          Cuối tuần (chọn tối thiểu 1, tối đa 2 ngày)
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {weekendDates.map((date) => {
            const options = sessionsForDate(sessions, date);
            return (
              <div key={date} className="rounded-md border border-gray-200 p-2">
                <p className="mb-2 text-center text-xs font-medium text-gray-600">
                  {formatDateLabel(date)}
                </p>
                <div className="flex flex-col gap-1">
                  {options.map((s) => {
                    const active = weekendSelections[date] === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleWeekend(date, s.id)}
                        className={`rounded px-2 py-1 text-xs ${
                          active
                            ? "bg-black text-white"
                            : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {shiftLabel(s)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-600">
          Đã gửi lựa chọn cho Admin, chờ xác nhận.
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {saving ? "Đang lưu..." : "Gửi lựa chọn cho Admin"}
      </button>
    </div>
  );
}
