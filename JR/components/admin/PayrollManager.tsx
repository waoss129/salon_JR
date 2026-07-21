"use client";

import { useEffect, useState, useTransition } from "react";
import { getPayrollStatistics, type PayrollRow } from "@/app/admin/statistics/payroll/actions";

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

export function PayrollManager({
  initialData,
  initialYear,
  initialMonth,
}: {
  initialData: PayrollRow[];
  initialYear: number;
  initialMonth: number;
}) {
  const [data, setData] = useState<PayrollRow[]>(initialData);
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  // null = đang in bảng tổng; có giá trị = đang in phiếu lương riêng của 1 người
  const [printTarget, setPrintTarget] = useState<PayrollRow | null>(null);

  function refresh(nextYear: number, nextMonth: number) {
    setError("");
    startTransition(async () => {
      try {
        const result = await getPayrollStatistics({ year: nextYear, month: nextMonth });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không tải được dữ liệu");
      }
    });
  }

  // Đợi DOM cập nhật xong (đã ẩn bảng tổng / hiện phiếu riêng) rồi mới mở hộp thoại in
  useEffect(() => {
    if (printTarget) {
      const id = requestAnimationFrame(() => window.print());
      return () => cancelAnimationFrame(id);
    }
  }, [printTarget]);

  // In xong (hoặc bấm Huỷ) thì tự quay lại chế độ xem bình thường
  useEffect(() => {
    function handleAfterPrint() {
      setPrintTarget(null);
    }
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  function handlePrintAll() {
    setPrintTarget(null);
    // Đợi 1 tick để đảm bảo phiếu riêng (nếu đang hiện) đã ẩn đi trước khi in
    requestAnimationFrame(() => window.print());
  }

  const totalPayAll = data.reduce((sum, row) => sum + row.totalPay, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-2 print:hidden">
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
        <button
          onClick={handlePrintAll}
          className="border rounded px-3 py-1.5 text-sm ml-auto"
        >
          🖨️ In tất cả
        </button>
      </div>

      <p className="hidden print:block text-sm text-gray-500 -mt-2">
        {printTarget ? `Phiếu lương — ${printTarget.fullname}` : "Bảng lương"} tháng {month}/{year}
      </p>

      {error && <p className="text-sm text-red-600 print:hidden">{error}</p>}

      {/* Bảng tổng — luôn hiện trên màn hình; khi in, TỰ ẨN nếu đang in phiếu
          riêng của 1 người (printTarget khác null) */}
      <table
        className={`w-full text-sm border rounded overflow-hidden ${
          printTarget ? "print:hidden" : ""
        }`}
      >
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2">Nhân viên</th>
            <th className="text-left p-2">Lương cứng</th>
            <th className="text-left p-2">Ngày nghỉ</th>
            <th className="text-left p-2">Bị trừ</th>
            <th className="text-left p-2">Cuối tuần đi làm</th>
            <th className="text-left p-2">Thưởng cuối tuần</th>
            <th className="text-left p-2">Thực nhận</th>
            <th className="text-left p-2 print:hidden">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {isPending && (
            <tr>
              <td colSpan={8} className="p-3 text-center text-gray-400">
                Đang tải...
              </td>
            </tr>
          )}
          {!isPending && data.length === 0 && (
            <tr>
              <td colSpan={8} className="p-3 text-center text-gray-400">
                Chưa có nhân viên nào để tính lương
              </td>
            </tr>
          )}
          {!isPending &&
            data.map((row) => (
              <tr key={row.employeeId} className="border-t">
                <td className="p-2">{row.fullname}</td>
                <td className="p-2">{formatCurrency(row.baseSalary)}</td>
                <td className="p-2">
                  {row.daysOff}
                  {row.deductibleDaysOff > 0 && (
                    <span className="text-xs text-red-500 ml-1">
                      (vượt {row.deductibleDaysOff})
                    </span>
                  )}
                </td>
                <td className="p-2">
                  {row.deduction > 0 ? (
                    <span className="text-red-600">−{formatCurrency(row.deduction)}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="p-2">{row.weekendDaysWorked} ngày</td>
                <td className="p-2">
                  {row.weekendBonus > 0 ? (
                    <span className="text-green-600">+{formatCurrency(row.weekendBonus)}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="p-2 font-semibold">{formatCurrency(row.totalPay)}</td>
                <td className="p-2 print:hidden">
                  <button
                    onClick={() => setPrintTarget(row)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    🖨️ In
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
        {!isPending && data.length > 0 && (
          <tfoot>
            <tr className="border-t bg-gray-50 font-medium">
              <td className="p-2" colSpan={6}>
                Tổng chi lương tháng này
              </td>
              <td className="p-2">{formatCurrency(totalPayAll)}</td>
              <td className="p-2 print:hidden"></td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* Phiếu lương riêng — ẩn trên màn hình, CHỈ hiện khi in và đang chọn in 1 người */}
      {printTarget && (
        <div className="hidden print:block max-w-md border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-1">JoyRide — Phiếu lương</h2>
          <p className="text-sm text-gray-500 mb-4">Tháng {month}/{year}</p>

          <table className="w-full text-sm">
            <tbody>
              <tr className="border-t">
                <td className="py-1.5 text-gray-500">Nhân viên</td>
                <td className="py-1.5 text-right font-medium">{printTarget.fullname}</td>
              </tr>
              <tr className="border-t">
                <td className="py-1.5 text-gray-500">Lương cứng</td>
                <td className="py-1.5 text-right">{formatCurrency(printTarget.baseSalary)}</td>
              </tr>
              <tr className="border-t">
                <td className="py-1.5 text-gray-500">Số ngày nghỉ trong tháng</td>
                <td className="py-1.5 text-right">
                  {printTarget.daysOff}
                  {printTarget.deductibleDaysOff > 0 && ` (vượt ${printTarget.deductibleDaysOff})`}
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-1.5 text-gray-500">Bị trừ do nghỉ vượt mức</td>
                <td className="py-1.5 text-right">
                  {printTarget.deduction > 0 ? `−${formatCurrency(printTarget.deduction)}` : "—"}
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-1.5 text-gray-500">Số ngày cuối tuần đã làm</td>
                <td className="py-1.5 text-right">{printTarget.weekendDaysWorked} ngày</td>
              </tr>
              <tr className="border-t">
                <td className="py-1.5 text-gray-500">Thưởng cuối tuần (x2)</td>
                <td className="py-1.5 text-right">
                  {printTarget.weekendBonus > 0 ? `+${formatCurrency(printTarget.weekendBonus)}` : "—"}
                </td>
              </tr>
              <tr className="border-t-2 border-black">
                <td className="py-2 font-bold">Thực nhận</td>
                <td className="py-2 text-right font-bold text-lg">
                  {formatCurrency(printTarget.totalPay)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-400 print:hidden">
        Giá 1 ngày thường = Lương cứng ÷ số ngày T2-T6 trong tháng. Mỗi tháng được nghỉ miễn phí 4
        ngày T2-T6 (không dồn được sang tháng sau); nghỉ vượt mức bị trừ theo giá 1 ngày thường.
        Mỗi ngày Thứ 7/Chủ nhật có ca hoàn thành được thưởng x2 giá 1 ngày thường. Chưa gồm làm
        thêm giờ (OT) và ngày lễ.
      </p>
    </div>
  );
}