import { getLatestWeek, getReviewData } from "./actions";
import ReviewBoard from "@/components/admin/ReviewBoard";
import { requireManage } from "@/lib/supabase/admin-guard";

export default async function ScheduleReviewPage() {
  // Trang duyệt lịch là công cụ QUẢN LÝ (xem + ghép ca cho toàn bộ nhân
  // viên), không phải trang "xem" thông thường -> đòi quyền manage
  // ("schedules"), khớp với requireScheduleManager() (role 1,2,3) đã dùng
  // trong actions.ts. Trước đây trang này KHÔNG có dòng chặn nào, ai biết
  // URL cũng vào xem được (dù actions.ts đã chặn 1 phần, getLatestWeek/
  // getReviewData vẫn hở cho tới bản vá này).
  await requireManage("schedules");

  const week = await getLatestWeek();

  if (!week) {
    return (
      <div className="p-6 text-sm text-neutral-500">
        Chưa có tuần nào được thiết lập. Vào mục "Thiết Lập Ca" để tạo tuần mới.
      </div>
    );
  }

  const data = await getReviewData(week.id);

  return (
    <div className="p-6">
      <ReviewBoard week={week} data={data} />
    </div>
  );
}