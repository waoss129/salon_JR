"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Nếu bạn đã có sẵn hàm cn() (ví dụ từ shadcn/ui: lib/utils.ts) thì có thể
// import và dùng thay cho hàm nhỏ này.
function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const NAV_ITEMS = [
  { href: "/admin/accounts", label: "Thông tin cá nhân" },
  { href: "/admin/accounts/security", label: "Tài khoản & bảo mật" },
];

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        Tài khoản của tôi
      </h1>

      <nav className="mb-8 flex gap-1 border-b border-gray-200">
        {NAV_ITEMS.map((item) => {
          // Trang security nằm ở path con nên so sánh chính xác, còn trang gốc
          // /admin/accounts không được active khi đang ở /admin/accounts/security
          const isActive =
            item.href === "/admin/accounts"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-800",
              )}
            >
              {item.label}
              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gray-900" />
              )}
            </Link>
          );
        })}
      </nav>

      <div>{children}</div>
    </div>
  );
}
