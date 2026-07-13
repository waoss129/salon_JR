"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // Lưu trữ dữ liệu gốc để so sánh
  const [originalProfile, setOriginalProfile] = useState<any>({});
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

  const loadData = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/Login");
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("fullname, phone, address, gender, dob, avatar")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
      setOriginalProfile(data); //luu ban goc
      setPreviewUrl(data.avatar);
    }
    setLoading(false);
  }, [supabase, router]); //dependency cua useCallback

  // useEffect(() => {
  //   async function loadData() {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     if (!user) {
  //       router.push("/login");
  //       return;
  //     }
  //     const { data } = await supabase
  //       .from("profiles")
  //       .select("fullname, phone, address, gender, dob, avatar") // Chỉ chọn các trường cần thiết, bỏ created_at, email
  //       .eq("id", user.id)
  //       .single();
  //     if (data) {
  //       setProfile(data);
  //       setPreviewUrl(data.avatar);
  //     }
  //     setLoading(false);
  //   }
  //   loadData();
  // }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

      // 1. Chỉ tìm các trường đã thay đổi
      const changedData: any = {};
      Object.keys(profile).forEach((key) => {
        if (profile[key as keyof typeof profile] !== originalProfile[key]) {
          changedData[key] = profile[key as keyof typeof profile];
        }
      });

      let avatarUrl = profile.avatar;

      // 2. Upload ảnh nếu có thay đổi
      if (selectedFile) {
        const fileName = `${user.id}_${Date.now()}.png`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, selectedFile, { upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName);
          avatarUrl = data.publicUrl;
          changedData.avatar = avatarUrl;
        }
      }

      // 3. Nếu không có gì thay đổi và không có ảnh mới, không làm gì cả
      if (Object.keys(changedData).length === 0) {
        alert("Không có thông tin nào thay đổi!");
        setLoading(false);
        return;
      }

      // 4. Cập nhật Database
      const { error: dbError } = await supabase
        .from("profiles")
        .update(changedData)
        .eq("id", user.id);

      if (dbError) throw dbError;

      // Đồng bộ Auth
      if (changedData.fullname) {
        await supabase.auth.updateUser({
          data: { fullname: changedData.fullname },
        });
      }

      await loadData(); // Tải lại dữ liệu mới từ DB
      setSelectedFile(null);
      setPreviewUrl(null); //bỏ ảnh xem trước tạm, để hiển thị đúng profile.avatar thật vừa load lại
      alert("Đã lưu thay đổi thành công!");
      router.refresh();
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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
          className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}
