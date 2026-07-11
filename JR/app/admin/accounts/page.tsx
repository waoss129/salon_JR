import { getCurrentAccount } from "./actions";
import ProfileForm from "@/components/admin/ProfileForm";

export default async function AccountProfilePage() {
  const account = await getCurrentAccount();

  if (!account) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Không thể tải thông tin tài khoản. Vui lòng đăng nhập lại.
      </div>
    );
  }

  return <ProfileForm account={account} />;
}
