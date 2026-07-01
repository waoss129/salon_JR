"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function UserDropdown() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [customerName, setCustomerName] = useState<string>("Khách hàng");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 1. useEffect thứ nhất: Lắng nghe trạng thái Auth (Giữ cổng kết nối luôn mở)
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. useEffect thứ hai: PHƯƠNG ÁN 1 - Bốc thẳng fullname từ Auth Metadata (Không lo lỗi DB/RLS)
  useEffect(() => {
    if (!user) {
      setCustomerName("Khách hàng");
      return;
    }

    // Lấy trực tiếp tên từ metadata hệ thống (bắt cả 2 kiểu viết hoa/thường để tránh sót)
    const nameFromAuth =
      user.user_metadata?.fullname || user.user_metadata?.fullName;

    if (nameFromAuth) {
      setCustomerName(nameFromAuth);
    } else {
      // Dự phòng trường hợp hy hữu nếu metadata rỗng
      setCustomerName("Khách hàng mới");
    }
  }, [user]); // Chạy lại ngay khi trạng thái user thay đổi

  // Hàm đăng xuất
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-stone-600 font-medium hover:text-stone-900"
      >
        Đăng nhập
      </Link>
    );
  }

  return (
    <div className="relative inline-block text-left">
      {/* Nút bấm hiển thị lời chào tên khách hàng */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-pink-500 font-bold hover:opacity-80 transition-all flex items-center gap-1 focus:outline-none"
      >
        Hi, {customerName} ▼
      </button>

      {/* Menu thả xuống (Dropdown Options) */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-stone-100 shadow-xl py-2 z-20 space-y-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 font-medium"
            >
              Sửa hồ sơ
            </Link>
            <Link
              href="/appointments"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 font-medium"
            >
              Lịch sử lịch hẹn
            </Link>
            <hr className="border-stone-100 my-1" />
            <button
              onClick={() => {
                setIsOpen(false);
                handleSignOut();
              }}
              className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-bold"
            >
              Đăng xuất
            </button>
          </div>
        </>
      )}
    </div>
  );
}
