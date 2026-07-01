// src/components/layout/Header.tsx

"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import UserDropdown from "./UserDropdown";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaSearch, FaUser } from "react-icons/fa";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    //goi ham dang xuat
    await supabase.auth.signOut();
    //chuyen huong ve trang chu
    router.push("/");
    //lam moi trang de cap nhat trang thai
    router.refresh();
  };

  //them useEffect de lay user va thong tin ho so (fullname) tu bang khach hang khi trang load
  useEffect(() => {
    if (!supabase) return; // tat supabase cloud
    const fetchUserProfile = async (currentUser: any) => {
      if (!currentUser) {
        setUser(null);
        return;
      }

      // Truy vấn vào bảng customers lấy họ tên thực tế dựa theo user_id trùng khớp
      const { data: customerData } = await supabase
        .from("customers")
        .select("fullname")
        .eq("user_id", currentUser.id)
        .single();
      // Hợp nhất dữ liệu Auth cốt lõi với họ tên lấy từ DB public công khai
      setUser({
        ...currentUser,
        fullname: customerData?.fullname || "Khách hàng", // Fallback phòng trường hợp lỗi
      });
    };

    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await fetchUserProfile(session?.user || null);
    };
    checkUser();

    // Lắng nghe thay đổi trạng thái đăng nhập / đăng xuất thời gian thực (Real-time)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await fetchUserProfile(session?.user || null);
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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 py-4 shadow-sm border-b border-gray-100">
      {/* Cả Logo và Slogan đều gọi hàm handleReturnHome */}
      <div
        onClick={handleReturnHome}
        className="flex items-center cursor-pointer group outline-none flex-shrink-0"
      >
        <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent italic transition-all group-hover:opacity-80 pr-2">
          JoyRide
        </span>
        <span className="mx-3 text-gray-300 font-light">|</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 mt-1">
          Beauty Studio
        </span>
      </div>

      {/* 2. Ô Tìm kiếm (Chèn vào giữa) */}
      <div className="flex-1 max-w-xs mx-8">
        <div className="relative flex items-center">
          <FaSearch className="absolute left-3 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Tìm dịch vụ..."
            className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <nav className="flex gap-6">
          {/* Nút Dịch vụ đã sửa thành button để gọi hàm */}
          <button
            onClick={handleServicesClick}
            className="hover:text-pink-400 transition-colors font-medium cursor-pointer"
          >
            Dịch vụ
          </button>
          <Link
            href="/contact"
            className="hover:text-pink-400 transition-colors"
          >
            Liên hệ
          </Link>
        </nav>

        <div>
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <Link
              href="/login"
              className="hover:text-pink-400 transition-colors"
            >
              <FaUser size={20} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
