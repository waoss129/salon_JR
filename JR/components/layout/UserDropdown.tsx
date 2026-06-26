// src/components/layout/UserDropdown.tsx

"use client";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function UserDropdown({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("Đang tải...");
  const supabase = createClient();

  useEffect(() => {
    const fetchCustomer = async () => {
      // Truy vấn bảng 'customers'
      const { data, error } = await supabase
        .from("customers")
        .select("fullname") // Đúng tên cột trong ảnh của bạn
        .eq("user_id", user.id) // Thay 'user_id' nếu cột của bạn tên khác
        .single();

      if (data) {
        setFullName(data.fullname);
      } else {
        setFullName("Khách hàng");
      }
    };

    if (user) fetchCustomer();
  }, [user, supabase]);

  return (
    <div className="relative">
      {/* Nút bấm hiển thị user.email hoặc tên */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-bold text-pink-500"
      >
        Hi, {fullName} ▼
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-4 w-48 bg-white border border-stone-100 rounded-2xl shadow-xl z-50 p-2">
          <Link
            href="/profile"
            className="block p-3 hover:bg-stone-50 rounded-lg"
          >
            Sửa hồ sơ
          </Link>
          <Link
            href="/history"
            className="block p-3 hover:bg-stone-50 rounded-lg"
          >
            Lịch sử lịch hẹn
          </Link>
          <div className="h-px bg-stone-100 my-1" />
          <button
            onClick={() =>
              supabase.auth.signOut().then(() => window.location.reload())
            }
            className="block w-full text-left p-3 text-red-500 hover:bg-red-50 rounded-lg"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
