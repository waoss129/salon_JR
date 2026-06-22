// src/components/layout/Header.tsx
import { createClient } from "@/lib/supabase/server";
import UserDropdown from "./UserDropdown";
import Link from "next/link";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-between p-6 shadow-sm border-b border-gray-100">
      {/* Bao bọc bằng Link thay vì dùng onClick */}
      <Link
        href="/"
        className="flex items-center cursor-pointer group outline-none"
      >
        {/* Logo Gradient với hiệu ứng chuyển màu */}
        <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent italic transition-all group-hover:opacity-80">
          JoyRide
        </span>

        {/* Đường kẻ dọc tinh tế */}
        <span className="mx-3 text-gray-300 font-light">|</span>

        {/* Slogan BEAUTY STUDIO */}
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 mt-1">
          Beauty Studio
        </span>
      </Link>

      <nav className="flex gap-8">
        <Link href="/" className="hover:text-pink-400 transition-colors">
          Trang chủ
        </Link>
        <Link
          href="/services"
          className="hover:text-pink-400 transition-colors"
        >
          Dịch vụ
        </Link>
        <Link href="/contact" className="hover:text-pink-400 transition-colors">
          Liên hệ
        </Link>
      </nav>

      <div>
        {user ? (
          <UserDropdown user={user} />
        ) : (
          <Link
            href="/login"
            className="bg-pink-100 hover:bg-pink-200 text-pink-600 px-6 py-2 rounded-full font-semibold transition-all"
          >
            ĐĂNG NHẬP
          </Link>
        )}
      </div>
    </header>
  );
}
