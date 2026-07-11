"use server";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCustomer(formData: FormData) {
  const supabase = await createAdminClient();

  const email = ((formData.get("email") as string) || "").trim();
  const fullname = ((formData.get("fullname") as string) || "").trim();
  const phone = ((formData.get("phone") as string) || "").trim();
  const genderRaw = formData.get("gender");
  const gender = genderRaw ? (genderRaw as string).trim() : null;

  // 1. Tạo User trong Auth
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: email,
      password: "Password123!",
      email_confirm: true,
      user_metadata: { full_name: fullname },
    });

  if (authError) throw authError;

  // 2. Update Profile: Dùng .upsert thay vì .update để đảm bảo nếu trigger
  // chưa kịp tạo profile thì lệnh này vẫn hoạt động mà không bị lỗi
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: authData.user.id,
    fullname,
    phone,
    gender,
    email,
  });

  if (profileError) throw profileError;

  // 3. Đảm bảo bảng customers có bản ghi
  const { error: custError } = await supabase
    .from("customers")
    .upsert({ id: authData.user.id, status: "active" });

  if (custError) throw custError;

  revalidatePath("/admin/customers");
}
export async function updateCustomer(id: string, formData: FormData) {
  const supabase = await createAdminClient();

  const file = formData.get("avatar") as File | null;
  let avatarUrl = null;

  if (file && file instanceof File && file.size > 0) {
    // const fileExt = file.name.split(".").pop();
    // const fileName = `${id}-${Date.now()}.${fileExt}`;

    // const { error: uploadError } = await supabase.storage
    //   .from("avatars")
    //   .upload(fileName, file, { upsert: true });

    // if (uploadError) throw new Error(`Lỗi upload ảnh: ${uploadError.message}`);

    // const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    // avatarUrl = data.publicUrl;

    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const MAX_SIZE = 5 * 1024 * 1024;

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(
        "Ảnh đại diện phải là định dạng JPG, PNG, WEBP hoặc GIF.",
      );
    }
    if (file.size > MAX_SIZE) {
      throw new Error("Ảnh đại diện không được vượt quá 5MB.");
    }

    // Lấy avatar cũ (nếu có) để xóa sau khi upload thành công, tránh rác trong storage
    const { data: oldProfile } = await supabase
      .from("profiles")
      .select("avatar")
      .eq("id", id)
      .single();

    const fileExt = file.name.split(".").pop();
    // Lưu theo từng thư mục con của khách hàng cho gọn, kèm timestamp để tránh cache ảnh cũ
    const filePath = `customers/${id}/avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) throw new Error(`Lỗi upload ảnh: ${uploadError.message}`);

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    avatarUrl = data.publicUrl;

    // Xóa ảnh cũ nếu tồn tại và nằm trong bucket "avatars" (bỏ qua lỗi nếu không xóa được)
    if (oldProfile?.avatar) {
      const oldPath = oldProfile.avatar.split("/avatars/")[1];
      if (oldPath) {
        await supabase.storage.from("avatars").remove([oldPath]);
      }
    }
  }

  // ÉP DỮ LIỆU TỪ FORM - Đảm bảo tên 'name' trong input khớp với đây
  const updateData: any = {
    fullname: formData.get("fullname") as string,
    phone: formData.get("phone") as string,
    gender: formData.get("gender") as string,
    address: formData.get("address") as string,
    dob: (formData.get("dob") as string) || null,
  };

  // Nếu có ảnh mới thì thêm vào object dữ liệu để update
  if (avatarUrl) {
    updateData.avatar = avatarUrl;
  }
  console.log("Dữ liệu đang gửi đi:", updateData); // Kiểm tra log này trong Terminal

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", id);

  if (error) throw error;
  revalidatePath(`/admin/customers/${id}`);
}
export async function updateCustomerStatus(id: string, status: string) {
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("customers")
    .update({ status })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/customers");
}
export async function deleteCustomer(id: string) {
  const supabase = await createAdminClient();

  // Xóa bản ghi trong bảng customers
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/customers");
}
