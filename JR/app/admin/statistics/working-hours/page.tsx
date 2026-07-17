import { requireView } from "@/lib/supabase/admin-guard";
import { getWorkingHoursStatistics } from "./actions";
import { WorkingHoursManager } from "@/components/admin/WorkingHoursManager";

export default async function WorkingHoursStatisticsPage() {
  await requireView("statistics");

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const initialData = await getWorkingHoursStatistics({ year, month });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Thống kê thời gian làm việc</h1>
      <p className="text-sm text-gray-500 mb-4">
        Chỉ tính các ca đã hoàn thành (check-in và check-out xong) — dùng để
        tham khảo tính lương, không tự động ra số tiền.
      </p>
      <WorkingHoursManager
        initialData={initialData}
        initialYear={year}
        initialMonth={month}
      />
    </div>
  );
}
