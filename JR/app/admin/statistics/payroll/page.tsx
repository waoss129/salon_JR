import { requireView } from "@/lib/supabase/admin-guard";
import { getPayrollStatistics } from "./actions";
import { PayrollManager } from "@/components/admin/PayrollManager";

export default async function PayrollStatisticsPage() {
  await requireView("payroll");

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const initialData = await getPayrollStatistics({ year, month });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Thống kê lương</h1>
      <p className="text-sm text-gray-500 mb-4">
        Lương cứng + thưởng ngày cuối tuần (x2 giá 1 ngày thường) cho mỗi ngày
        Thứ 7/Chủ nhật đã làm trong tháng. Chưa gồm làm thêm giờ (OT) và ngày
        lễ.
      </p>
      <PayrollManager
        initialData={initialData}
        initialYear={year}
        initialMonth={month}
      />
    </div>
  );
}
