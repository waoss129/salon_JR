import { getActiveOrLatestWeek, getWeekSetup } from "./actions";
import { getSessions, getRoles } from "@/app/admin/schedules/actions";
import SetupBoard from "@/components/admin/SetupBoard";

export default async function ScheduleSetupPage() {
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