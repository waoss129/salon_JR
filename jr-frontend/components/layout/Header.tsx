// src/components/layout/Header.tsx

"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import UserDropdown from "./UserDropdown";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  //them useEffect de lay user khi trang load
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    //lang nghe thay doi trang thai dang nhap / dang xuat
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);
  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();

    //neu dang o trang chu thi cuon ngay
    if (pathname === "/") {
      const element = document.getElementById("services-section");
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      //neu o trang khac, ve trang chu va them hash vao URL
      router.push("/#services-section");
    }
  };

  const handleReturnHome = (e: React.MouseEvent) => {
    e.preventDefault();
    // 1. Cuộn lên đầu trang một cách mượt mà
    window.scrollTo({ top: 0, behavior: "smooth" });
    // 2. Chuyển hướng về trang chủ
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-between p-6 shadow-sm border-b border-gray-100">
      {/* Cả Logo và Slogan đều gọi hàm handleReturnHome */}
      <div
        onClick={handleReturnHome}
        className="flex items-center cursor-pointer group outline-none flex-shrink-0"
      >
        <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent italic transition-all group-hover:opacity-80 pr-2">
          JoyRide
        </span>
        <span className="mx-3 text-gray-300 font-light">|</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 mt-1">
          Beauty Studio
        </span>
      </div>

      <nav className="flex gap-8">
        {/* Chữ "Trang chủ" cũng gọi hàm handleReturnHome */}
        <button
          onClick={handleReturnHome}
          className="hover:text-pink-400 transition-colors font-medium cursor-pointer"
        >
          Trang chủ
        </button>
        {/* Nút Dịch vụ đã sửa thành button để gọi hàm */}
        <button
          onClick={handleServicesClick}
          className="hover:text-pink-400 transition-colors font-medium cursor-pointer"
        >
          Dịch vụ
        </button>
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
