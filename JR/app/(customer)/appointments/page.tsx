import { getMyAppointments } from "./actions";
import { AppointmentHistory } from "@/components/customer/AppointmentHistory";

export default async function AppointmentsPage() {
  const appointments = await getMyAppointments();
  return <AppointmentHistory initialAppointments={appointments} />;
}
