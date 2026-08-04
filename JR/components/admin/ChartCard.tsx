"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { MonthlyPoint } from "@/app/admin/statistics/overview/monthly";

type FetchFn = (year: number) => Promise<MonthlyPoint[]>;

// Dùng "chuỗi định danh" thay vì truyền thẳng hàm formatValue — vì Server
// Component (page.tsx) không được phép truyền hàm JS thường xuống Client
// Component (ChartCard này) qua props, chỉ truyền được dữ liệu serialize
// được (string, number, object thường...). ChartCard tự tra cứu cách format
// dựa theo chuỗi này, không cần nhận hàm từ bên ngoài nữa.
type ValueFormat = "million" | "hours" | "count";

function formatByType(value: number, format: ValueFormat): string {
  switch (format) {
    case "million":
      return `${value}M`;
    case "hours":
      return `${value}h`;
    case "count":
      return `${value} ca`;
  }
}

export function ChartCard({
  cardId,
  title,
  initialPoints,
  initialYear,
  fetchData,
  valueFormat,
  detailHref,
  // 🎨 MÀU CỘT — đổi ở đây (mã hex hoặc tên màu CSS bất kỳ, VD "#22c55e", "steelblue"...)
  barColor = "#60a5fa",
}: {
  cardId: string;
  title: string;
  initialPoints: MonthlyPoint[];
  initialYear: number;
  fetchData: FetchFn;
  valueFormat: ValueFormat;
  detailHref: string;
  barColor?: string;
}) {
  const [points, setPoints] = useState(initialPoints);
  const [year, setYear] = useState(initialYear);
  const [isPending, startTransition] = useTransition();
  const cardRef = useRef<HTMLDivElement>(null);

  function handleYearChange(nextYear: number) {
    setYear(nextYear);
    startTransition(async () => {
      const data = await fetchData(nextYear);
      setPoints(data);
    });
  }

  // In CHỈ đúng card này: ẩn mọi card khác + tiêu đề/thẻ tổng quan bằng JS
  // (thêm class .hidden-for-print), gọi window.print(), rồi tự khôi phục lại
  // ngay sau khi hộp thoại in đóng (sự kiện "afterprint") — không dùng CSS
  // @media print thông thường vì nó luôn hiện MỌI phần tử không có
  // print:hidden, không phân biệt được "card nào đang được bấm in".
  function handlePrintOnly() {
    document.querySelectorAll("[data-chart-card]").forEach((el) => {
      if (el !== cardRef.current) el.classList.add("hidden-for-print");
    });
    document.querySelectorAll("[data-print-hide-group]").forEach((el) => {
      el.classList.add("hidden-for-print");
    });

    function restore() {
      document.querySelectorAll(".hidden-for-print").forEach((el) => {
        el.classList.remove("hidden-for-print");
      });
      window.removeEventListener("afterprint", restore);
    }
    window.addEventListener("afterprint", restore);

    requestAnimationFrame(() => window.print());
  }

  const yearOptions = Array.from({ length: 5 }, (_, i) => initialYear - 3 + i);

  return (
    <div
      ref={cardRef}
      data-chart-card
      className="rounded-lg border border-gray-200 bg-white p-6"
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-gray-700">
          {title} ({year})
        </h3>
        <div className="flex items-center gap-2 print:hidden">
          <select
            value={year}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-xs"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                Năm {y}
              </option>
            ))}
          </select>
          <Link
            href={detailHref}
            className="text-xs text-violet-600 hover:underline"
          >
            Xem chi tiết
          </Link>
          <button
            onClick={handlePrintOnly}
            className="border rounded px-2 py-1 text-xs"
          >
            In
          </button>
        </div>
      </div>

      <div style={{ width: "100%", height: 220, opacity: isPending ? 0.4 : 1 }}>
        <ResponsiveContainer>
          <BarChart data={points}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value: number) => formatByType(value, valueFormat)}
            />
            <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
