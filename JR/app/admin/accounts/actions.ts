"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "lib/supabase/server"; // theo chuẩn @supabase/ssr

export type ProfileWithEmployee = {
  id: string;
  fullname: string | null;
  gender: string | null;
  dob: string | null; // yyyy-mm-dd
  phone: string | null;
  address: string | null;
  avatar: string | null;
  email: string | null;
  // Các trường lấy từ bảng employees
  level: string | null; // trình độ
  certificate_name: string | null; // bằng cấp
  joined_at: string | null; // ngày vào làm
};

export async function getCurrentAccount(): Promise<ProfileWithEmployee | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: profile }, { data: employee }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, fullname, gender, dob, phone, address, avatar, email")
      .eq("id", user.id)
      .single(),
    supabase
      .from("employees")
      .select("level, certificate_name, joined_at")
      .eq("id", user.id)
      .single(),
  ]);

  if (!profile) return null;

  return {
    id: profile.id,
    fullname: profile.fullname,
    gender: profile.gender,
    dob: profile.dob,
    phone: profile.phone,
    address: profile.address,
    avatar: profile.avatar,
    email: profile.email,
    level: employee?.level ?? null,
    certificate_name: employee?.certificate_name ?? null,
    joined_at: employee?.joined_at ?? null,
  };
}

export type UpdateProfileState = {
  success: boolean;
  message: string;
};

export async function updateProfile(
  _prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Bạn cần đăng nhập lại." };
  }

  const fullname = String(formData.get("fullname") ?? "").trim();
  const gender = String(formData.get("gender") ?? "");
  const dob = String(formData.get("dob") ?? "") || null;
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const level = String(formData.get("level") ?? "").trim();
  const certificateName = String(formData.get("certificate_name") ?? "").trim();
  const joinedAt = String(formData.get("joined_at") ?? "") || null;

  if (!fullname) {
    return { success: false, message: "Họ tên không được để trống." };
  }

  // Xử lý upload avatar (nếu người dùng chọn file mới)
  const avatarFile = formData.get("avatar_file") as File | null;
  let avatarUrl: string | undefined;

  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split(".").pop();
    const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true });

    if (uploadError) {
      return {
        success: false,
        message: `Tải ảnh đại diện thất bại: ${uploadError.message}`,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    avatarUrl = publicUrlData.publicUrl;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      fullname,
      gender,
      dob,
      phone,
      address,
      ...(avatarUrl ? { avatar: avatarUrl } : {}),
    })
    .eq("id", user.id);

  if (profileError) {
    return {
      success: false,
      message: `Lỗi cập nhật hồ sơ: ${profileError.message}`,
    };
  }

  const { error: employeeError } = await supabase
    .from("employees")
    .update({
      level,
      certificate_name: certificateName,
      joined_at: joinedAt,
    })
    .eq("id", user.id);

  if (employeeError) {
    return {
      success: false,
      message: `Lỗi cập nhật thông tin công việc: ${employeeError.message}`,
    };
  }

  revalidatePath("/admin/accounts");

  return { success: true, message: "Cập nhật thông tin thành công." };
}
