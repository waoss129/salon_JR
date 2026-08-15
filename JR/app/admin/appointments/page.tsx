import { getAppointments } from "./actions";
import { AppointmentManager } from "@/components/admin/AppointmentManager";
import { requireView } from "@/lib/supabase/admin-guard";
import { createAdminAuthClient } from "@/lib/supabase/server";

function todayISODate() {
  // KHÔNG dùng new Date().toISOString() ở đây — nó quy đổi sang UTC, nên
  // vào khoảng 00:00–07:00 giờ VN (server chạy UTC) sẽ trả về NGÀY HÔM QUA
  // thay vì hôm nay. Lấy trực tiếp theo giờ Việt Nam.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requireView("appointments");

  const supabase = await createAdminAuthClient();
  const { data: { user } } = await supabase.auth.getUser();

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

  // Role 4 (Beautician): chỉ được xem lịch hẹn đang gán cho chính mình.
  const isSelfServiceOnly = viewerRoleId === 4;

  const params = await searchParams;
  const date = params.date || todayISODate();

  const appointments = await getAppointments({
    date,
    onlyEmployeeId: isSelfServiceOnly && viewerEmployeeId ? viewerEmployeeId : undefined,
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-medium mb-4">Quản lý lịch hẹn</h1>
      <AppointmentManager
        initialAppointments={appointments}
        initialDate={date}
        viewerRoleId={viewerRoleId}
        viewerEmployeeId={viewerEmployeeId}
        isSelfServiceOnly={isSelfServiceOnly}
      />
    </div>
  );
}