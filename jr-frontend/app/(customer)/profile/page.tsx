"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router = useRouter(); // khoi tao router
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullname: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
    avatar: "",
  });

  // previewUrl: Biến tạm chỉ dùng để hiển thị trên UI.
  // Nó sẽ bị reset mỗi khi load lại trang.
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    async function getProfile() {
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
    getProfile();
  }, [supabase, router]);

  // CHỈ THAY ĐỔI HÌNH ẢNH TRÊN UI, KHÔNG UPLOAD LÊN SERVER
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const tempUrl = URL.createObjectURL(file);
      setPreviewUrl(tempUrl);
      console.log("Ảnh tạm đã tạo:", tempUrl); // Kiểm tra log xem nó có hiện không
    }
  };
  const handleSave = async () => {
    setLoading(true); //bat trang thai dang xu ly

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let finalAvatarUrl = profile.avatar; //mac dinh lay anh cu

    //neu nguoi dung co chon file moi (selectFile)
    // CHỈ KHI BẤM LƯU MỚI BẮT ĐẦU UPLOAD
    if (selectedFile) {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;

      //upload file that len storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, selectedFile, { upsert: true });

      if (uploadError) {
        alert("Lỗi upload: " + uploadError.message);
        return;
      }

      //lay duong dan cong khai
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      finalAvatarUrl = data.publicUrl;
    }

    // Cập nhật Database
    const { error } = await supabase
      .from("customers")
      .update({ ...profile, avatar: finalAvatarUrl })
      .eq("user_id", user.id);

    if (error) {
      alert("Lỗi lưu: " + error.message);
    } else {
      //thanh cong cap nhat lai profile
      setProfile({ ...profile, avatar: finalAvatarUrl });
      setSelectedFile(null); // Reset file sau khi lưu thành công
      setPreviewUrl(finalAvatarUrl);
      alert("Đã lưu thành công!");
    }
    setLoading(false);
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });
    if (uploadError) {
      alert("Lỗi upload");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

    // Cập nhật vào previewUrl để hiển thị B ngay lập tức
    setPreviewUrl(data.publicUrl);
  };

  if (loading) return <div>Đang tải hồ sơ...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
          <img
            key={previewUrl} // Thêm key này vào để React bắt buộc phải render lại thẻ img khi previewUrl thay đổi
            src={previewUrl || profile.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-sm font-bold text-mint-600 hover:text-mint-700"
        >
          Thay đổi ảnh đại diện
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange} // Dùng hàm handleFileChange mới
          accept="image/*"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
            Họ và tên
          </label>
          <input
            value={profile.fullname || ""}
            onChange={(e) =>
              setProfile({ ...profile, fullname: e.target.value })
            }
            className="w-full p-3 border rounded-xl border-mint-200 focus:ring-2 focus:ring-mint-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
            Giới tính
          </label>
          <input
            value={profile.gender || ""}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
            className="w-full p-3 border rounded-xl border-mint-200 focus:ring-2 focus:ring-mint-400 outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
            Ngày sinh
          </label>
          <input
            type="date" // Thay type="text" mặc định thành "date"
            value={profile.dob || ""}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
            className="w-full p-3 border rounded-xl border-mint-200 focus:ring-2 focus:ring-mint-400 outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
            Số điện thoại
          </label>
          <input
            value={profile.phone || ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full p-3 border rounded-xl border-mint-200 focus:ring-2 focus:ring-mint-400 outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-stone-500 uppercase mb-2">
            Địa chỉ
          </label>
          <input
            value={profile.address || ""}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
            className="w-full p-3 border rounded-xl border-mint-200 focus:ring-2 focus:ring-mint-400 outline-none"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={handleSave}
          className="bg-emerald-400 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md"
        >
          Lưu thay đổi
        </button>
        <button className="text-stone-500 font-bold hover:text-stone-700 transition-colors">
          Hủy
        </button>
      </div>
    </div>
  );
}
