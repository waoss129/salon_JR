import { requireView } from "@/lib/supabase/admin-guard";
import { getScheduleStatistics } from "./actions";
import { ScheduleStatsManager } from "@/components/admin/ScheduleStatsManager";

function getCurrentWeekRange() {
  const now = new Date();
  const day = now.getDay() === 0 ? 7 : now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const toISODate = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: toISODate(monday), endDate: toISODate(sunday) };
}

export default async function ScheduleStatisticsPage() {
  await requireView("statistics");

  const { startDate, endDate } = getCurrentWeekRange();
  const initialData = await getScheduleStatistics({ startDate, endDate });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Thống kê lịch làm việc</h1>
      <ScheduleStatsManager
        initialData={initialData}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />
    </div>
  );
}
