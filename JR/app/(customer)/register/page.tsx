"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client"; //dam bao duong dan dung

import Link from "next/link";

// Hàm chuyển đổi thông báo lỗi của Supabase sang Tiếng Việt
const getVietnameseAuthError = (message: string): string => {
  const msg = message.toLowerCase();
  if (
    msg.includes("email already in use") ||
    msg.includes("already registered")
  ) {
    return "Email này đã được sử dụng cho một tài khoản khác.";
  }
  if (msg.includes("password should be at least")) {
    return "Mật khẩu quá ngắn (Yêu cầu tối thiểu phải từ 6 ký tự trở lên).";
  }
  if (msg.includes("invalid email")) {
    return "Định dạng địa chỉ Email không hợp lệ.";
  }
  if (msg.includes("network error") || msg.includes("failed to fetch")) {
    return "Lỗi kết nối mạng hoặc cấu hình hệ thống chưa đúng.";
  }
  // Nếu gặp lỗi khác chưa định nghĩa sẵn, trả về nội dung dịch tổng quát
  return `Đăng ký không thành công. Chi tiết: ${message}`;
};
export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullname.trim()) {
      alert("Vui lòng nhập Họ và tên.");
      return;
    }

    // Gọi API của Supabase Auth và truyền kèm fullname vào meta_data để trigger phía trên bắt được
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullname: fullname, // Đẩy họ tên lên metadata hệ thống
        },
      },
    });

    if (authError) {
      alert(getVietnameseAuthError(authError.message));
      return;
    }

    if (data.user) {
      alert("Đăng ký tài khoản thành công! Hệ thống tự động khởi tạo hồ sơ ✨");
      //window.location.href = "/";
      router.push("/"); // Thay vì dùng window.location.href
      router.refresh(); // Ép làm mới lại Layout để Header nhận diện User mới ngay lập tức
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-6">
      <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800">
            Tạo tài khoản mới
          </h2>
          <p className="text-stone-500 text-sm mt-2">
            Gia nhập gia đình JoyRide ngay hôm nay!
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
              Họ và tên
            </label>
            <input
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none"
              placeholder="name@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
              Mật khẩu
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-200 outline-none"
              placeholder=""
            />
          </div>

          <button
            onClick={handleRegister}
            type="submit"
            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-md"
          >
            ĐĂNG KÝ TÀI KHOẢN ✨
          </button>
        </form>

        <p className="text-center text-sm text-stone-500">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-blue-400 font-bold hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
