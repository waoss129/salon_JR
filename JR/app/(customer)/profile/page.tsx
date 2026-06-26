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
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setProfile(data);
        setPreviewUrl(data.avatar);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Xử lý chọn file: CHỈ tạo đường dẫn tạm
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let avatarUrl = profile.avatar;

    // Nếu có file mới, upload lên Supabase
    if (selectedFile) {
      const fileName = `${user.id}_${Date.now()}.png`; // Đặt tên file duy nhất
      await supabase.storage.from("avatars").upload(fileName, selectedFile);
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      avatarUrl = data.publicUrl;
    }

    // Cập nhật Database (gồm cả ảnh và thông tin chữ)
    const { error } = await supabase
      .from("customers")
      .update({
        ...profile,
        avatar: avatarUrl,
      })
      .eq("user_id", user.id);

    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      setProfile({ ...profile, avatar: avatarUrl });
      setSelectedFile(null);
      alert("Đã lưu thành công!");
    }
    setLoading(false);
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
          { label: "Giới tính", key: "gender", type: "select" }, // Thêm thuộc tính type
          { label: "Địa chỉ", key: "address", placeholder: "Nhập địa chỉ" },
        ].map((field) => (
          <div key={field.key} className="space-y-1">
            <label className="text-xs font-bold text-stone-500 uppercase">
              {field.label}
            </label>

            {field.type === "select" ? (
              // Hiển thị SELECT cho Giới tính
              <select
                //ep kieu ve chuoi an toan: neu null/undefined thi tra ve ""
                value={profile.gender?.toString() ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  //neu chon option rong, luu la null (hoac string rong tuy db)
                  //neu co gia tri thi moi parseInt de tranh NaN

                  setProfile({
                    ...profile,
                    gender: val === "" ? null : parseInt(val),
                  });
                }}
                className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              >
                <option value="">Chọn giới tính</option>
                <option value="0">Nam</option>
                <option value="1">Nữ</option>
                <option value="2">Khác</option>
              </select>
            ) : (
              // Hiển thị INPUT cho các trường còn lại
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

      {/* Nút lưu */}
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
