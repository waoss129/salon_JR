"use client";

import { useState, useTransition } from "react";
import {
  assignEmployeeToShift,
  confirmWeekSchedule,
  type EmployeeRegSummary,
  type ShiftCapacityRow,
  type RoleDayRow,
} from "@/app/admin/schedules/review/actions";

type Week = {
  id: string;
  week_start: string;
  week_end: string;
  registration_deadline: string;
  status: "open_for_registration" | "admin_review" | "confirmed";
};

type Data = {
  byRole: {
    quanLy: EmployeeRegSummary[];
    chuyenVien: EmployeeRegSummary[];
    leTan: EmployeeRegSummary[];
  };
  unassignedEmployees: EmployeeRegSummary[];
  understaffedShifts: ShiftCapacityRow[];
  roleDayStatus: RoleDayRow[];
};

function EmployeeRow({ e, roleDayForThisRole }: { e: EmployeeRegSummary; roleDayForThisRole?: RoleDayRow[] }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 text-sm border-b last:border-b-0">
      <span>{e.fullname}</span>
      <span className={e.meetsMinimum ? "text-emerald-600" : "text-amber-600"}>
        {e.weekdayCount} ngày thường · {e.weekendCount} cuối tuần
        {!e.meetsMinimum && " · chưa đủ"}
      </span>
    </div>
  );
}

export default function ReviewBoard({ week, data }: { week: Week; data: Data }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [draggingEmployeeId, setDraggingEmployeeId] = useState<string | null>(null);

  const isConfirmed = week.status === "confirmed";

  function handleDrop(shift: ShiftCapacityRow, employeeId: string) {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await assignEmployeeToShift({
          weekId: week.id,
          employeeId,
          sessionId: shift.sessionId,
          date: shift.date,
        });
      } catch (err: any) {
        setErrorMsg(err?.message ?? "Không thể ghép ca này.");
      }
    });
  }

  function handleConfirm() {
    setErrorMsg(null);
    setSuccessMsg(null);
    startTransition(async () => {
      try {
        const result = await confirmWeekSchedule(week.id);
        setSuccessMsg(`Đã chốt lịch. Gửi mail thành công ${result.sentCount}, thất bại ${result.failedCount}.`);
      } catch (err: any) {
        setErrorMsg(err?.message ?? "Không thể chốt lịch.");
      }
    });
  }

  const roleDayFor = (roleId: number) => data.roleDayStatus.filter((r) => r.roleId === roleId);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium">Duyệt lịch đăng ký</h1>
          <p className="text-sm text-neutral-500">
            Tuần {week.week_start} — {week.week_end} · Hạn đăng ký:{" "}
            {new Date(week.registration_deadline).toLocaleString("vi-VN")} · Trạng thái: {week.status}
          </p>
        </div>
        <button
          disabled={isPending || isConfirmed}
          onClick={handleConfirm}
          className="rounded-md bg-neutral-900 text-white text-sm px-4 py-2 disabled:opacity-50"
        >
          {isConfirmed ? "Đã chốt" : "Chốt lịch & gửi email"}
        </button>
      </div>

      {errorMsg && <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{errorMsg}</div>}
      {successMsg && <div className="rounded-md bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{successMsg}</div>}

      <section>
        <h2 className="text-sm font-medium mb-2">Quản lý</h2>
        <div className="border rounded-lg">
          {data.byRole.quanLy.length === 0 && (
            <div className="px-3 py-2 text-sm text-neutral-400">Chưa có ai đăng ký.</div>
          )}
          {data.byRole.quanLy.map((e) => (
            <EmployeeRow key={e.employeeId} e={e} />
          ))}
          {roleDayFor(data.byRole.quanLy[0]?.roleId ?? 3).map((r) => (
            <div
              key={`${r.date}_${r.roleId}`}
              className={`px-3 py-1.5 text-xs border-t ${r.currentCount < r.minCount ? "text-red-600 bg-red-50" : "text-emerald-600"}`}
            >
              {r.date}: {r.currentCount}/{r.minCount} tối thiểu
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium mb-2">Chuyên viên</h2>
        <div className="border rounded-lg">
          {data.byRole.chuyenVien.map((e) => (
            <EmployeeRow key={e.employeeId} e={e} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium mb-2">Lễ tân</h2>
        <div className="border rounded-lg">
          {data.byRole.leTan.length === 0 && (
            <div className="px-3 py-2 text-sm text-neutral-400">Chưa có ai đăng ký.</div>
          )}
          {data.byRole.leTan.map((e) => (
            <EmployeeRow key={e.employeeId} e={e} />
          ))}
          {roleDayFor(data.byRole.leTan[0]?.roleId ?? 5).map((r) => (
            <div
              key={`${r.date}_${r.roleId}`}
              className={`px-3 py-1.5 text-xs border-t ${r.currentCount < r.minCount ? "text-red-600 bg-red-50" : "text-emerald-600"}`}
            >
              {r.date}: {r.currentCount}/{r.minCount} tối thiểu
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium mb-2">Ghép ca còn thiếu</h2>
        <p className="text-xs text-neutral-500 mb-2">Kéo tên nhân viên bên trái, thả vào ca bên phải.</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg">
            <div className="px-3 py-1.5 text-xs font-medium bg-neutral-50 border-b">Chưa đủ chỉ tiêu</div>
            {data.unassignedEmployees.length === 0 && (
              <div className="px-3 py-2 text-sm text-neutral-400">Không có ai.</div>
            )}
            {data.unassignedEmployees.map((e) => (
              <div
                key={e.employeeId}
                draggable
                onDragStart={() => setDraggingEmployeeId(e.employeeId)}
                className="px-3 py-2 text-sm border-b last:border-b-0 cursor-grab bg-white hover:bg-neutral-50"
              >
                {e.fullname} · {e.roleName}
              </div>
            ))}
          </div>

          <div className="border rounded-lg">
            <div className="px-3 py-1.5 text-xs font-medium bg-neutral-50 border-b">Ca còn trống</div>
            {data.understaffedShifts.length === 0 && (
              <div className="px-3 py-2 text-sm text-neutral-400">Không có ca nào thiếu.</div>
            )}
            {data.understaffedShifts.map((s) => (
              <div
                key={`${s.sessionId}_${s.date}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => draggingEmployeeId && handleDrop(s, draggingEmployeeId)}
                className="px-3 py-2 text-sm border-b last:border-b-0 bg-white"
              >
                {s.sessionName} · {s.date} · {s.currentCount}/{s.slotTarget}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}