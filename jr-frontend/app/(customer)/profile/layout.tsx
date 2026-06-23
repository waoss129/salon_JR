// app/(customer)/profile/layout.tsx
import Link from "next/link";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Quản lý hồ sơ</h1>

      {/* Thanh tab điều hướng */}
      <div className="flex gap-6 border-b border-stone-200 mb-8">
        <Link
          href="/profile"
          className="pb-3 text-sm font-bold text-stone-800 border-b-2 border-stone-800"
        >
          Thông tin cá nhân
        </Link>
        <Link
          href="/profile/security"
          className="pb-3 text-sm font-bold text-stone-500 hover:text-stone-800"
        >
          Tài khoản & Bảo mật
        </Link>
      </div>

      {/* Nội dung sẽ thay đổi theo trang con */}
      <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
        {children}
      </div>
    </div>
  );
}
