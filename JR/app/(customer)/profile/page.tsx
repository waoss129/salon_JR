"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullname: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
    avatar: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("fullname, phone, address, gender, dob, avatar") // Chỉ chọn các trường cần thiết, bỏ created_at, email
        .eq("id", user.id)
        .single();
      if (data) {
        setProfile(data);
        setPreviewUrl(data.avatar);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // 1. Kiểm tra tài khoản hiện tại
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại!");
        setLoading(false);
        return;
      }

      let avatarUrl = profile.avatar;

      // 2. XỬ LÝ UPLOAD ẢNH (Nếu có chọn file mới)
      if (selectedFile) {
        const fileName = `${user.id}_${Date.now()}.png`;

        // Thực hiện upload và bắt lỗi riêng biệt cho Storage
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, selectedFile, { upsert: true });

        if (uploadError) {
          console.error("Lỗi Storage Upload:", uploadError);
          alert(
            `Không thể tải ảnh lên: ${uploadError.message}. Hệ thống sẽ tiếp tục lưu các thông tin khác.`,
          );
        } else {
          // Lấy URL công khai nếu upload thành công
          const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName);
          avatarUrl = data.publicUrl;
        }
      }

      // 3. XỬ LÝ CẬP NHẬT THÔNG TIN CHỮ VÀO DATABASE
      const updateData: any = {
        fullname: profile.fullname || null,
        phone: profile.phone || null,
        address: profile.address || null,
        gender: profile.gender || null,
        dob: profile.dob || null,
        avatar: avatarUrl,
        updated_at: new Date().toISOString(), // Đảm bảo cập nhật mốc thời gian mới
      };

      console.log("Dữ liệu chuẩn bị gửi lên Database:", updateData);

      const { error: dbError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (dbError) {
        console.error("Lỗi Database Update:", dbError);
        alert(`Lỗi lưu thông tin: ${dbError.message}`);
      } else {
        // 🔥 BỔ SUNG ĐOẠN NÀY: Đồng bộ lại cả tên mới vào Session Auth của hệ thống
        await supabase.auth.updateUser({
          data: {
            fullname: profile.fullname,
            fullName: profile.fullname, // Đề phòng cả 2 kiểu viết hoa viết thường
          },
        });
        // Đồng bộ lại state hiển thị của giao diện
        setProfile((prev) => ({ ...prev, avatar: avatarUrl }));
        setSelectedFile(null);
        alert("Đã lưu thông tin thay đổi thành công!");

        // Ép Next.js làm mới lại router để cập nhật tên lên Dropdown ngay lập tức
        //router.refresh();
        // Làm mới lại toàn bộ trang để thanh Header bắt được Session mới
        window.location.reload();
      }
    } catch (catchError: any) {
      console.error("Lỗi hệ thống ngoài dự kiến:", catchError);
      alert(`Đã xảy ra lỗi hệ thống: ${catchError.message || catchError}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-stone-100">
      <h2 className="text-2xl font-bold text-stone-800 mb-6">
        Thông tin cá nhân
      </h2>

      {/* Phần Ảnh đại diện */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative group">
          <img
            src={previewUrl || profile.avatar || "/default-avatar.png"}
            className="w-24 h-24 rounded-full object-cover border-4 border-stone-100 shadow-md"
            alt="Avatar"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity text-xs font-semibold"
          >
            Thay đổi
          </button>
        </div>
        <div>
          <h3 className="font-semibold text-stone-800">Ảnh đại diện</h3>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
      </div>

      {/* Grid Input thông tin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Họ và tên", key: "fullname", placeholder: "Nhập họ tên" },
          { label: "Số điện thoại", key: "phone", placeholder: "Nhập SĐT" },
          { label: "Giới tính", key: "gender", type: "select" },
          { label: "Địa chỉ", key: "address", placeholder: "Nhập địa chỉ" },
        ].map((field) => (
          <div key={field.key} className="space-y-1">
            <label className="text-xs font-bold text-stone-500 uppercase">
              {field.label}
            </label>

            {field.type === "select" ? (
              <select
                value={profile.gender ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value })
                }
                className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            ) : (
              <input
                value={(profile as any)[field.key] ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, [field.key]: e.target.value })
                }
                placeholder={field.placeholder}
                className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}
