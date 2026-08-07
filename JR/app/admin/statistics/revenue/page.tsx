import { requireView } from "@/lib/supabase/admin-guard";
import StatisticsFilters from "@/components/admin/StatisticsFilters";
import { PrintButton } from "@/components/admin/PrintButton";
import { getStatisticsSummary, getTopServices } from "./queries";

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

function firstDayOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default async function RevenueStatisticsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  await requireView("statistics");

  const params = await searchParams;
  const defaultFrom = firstDayOfMonth();
  const defaultTo = todayStr();
  const from = params.from ?? defaultFrom;
  const to = params.to ?? defaultTo;

  const [summary, topServices] = await Promise.all([
    getStatisticsSummary(from, to),
    getTopServices(from, to, 5),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Thống kê doanh thu
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Số liệu trong khoảng {from} — {to}
          </p>
        </div>
        <PrintButton />
      </div>

      <div className="print:hidden">
        <StatisticsFilters defaultFrom={defaultFrom} defaultTo={defaultTo} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard
          label="Tổng doanh thu"
          value={formatCurrency(summary.totalRevenue)}
        />
        <StatCard
          label="Số hóa đơn đã tạo"
          value={summary.totalBillsCreated.toString()}
        />
        <StatCard
          label="Giá trị TB / hóa đơn"
          value={formatCurrency(summary.avgPerPaidBill)}
        />
        <StatCard
          label="Lịch hẹn hoàn thành"
          value={summary.completedAppointments.toString()}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">
          Top 5 dịch vụ bán chạy
        </h2>
        {topServices.length === 0 ? (
          <p className="text-sm text-gray-400">
            Chưa có dữ liệu trong khoảng thời gian này.
          </p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="py-2 pr-4 font-medium">Dịch vụ</th>
                <th className="py-2 pr-4 font-medium">Loại dịch vụ</th>
                <th className="py-2 pr-4 text-center font-medium">Số lượt</th>
                <th className="py-2 text-right font-medium">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {topServices.map((s) => (
                <tr
                  key={`${s.serviceName}-${s.categoryName}`}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="py-2 pr-4">{s.serviceName}</td>
                  <td className="py-2 pr-4 text-gray-500">{s.categoryName}</td>
                  <td className="py-2 pr-4 text-center">{s.quantitySold}</td>
                  <td className="py-2 text-right">
                    {formatCurrency(s.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}