import { redirect } from "next/navigation";
import { getProposalsForNextWeek } from "@/app/admin/schedules/proposals/actions";
import ScheduleProposalReview from "@/components/admin/ScheduleProposalReview";

export default async function ScheduleProposalReviewPage() {
  redirect("/admin/schedules"); // TẮT TẠM — chuyển sang mô hình đăng ký mới
  const batches = await getProposalsForNextWeek();

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-xl font-medium">Duyệt lịch làm việc tuần sau</h1>
      <ScheduleProposalReview batches={batches} />
    </div>
  );
}
