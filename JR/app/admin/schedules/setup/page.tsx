import { getActiveOrLatestWeek, getWeekSetup } from "./actions";
import { getSessions, getRoles } from "@/app/admin/schedules/actions";
import SetupBoard from "@/components/admin/SetupBoard";
import { requireManage } from "@/lib/supabase/admin-guard";

export default async function ScheduleSetupPage() {
  // Trang thiết lập ca (mở tuần mới, chỉnh slot/ngưỡng tối thiểu) là công
  // cụ quản lý -> chỉ role 1, 2, 3 được vào, khớp requireScheduleManager()
  // trong setup/actions.ts. Trước đây trang này không có dòng chặn nào.
  await requireManage("schedules");

  const week = await getActiveOrLatestWeek();
  const [sessions, roles] = await Promise.all([getSessions(), getRoles()]);
  const setup = week ? await getWeekSetup(week.id) : { capacity: [], requirements: [], capacityStatus: [] };

  return (
    <div className="p-6">
      <h1 className="text-xl font-medium mb-4">Thiết lập ca làm việc</h1>
      <SetupBoard
        week={week}
        sessions={sessions}
        roles={roles}
        capacity={setup.capacity}
        requirements={setup.requirements}
        capacityStatus={setup.capacityStatus}
      />
    </div>
  );
}