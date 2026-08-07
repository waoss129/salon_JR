"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createScheduleWeek, setShiftCapacity, setRoleDayRequirement } from "@/app/admin/schedules/setup/actions";

// Đổi lại 2 hằng số này cho khớp role_id thật trong DB của bạn
const CHUYEN_VIEN_ROLE_ID = 4;
const THRESHOLD_ROLE_IDS = [3, 5]; // Quản lý, Lễ tân

type Session = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  shift_type: "SA" | "CH" | null;
  day_of_week: number | null;
};

type Role = { id: number; role_name: string };

type Props = {
  week: { id: string; week_start: string; week_end: string; registration_deadline: string; status: string } | null;
  sessions: Session[];
  roles: Role[];
  capacity: { session_id: number; date: string; slot_target: number }[];
  requirements: { date: string; role_id: number; min_count: number }[];
};

const WEEKDAY_LABEL = ["", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

function getWeekDates(weekStart: string) {
  const start = new Date(weekStart);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function isWeekend(dateStr: string) {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
}

export default function SetupBoard({ week, sessions, roles, capacity, requirements }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [capacityValues, setCapacityValues] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    capacity.forEach((c) => (m[`${c.session_id}_${c.date}`] = c.slot_target));
    return m;
  });

  const [requirementValues, setRequirementValues] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    requirements.forEach((r) => (m[`${r.date}_${r.role_id}`] = r.min_count));
    return m;
  });

  const dates = useMemo(() => (week ? getWeekDates(week.week_start) : []), [week]);
  const weekendDates = dates.filter(isWeekend);
  const thresholdRoles = roles.filter((r) => THRESHOLD_ROLE_IDS.includes(r.id));

  function handleCreateWeek() {
    setErrorMsg(null);
    setCreating(true);
    startTransition(async () => {
      try {
        await createScheduleWeek();
        router.refresh();
      } catch (err: any) {
        setErrorMsg(err?.message ?? "Không thể tạo tuần mới.");
      } finally {
        setCreating(false);
      }
    });
  }

  function handleCapacityBlur(sessionId: number, date: string, value: string) {
    const key = `${sessionId}_${date}`;
    const parsed = parseInt(value, 10);
    if (!week || isNaN(parsed) || parsed <= 0) return;

    const previous = capacityValues[key] ?? 0;
    if (parsed < previous) {
      setErrorMsg("Slot chỉ được tăng, không được giảm.");
      setCapacityValues((s) => ({ ...s, [key]: previous }));
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      try {
        await setShiftCapacity({ weekId: week.id, sessionId, date, slotTarget: parsed });
        setCapacityValues((s) => ({ ...s, [key]: parsed }));
      } catch (err: any) {
        setErrorMsg(err?.message ?? "Không thể cập nhật slot.");
        setCapacityValues((s) => ({ ...s, [key]: previous }));
      }
    });
  }

  function handleRequirementBlur(date: string, roleId: number, value: string) {
    const key = `${date}_${roleId}`;
    const parsed = parseInt(value, 10);
    if (!week || isNaN(parsed) || parsed < 0) return;

    setErrorMsg(null);
    startTransition(async () => {
      try {
        await setRoleDayRequirement({ weekId: week.id, date, roleId, minCount: parsed });
        setRequirementValues((s) => ({ ...s, [key]: parsed }));
      } catch (err: any) {
        setErrorMsg(err?.message ?? "Không thể cập nhật ngưỡng tối thiểu.");
      }
    });
  }

  if (!week) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-neutral-500">Chưa có tuần nào được thiết lập cho lịch đăng ký tiếp theo.</p>
        {errorMsg && <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{errorMsg}</div>}
        <button
          disabled={creating}
          onClick={handleCreateWeek}
          className="rounded-md bg-neutral-900 text-white text-sm px-4 py-2 disabled:opacity-50"
        >
          Tạo tuần đăng ký mới
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-neutral-500">
          Tuần {week.week_start} — {week.week_end} · Hạn đăng ký:{" "}
          {new Date(week.registration_deadline).toLocaleString("vi-VN")} · Trạng thái: {week.status}
        </p>
      </div>

      {errorMsg && <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{errorMsg}</div>}

      <section>
        <h2 className="text-base font-medium mb-3">Slot chuyên viên theo ca</h2>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {dates.map((date) => {
            const dow = new Date(date).getDay() === 0 ? 7 : new Date(date).getDay();
            const daySessions = sessions.filter((s) => s.day_of_week === dow || s.day_of_week === null);

            return (
              <div key={date} className="border rounded-lg p-3 space-y-2">
                <div className="text-sm font-medium">
                  {WEEKDAY_LABEL[dow]}
                  <div className="text-xs text-neutral-500">{date}</div>
                </div>
                {daySessions.map((s) => {
                  const key = `${s.id}_${date}`;
                  return (
                    <div key={s.id} className="text-xs space-y-1">
                      <div className="font-medium">
                        {s.name} ({s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)})
                      </div>
                      <input
                        type="number"
                        min={capacityValues[key] ?? 0}
                        defaultValue={capacityValues[key] ?? ""}
                        placeholder="Số slot"
                        disabled={isPending}
                        onBlur={(e) => handleCapacityBlur(s.id, date, e.target.value)}
                        className="w-full border rounded px-2 py-1 text-xs"
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-base font-medium mb-3">Ngưỡng tối thiểu cuối tuần (quản lý, lễ tân)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
          {weekendDates.map((date) => (
            <div key={date} className="border rounded-lg p-3 space-y-2">
              <div className="text-sm font-medium">
                {WEEKDAY_LABEL[new Date(date).getDay() === 0 ? 7 : new Date(date).getDay()]}
                <div className="text-xs text-neutral-500">{date}</div>
              </div>
              {thresholdRoles.map((role) => {
                const key = `${date}_${role.id}`;
                return (
                  <div key={role.id} className="flex items-center justify-between text-xs gap-2">
                    <span>{role.role_name}</span>
                    <input
                      type="number"
                      min={0}
                      defaultValue={requirementValues[key] ?? ""}
                      placeholder="Tối thiểu"
                      disabled={isPending}
                      onBlur={(e) => handleRequirementBlur(date, role.id, e.target.value)}
                      className="w-20 border rounded px-2 py-1 text-xs"
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}