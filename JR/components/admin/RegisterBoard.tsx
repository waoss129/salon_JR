"use client";

import { useMemo, useState, useTransition } from "react";
import { registerShift, cancelShift } from "@/app/admin/schedules/register/actions";

type Session = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  shift_type: "SA" | "CH" | null;
  day_of_week: number | null;
};

type CapacityStatus = {
  session_id: number;
  date: string;
  slot_target: number;
  current_count: number;
  slots_remaining: number;
};

type MyRegistration = {
  id: string;
  session_id: number;
  date: string;
  status: string;
};

type Props = {
  week: { id: string; week_start: string; week_end: string; registration_deadline: string };
  sessions: Session[];
  capacityStatus: CapacityStatus[];
  myRegistrations: MyRegistration[];
  isSlotCapped: boolean;
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

export default function RegisterBoard({ week, sessions, capacityStatus, myRegistrations, isSlotCapped }: Props) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const dates = useMemo(() => getWeekDates(week.week_start), [week.week_start]);
  const deadlinePassed = new Date(week.registration_deadline) < new Date();

  const capacityMap = useMemo(() => {
    const m = new Map<string, CapacityStatus>();
    capacityStatus.forEach((c) => m.set(`${c.session_id}_${c.date}`, c));
    return m;
  }, [capacityStatus]);

  const myRegMap = useMemo(() => {
    const m = new Map<string, MyRegistration>();
    myRegistrations.forEach((r) => m.set(`${r.session_id}_${r.date}`, r));
    return m;
  }, [myRegistrations]);

  const weekdayCount = myRegistrations.filter((r) => !isWeekend(r.date)).length;
  const weekendCount = myRegistrations.filter((r) => isWeekend(r.date)).length;

  function handleRegister(sessionId: number, date: string) {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await registerShift({ weekId: week.id, sessionId, date });
      } catch (err: any) {
        const code = err?.message ?? "";
        if (code.includes("SLOT_FULL")) setErrorMsg("Ca này vừa đầy, vui lòng chọn ca khác.");
        else if (code.includes("DEADLINE_PASSED")) setErrorMsg("Đã quá hạn đăng ký.");
        else setErrorMsg("Có lỗi xảy ra, vui lòng thử lại.");
      }
    });
  }

  function handleCancel(registrationId: string) {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await cancelShift(registrationId);
      } catch {
        setErrorMsg("Không thể hủy đăng ký, vui lòng thử lại.");
      }
    });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium">Đăng ký lịch làm việc</h1>
          <p className="text-sm text-neutral-500">
            Tuần {week.week_start} — {week.week_end} · Hạn đăng ký:{" "}
            {new Date(week.registration_deadline).toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="text-sm text-right">
          <div>Ngày thường: {weekdayCount}/4</div>
          <div>Cuối tuần: {weekendCount}/1</div>
        </div>
      </div>

      {deadlinePassed && (
        <div className="rounded-md bg-neutral-100 px-4 py-2 text-sm text-neutral-600">
          Đã hết hạn đăng ký cho tuần này. Các ca chưa chọn sẽ được admin sắp xếp.
        </div>
      )}
      {errorMsg && <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{errorMsg}</div>}

      {/* Khóa TOÀN BỘ lưới trong lúc đang xử lý 1 request (không chỉ ô đang bấm) —
          tránh bấm chồng 2 ca gần nhau khi request trước chưa kịp cập nhật UI,
          nguyên nhân gây lỗi "duplicate key" trước đó. */}
      <div className={`grid grid-cols-1 md:grid-cols-7 gap-3 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
        {dates.map((date) => {
          const dow = new Date(date).getDay() === 0 ? 7 : new Date(date).getDay();
          const daySessions = sessions.filter((s) => s.day_of_week === dow || s.day_of_week === null);
          const weekend = isWeekend(date);
          const shiftIsCapped = isSlotCapped && !weekend;

          return (
            <div key={date} className="border rounded-lg p-3 space-y-2">
              <div className="text-sm font-medium">
                {WEEKDAY_LABEL[dow]}
                <div className="text-xs text-neutral-500">{date}</div>
                {isSlotCapped && weekend && <div className="text-xs text-emerald-600 font-normal">Tự do đăng ký</div>}
              </div>

              {daySessions.map((s) => {
                const key = `${s.id}_${date}`;
                const cap = capacityMap.get(key);
                const myReg = myRegMap.get(key);
                const isFull = shiftIsCapped && cap && cap.slots_remaining <= 0 && !myReg;

                if (isFull) return null;

                return (
                  <button
                    key={s.id}
                    disabled={isPending || deadlinePassed}
                    onClick={() => (myReg ? handleCancel(myReg.id) : handleRegister(s.id, date))}
                    className={`w-full text-left text-xs rounded-md border px-2 py-1.5 transition
                      ${myReg ? "bg-neutral-900 text-white border-neutral-900" : "bg-white hover:bg-neutral-50"}
                      ${isPending || deadlinePassed ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="font-medium">{s.name}</div>
                    <div className="opacity-70">
                      {s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)}
                    </div>
                    {shiftIsCapped && cap && (
                      <div className="opacity-70">
                        {cap.current_count}/{cap.slot_target} đã đăng ký
                      </div>
                    )}
                    {myReg && <div className="mt-1">Đã chọn · bấm để hủy</div>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}