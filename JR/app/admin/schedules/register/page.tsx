import { getActiveWeek, getWeekBoard, getMyRegistrations, getMyRoleInfo } from "./actions";
import RegisterBoard from "@/components/admin/RegisterBoard";

export default async function ScheduleRegisterPage() {
  const week = await getActiveWeek();

  if (!week) {
    return (
      <div className="p-6 text-sm text-neutral-500">
        Hiện chưa có tuần nào đang mở đăng ký. Vui lòng quay lại sau.
      </div>
    );
  }

  const [{ sessions, capacityStatus }, myRegistrations, myRoleInfo] = await Promise.all([
    getWeekBoard(week.id),
    getMyRegistrations(week.id),
    getMyRoleInfo(),
  ]);

  return (
    <RegisterBoard
      week={week}
      sessions={sessions}
      capacityStatus={capacityStatus}
      myRegistrations={myRegistrations}
      isSlotCapped={myRoleInfo.isSlotCapped}
    />
  );
}