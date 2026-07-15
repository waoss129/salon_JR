import { getEmployees, getRoles, getSchedules, getSessions } from "./actions";
import { ScheduleManager } from "@/components/admin/ScheduleManager";
import { requireView } from "@/lib/supabase/admin-guard";
import { createAdminAuthClient } from "@/lib/supabase/server";

function getCurrentWeekRange() {
  const now = new Date();
  const day = now.getDay() === 0 ? 7 : now.getDay(); // Thứ 2 = 1 ... CN = 7
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const toISODate = (d: Date) => d.toISOString().slice(0, 10);
  return { weekStart: toISODate(monday), weekEnd: toISODate(sunday) };
}

export default async function AdminSchedulePage() {
  await requireView("schedules");

  const supabase = await createAdminAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let viewerRoleId: number | null = null;
  let viewerEmployeeId: string | null = null;

  if (user) {
    const { data: employee } = await supabase
      .from("employees")
      .select("role_id")
      .eq("id", user.id)
      .single();
    viewerRoleId = employee?.role_id ?? null;
    viewerEmployeeId = user.id;
  }

  // Role 4 (Beautician): chỉ được xem đúng lịch của chính mình.
  const isSelfServiceOnly = viewerRoleId === 4;

  const { weekStart, weekEnd } = getCurrentWeekRange();

  const [sessions, roles, employees, schedules] = await Promise.all([
    getSessions(),
    getRoles(),
    getEmployees(),
    getSchedules({
      weekStart,
      weekEnd,
      onlyEmployeeId:
        isSelfServiceOnly && viewerEmployeeId ? viewerEmployeeId : undefined,
    }),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-medium mb-4">Lịch làm việc nhân viên</h1>
      <ScheduleManager
        initialSchedules={schedules}
        sessions={sessions}
        roles={roles}
        employees={employees}
        initialWeekStart={weekStart}
        initialWeekEnd={weekEnd}
        viewerRoleId={viewerRoleId}
        viewerEmployeeId={viewerEmployeeId}
      />
    </div>
  );
}
