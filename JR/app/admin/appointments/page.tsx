import { getAppointments } from "./actions";
import { AppointmentManager } from "@/components/admin/AppointmentManager";
import { requireView } from "@/lib/supabase/admin-guard";

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const date = params.date || todayISODate();
  const appointments = await getAppointments({ date });

  return (
    <div className="p-6">
      <h1 className="text-xl font-medium mb-4">Quản lý lịch hẹn</h1>
      <AppointmentManager
        initialAppointments={appointments}
        initialDate={date}
      />
    </div>
  );
}
