import { getLatestWeek, getReviewData } from "./actions";
import ReviewBoard from "@/components/admin/ReviewBoard";

export default async function ScheduleReviewPage() {
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