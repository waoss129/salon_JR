"use client";

import { useState, useTransition } from "react";
import {
  getScheduleStatistics,
  type CoverageGap,
  type WorkloadRow,
  type AbsenceRow,
  type DaysOffRow,
} from "@/app/admin/statistics/schedules/actions";
import { PrintButton } from "@/components/admin/PrintButton";

type StatsData = {
  gaps: CoverageGap[];
  workload: WorkloadRow[];
  absence: AbsenceRow[];
  daysOff: DaysOffRow[];
};

export function ScheduleStatsManager({
  initialData,
  initialStartDate,
  initialEndDate,
}: {
  initialData: StatsData;
  initialStartDate: string;
  initialEndDate: string;
}) {
  const [data, setData] = useState<StatsData>(initialData);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function refresh(nextStart: string, nextEnd: string) {
    setError("");
    startTransition(async () => {
      try {
        const result = await getScheduleStatistics({
          startDate: nextStart,
          endDate: nextEnd,
        });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không tải được dữ liệu");
      }
    });
  }

  function handleApply() {
    if (startDate > endDate) {
      setError("Ngày bắt đầu phải trước ngày kết thúc");
      return;
    }
    refresh(startDate, endDate);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-2 print:hidden">
        <div>
          <label className="text-xs font-medium block mb-1">Từ ngày</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Đến ngày</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={isPending}
          className="bg-black text-white rounded px-3 py-1.5 text-sm disabled:opacity-50"
        >
          {isPending ? "Đang tải..." : "Xem"}
        </button>
        <PrintButton className="ml-auto" />
      </div>

      {/* Chỉ hiện khi in, để biết đang xem đúng khoảng ngày nào trên giấy */}
      <p className="hidden print:block text-sm text-gray-500 -mt-4">
        Khoảng ngày: {startDate} — {endDate}
      </p>

      {error && <p className="text-sm text-red-600 print:hidden">{error}</p>}

      {/* 1. Ca trống */}
      <section>
        <h2 className="font-semibold mb-2">
          Ca trống người ({data.gaps.length})
        </h2>
        <table className="w-full text-sm border rounded overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Ngày</th>
              <th className="text-left p-2">Ca</th>
            </tr>
          </thead>
          <tbody>
            {data.gaps.length === 0 && (
              <tr>
                <td colSpan={2} className="p-3 text-center text-gray-400">
                  Không có ca nào bị trống trong khoảng đã chọn
                </td>
              </tr>
            )}
            {data.gaps.map((g, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{g.date}</td>
                <td className="p-2">{g.sessionName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 2. Khối lượng ca theo nhân viên */}
      <section>
        <h2 className="font-semibold mb-2">Khối lượng ca theo nhân viên</h2>
        <table className="w-full text-sm border rounded overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Nhân viên</th>
              <th className="text-left p-2">Số ca được xếp</th>
            </tr>
          </thead>
          <tbody>
            {data.workload.length === 0 && (
              <tr>
                <td colSpan={2} className="p-3 text-center text-gray-400">
                  Chưa có ca nào trong khoảng đã chọn
                </td>
              </tr>
            )}
            {data.workload.map((w) => (
              <tr key={w.employeeId} className="border-t">
                <td className="p-2">{w.fullname}</td>
                <td className="p-2">{w.shiftCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 3. Tỷ lệ vắng mặt */}
      <section>
        <h2 className="font-semibold mb-2">Tỷ lệ vắng mặt theo nhân viên</h2>
        <table className="w-full text-sm border rounded overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Nhân viên</th>
              <th className="text-left p-2">Vắng / Tổng ca</th>
              <th className="text-left p-2">Tỷ lệ</th>
            </tr>
          </thead>
          <tbody>
            {data.absence.length === 0 && (
              <tr>
                <td colSpan={3} className="p-3 text-center text-gray-400">
                  Chưa có dữ liệu trong khoảng đã chọn
                </td>
              </tr>
            )}
            {data.absence.map((a) => (
              <tr key={a.employeeId} className="border-t">
                <td className="p-2">{a.fullname}</td>
                <td className="p-2">
                  {a.absentCount} / {a.totalCount}
                </td>
                <td className="p-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      a.rate >= 20
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {a.rate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 4. Số ngày nghỉ (tham khảo — số tiền bị trừ thật xem ở trang Lương) */}
      <section>
        <h2 className="font-semibold mb-2">
          Số ngày nghỉ theo nhân viên (trong khoảng đã chọn)
        </h2>
        <p className="text-xs text-gray-400 mb-2">
          Gồm cả ngày chưa xếp lịch lẫn ngày có xếp nhưng không hoàn thành ca.
          Hạn mức 4 ngày/tháng và số tiền bị trừ (nếu có) xem chi tiết ở trang
          Thống kê lương.
        </p>
        <table className="w-full text-sm border rounded overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Nhân viên</th>
              <th className="text-left p-2">Số ngày nghỉ</th>
            </tr>
          </thead>
          <tbody>
            {data.daysOff.length === 0 && (
              <tr>
                <td colSpan={2} className="p-3 text-center text-gray-400">
                  Chưa có dữ liệu trong khoảng đã chọn
                </td>
              </tr>
            )}
            {data.daysOff.map((d) => (
              <tr key={d.employeeId} className="border-t">
                <td className="p-2">{d.fullname}</td>
                <td className="p-2">{d.daysOff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
