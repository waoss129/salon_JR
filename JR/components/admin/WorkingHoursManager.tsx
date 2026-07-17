"use client";

import { useState, useTransition } from "react";
import {
  getWorkingHoursStatistics,
  type WorkingHoursRow,
} from "@/app/admin/statistics/working-hours/actions";

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

export function WorkingHoursManager({
  initialData,
  initialYear,
  initialMonth,
}: {
  initialData: WorkingHoursRow[];
  initialYear: number;
  initialMonth: number;
}) {
  const [data, setData] = useState<WorkingHoursRow[]>(initialData);
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function refresh(nextYear: number, nextMonth: number) {
    setError("");
    startTransition(async () => {
      try {
        const result = await getWorkingHoursStatistics({
          year: nextYear,
          month: nextMonth,
        });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không tải được dữ liệu");
      }
    });
  }

  const totalHoursAll = data.reduce((sum, row) => sum + row.totalHours, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <label className="text-xs font-medium block mb-1">Tháng</label>
          <select
            value={month}
            onChange={(e) => {
              const value = Number(e.target.value);
              setMonth(value);
              refresh(year, value);
            }}
            className="border rounded px-2 py-1.5 text-sm"
          >
            {MONTH_OPTIONS.map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Năm</label>
          <input
            type="number"
            value={year}
            onChange={(e) => {
              const value = Number(e.target.value);
              setYear(value);
              refresh(value, month);
            }}
            className="border rounded px-2 py-1.5 text-sm w-24"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <table className="w-full text-sm border rounded overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2">Nhân viên</th>
            <th className="text-left p-2">Số ca hoàn thành</th>
            <th className="text-left p-2">Tổng giờ làm</th>
          </tr>
        </thead>
        <tbody>
          {isPending && (
            <tr>
              <td colSpan={3} className="p-3 text-center text-gray-400">
                Đang tải...
              </td>
            </tr>
          )}
          {!isPending && data.length === 0 && (
            <tr>
              <td colSpan={3} className="p-3 text-center text-gray-400">
                Chưa có ca nào hoàn thành trong tháng này
              </td>
            </tr>
          )}
          {!isPending &&
            data.map((row) => (
              <tr key={row.employeeId} className="border-t">
                <td className="p-2">{row.fullname}</td>
                <td className="p-2">{row.completedShifts}</td>
                <td className="p-2">{row.totalHours} giờ</td>
              </tr>
            ))}
        </tbody>
        {!isPending && data.length > 0 && (
          <tfoot>
            <tr className="border-t bg-gray-50 font-medium">
              <td className="p-2" colSpan={2}>
                Tổng cộng
              </td>
              <td className="p-2">{Math.round(totalHoursAll * 10) / 10} giờ</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
