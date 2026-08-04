import { requireView } from "@/lib/supabase/admin-guard";
import { canView } from "@/lib/supabase/permissions";
import { getStatisticsSummary } from "@/app/admin/statistics/revenue/queries";
import { getMonthlyRevenuePoints, getMonthlyTotalPayroll } from "./monthly";
import { ChartCard } from "@/components/admin/ChartCard";

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

export default async function CeoStatisticsOverviewPage() {
  const roleId = await requireView("statistics");
  const year = new Date().getFullYear();
  const showPayroll = canView(roleId, "payroll");
  const from = firstDayOfMonth();
  const to = todayStr();

  const [summary, monthlyRevenue, monthlyPayrollRaw] = await Promise.all([
    getStatisticsSummary(from, to),
    getMonthlyRevenuePoints(year),
    showPayroll ? getMonthlyTotalPayroll(year) : Promise.resolve([]),
  ]);

  // getMonthlyTotalPayroll() trả về VNĐ nguyên (chục triệu). ChartCard giờ
  // chỉ FORMAT hiển thị (thêm chữ "M"), không tự chia đơn vị như hàm cũ nữa
  // — nên phải chia sẵn ở đây trước khi đưa vào biểu đồ, để cột không bị
  // cao sai tỉ lệ so với Doanh thu (vốn getMonthlyRevenue() đã chia sẵn).
  const monthlyPayroll = monthlyPayrollRaw.map((p) => ({
    month: p.month,
    value: Math.round(p.value / 1_000_000),
  }));

  return (
    <div className="space-y-6">
      <h1 data-print-hide-group className="text-2xl font-bold">
        Thống Kê
      </h1>

      <div
        data-print-hide-group
        className="grid grid-cols-1 gap-4 md:grid-cols-4"
      >
        <StatCard
          label="Tổng doanh thu (tháng này)"
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ChartCard
          cardId="revenue"
          title="Thống kê doanh thu"
          initialPoints={monthlyRevenue}
          initialYear={year}
          fetchData={getMonthlyRevenuePoints}
          valueFormat="million"
          detailHref="/admin/statistics/revenue"
          barColor="#4ade80"
        />

        {/*
          TẠM ẨN theo yêu cầu — "Lịch làm việc" và "Thời gian làm việc" đang
          có số liệu nghi ngờ chưa đúng (VD hiện "1000 ca" bất thường ở
          hầu hết các tháng). Bật lại sau khi kiểm tra xong getMonthlyShiftsCompleted
          / getMonthlyTotalHours trong monthly.ts.

        <ChartCard
          cardId="schedules"
          title="Thống kê lịch làm việc"
          initialPoints={monthlyShifts}
          initialYear={year}
          fetchData={getMonthlyShiftsCompleted}
          valueFormat="count"
          detailHref="/admin/statistics/schedules"
          barColor="#60a5fa"
        />
        <ChartCard
          cardId="working-hours"
          title="Thống kê thời gian làm việc"
          initialPoints={monthlyHours}
          initialYear={year}
          fetchData={getMonthlyTotalHours}
          valueFormat="hours"
          detailHref="/admin/statistics/working-hours"
          barColor="#fbbf24"
        />
        */}

        {showPayroll && (
          <ChartCard
            cardId="payroll"
            title="Thống kê lương"
            initialPoints={monthlyPayroll}
            initialYear={year}
            fetchData={async (y: number) => {
              "use server";
              const rows = await getMonthlyTotalPayroll(y);
              return rows.map((p) => ({
                month: p.month,
                value: Math.round(p.value / 1_000_000),
              }));
            }}
            valueFormat="million"
            detailHref="/admin/statistics/payroll"
            barColor="#f472b6"
          />
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
