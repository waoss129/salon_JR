// src/components/layout/Header.tsx

"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import UserDropdown from "./UserDropdown";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaSearch, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { SEARCH_SUGGESTIONS } from "../search/searchConfig";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Đóng menu mobile mỗi khi chuyển trang, tránh menu bị kẹt mở khi bấm 1 link.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Luôn đẩy về đường dẫn có hash
    router.push("/#services-section");

    // Nếu đang ở trang chủ, cuộn ngay lập tức
    if (pathname === "/") {
      const element = document.getElementById("services-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleReturnHome = (e: React.MouseEvent) => {
    e.preventDefault();
    // 1. Cuộn lên đầu trang một cách mượt mà
    window.scrollTo({ top: 0, behavior: "smooth" });
    // 2. Chuyển hướng về trang chủ
    router.push("/");
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };
  const handleInputChange = (e: string) => {
    setSearchTerm(e);
    if (e.length > 0) {
      //loc theo tu khoa tieng viet hoac tieng anh
      const filtered = SEARCH_SUGGESTIONS.filter((item) =>
        item.keywords.some((k) => k.includes(e.toLowerCase())),
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  function SearchBox({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <div className="relative flex items-center w-full">
        <FaSearch className="absolute left-3 text-gray-400 text-sm" />
        <input
          placeholder="Tìm dịch vụ, khuyến mãi..."
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all"
        />
        {suggestions.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
            {suggestions.map((item, idx) => (
              <Link
                key={idx}
                href={item.path}
                className="block px-4 py-2 text-sm text-stone-600 hover:bg-pink-50 hover:text-pink-600 transition"
                onClick={() => {
                  setSuggestions([]);
                  setSearchTerm("");
                  onNavigate?.();
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Logo */}
        <div
          onClick={handleReturnHome}
          className="flex items-center cursor-pointer group outline-none flex-shrink-0"
        >
          <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent italic transition-all group-hover:opacity-80 pr-2">
            JoyRide
          </span>
          <span className="mx-2 sm:mx-3 text-gray-300 font-light hidden sm:inline">
            |
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 mt-1 hidden sm:inline">
            Beauty Studio
          </span>
        </div>

        {/* ==== Desktop: tìm kiếm + menu + user (ẩn dưới md) ==== */}
        <div className="hidden md:flex flex-1 items-center gap-8 ml-8">
          <div className="flex-1 max-w-xs">
            <SearchBox />
          </div>

          <nav className="flex gap-6 flex-shrink-0">
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

          <div className="flex-shrink-0">
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

        {/* ==== Mobile: nút hamburger (chỉ hiện dưới md) ==== */}
        <button
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="md:hidden p-2 text-stone-700 hover:text-pink-400 transition-colors"
          aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* ==== Mobile: panel menu thả xuống ==== */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4">
          <SearchBox onNavigate={() => setIsMobileMenuOpen(false)} />

          <nav className="flex flex-col gap-1">
            <button
              onClick={(e) => {
                handleServicesClick(e);
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-1 hover:text-pink-400 transition-colors font-medium border-b border-gray-50"
            >
              Dịch vụ
            </button>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 px-1 hover:text-pink-400 transition-colors border-b border-gray-50"
            >
              Liên hệ
            </Link>
          </nav>

          <div className="pt-1">
            {user ? (
              <UserDropdown user={user} />
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-1 font-medium text-stone-700 hover:text-pink-400 transition-colors"
              >
                <FaUser size={16} />
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
