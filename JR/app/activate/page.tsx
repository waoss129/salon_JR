import { getActivationInfo } from "./actions";
import { ActivationForm } from "@/components/activate/ActivationForm";

export default async function ActivatePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 text-center">
        <h1 className="text-xl font-medium mb-2">Link không hợp lệ</h1>
        <p className="text-gray-500">Thiếu mã kích hoạt trong đường dẫn.</p>
      </div>
    );
  }

  try {
    const { fullname } = await getActivationInfo(token);
    return (
      <div className="max-w-md mx-auto py-16 px-6">
        <h1 className="text-xl font-medium mb-1">Kích hoạt tài khoản</h1>
        <p className="text-gray-500 mb-6">
          Xin chào <span className="font-medium">{fullname}</span>, hãy đặt
          email và mật khẩu để hoàn tất kích hoạt tài khoản nhân viên.
        </p>
        <ActivationForm token={token} />
      </div>
    );
  } catch (err) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 text-center">
        <h1 className="text-xl font-medium mb-2">Không thể kích hoạt</h1>
        <p className="text-gray-500">
          {err instanceof Error
            ? err.message
            : "Có lỗi xảy ra, vui lòng liên hệ quản trị viên."}
        </p>
      </div>
    );
  }
}
