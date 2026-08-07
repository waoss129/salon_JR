import { redirect } from "next/navigation";
import { getMyPendingProposal } from "@/app/admin/schedules/proposals/actions";
import { getSessions } from "@/app/admin/schedules/actions";
import MyProposalForm from "@/components/admin/MyProposalForm";

export default async function MyScheduleProposalPage() {
  redirect("/employee/schedule"); //tắt tạm - chuyển sang mô hình đăng ký mới
  const proposal = await getMyPendingProposal();
  const sessions = await getSessions();

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-xl font-medium">
        Đề xuất lịch làm việc tuần sau
      </h1>
      {!proposal ? (
        <p className="text-gray-400">
          Hiện bạn chưa có đề xuất lịch nào cho tuần sau.
        </p>
      ) : (
        <MyProposalForm proposal={proposal} sessions={sessions} />
      )}
    </div>
  );
}
