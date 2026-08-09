"use client";

import { useState, useTransition } from "react";
import {
  assignEmployeeToShift,
  confirmWeekSchedule,
  type EmployeeRegSummary,
  type DropTargetShift,
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
  byRole: { quanLy: EmployeeRegSummary[]; chuyenVien: EmployeeRegSummary[]; leTan: EmployeeRegSummary[] };
  unassignedEmployees: EmployeeRegSummary[];
  dropTargets: DropTargetShift[];
  roleDayStatus: RoleDayRow[];
};

function EmployeeRow({ e }: { e: EmployeeRegSummary }) {
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

// Danh sách nhân viên theo vai trò, thu gọn dạng <details> — tránh trang dài
// vô hạn khi có hàng trăm nhân viên. Tiêu đề luôn hiện sẵn số liệu tóm tắt
// (tổng số người + số người "chưa đủ") để admin không cần mở ra mới biết.
function RoleSection({
  title,
  employees,
  roleDayRows,
  defaultOpen,
}: {
  title: string;
  employees: EmployeeRegSummary[];
  roleDayRows: RoleDayRow[];
  defaultOpen: boolean;
}) {
  const shortCount = employees.filter((e) => !e.meetsMinimum).length;
  return (
    <details open={defaultOpen} className="border rounded-lg [&_summary]:list-none">
      <summary className="flex items-center justify-between px-3 py-2 text-sm font-medium cursor-pointer select-none">
        <span>
          {title} <span className="text-neutral-400 font-normal">({employees.length} người)</span>
        </span>
        <span className="flex items-center gap-2">
          {shortCount > 0 && <span className="text-amber-600 text-xs">{shortCount} chưa đủ</span>}
          <span className="text-neutral-400 text-xs">▾</span>
        </span>
      </summary>
      <div className="border-t">
        {employees.length === 0 && <div className="px-3 py-2 text-sm text-neutral-400">Chưa có ai đăng ký.</div>}
        {employees.map((e) => (
          <EmployeeRow key={e.employeeId} e={e} />
        ))}
        {roleDayRows.map((r) => (
          <div
            key={`${r.date}_${r.roleId}`}
            className={`px-3 py-1.5 text-xs border-t ${r.currentCount < r.minCount ? "text-red-600 bg-red-50" : "text-emerald-600"}`}
          >
            {r.date}: {r.currentCount}/{r.minCount} tối thiểu
          </div>
        ))}
      </div>
    </details>
  );
}

export default function ReviewBoard({ week, data }: { week: Week; data: Data }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [draggingEmployeeId, setDraggingEmployeeId] = useState<string | null>(null);

  const isConfirmed = week.status === "confirmed";

  function handleDrop(shift: DropTargetShift, employeeId: string) {
    if (isConfirmed) return; // khóa cứng phía UI — không gửi request nếu đã chốt
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await assignEmployeeToShift({ weekId: week.id, employeeId, sessionId: shift.sessionId, date: shift.date });
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
      {isConfirmed && (
        <div className="rounded-md bg-neutral-100 px-4 py-2 text-sm text-neutral-600">
          Tuần này đã chốt lịch và gửi mail — mọi thao tác kéo-thả bên dưới đã bị khóa, chỉ để xem lại.
        </div>
      )}

      <div className="space-y-3">
        <RoleSection title="Quản lý" employees={data.byRole.quanLy} roleDayRows={roleDayFor(3)} defaultOpen={data.byRole.quanLy.length <= 10} />
        <RoleSection title="Chuyên viên" employees={data.byRole.chuyenVien} roleDayRows={[]} defaultOpen={data.byRole.chuyenVien.length <= 10} />
        <RoleSection title="Lễ tân" employees={data.byRole.leTan} roleDayRows={roleDayFor(5)} defaultOpen={data.byRole.leTan.length <= 10} />
      </div>

      <section>
        <h2 className="text-sm font-medium mb-2">Ghép ca còn thiếu</h2>
        <p className="text-xs text-neutral-500 mb-2">
          {isConfirmed ? "Đã khóa — tuần này đã chốt lịch." : "Kéo tên nhân viên bên trái, thả vào ca bên phải."}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg">
            <div className="px-3 py-1.5 text-xs font-medium bg-neutral-50 border-b">Chưa đủ chỉ tiêu</div>
            {data.unassignedEmployees.length === 0 && <div className="px-3 py-2 text-sm text-neutral-400">Không có ai.</div>}
            {data.unassignedEmployees.map((e) => (
              <div
                key={e.employeeId}
                draggable={!isConfirmed}
                onDragStart={() => setDraggingEmployeeId(e.employeeId)}
                className={`px-3 py-2 text-sm border-b last:border-b-0 bg-white ${isConfirmed ? "opacity-50" : "cursor-grab hover:bg-neutral-50"}`}
              >
                {e.fullname} · {e.roleName}
              </div>
            ))}
          </div>

          <div className="border rounded-lg">
            <div className="px-3 py-1.5 text-xs font-medium bg-neutral-50 border-b">Ca còn trống</div>
            {data.dropTargets.length === 0 && <div className="px-3 py-2 text-sm text-neutral-400">Không có ca nào.</div>}
            {data.dropTargets.map((s) => (
              <div
                key={`${s.sessionId}_${s.date}`}
                onDragOver={(e) => !isConfirmed && e.preventDefault()}
                onDrop={() => !isConfirmed && draggingEmployeeId && handleDrop(s, draggingEmployeeId)}
                className={`px-3 py-2 text-sm border-b last:border-b-0 bg-white ${isConfirmed ? "opacity-50" : ""}`}
              >
                {s.sessionName} · {s.date} ·{" "}
                {s.slotTarget === null ? (
                  <span className="text-emerald-600">{s.currentCount} người · không giới hạn</span>
                ) : (
                  <span>{s.currentCount}/{s.slotTarget}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}