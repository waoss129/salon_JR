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

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: email,
      password: "Password123!",
      email_confirm: true,
      user_metadata: { fullname }, // đổi key cho khớp trigger (fullname, không phải full_name)
    });

  if (authError) throw authError;

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: authData.user.id,
    fullname,
    phone,
    gender,
    email,
  });

  if (profileError) throw profileError;

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

    const { data: oldProfile } = await supabase
      .from("profiles")
      .select("avatar")
      .eq("id", id)
      .single();

    const fileExt = file.name.split(".").pop();
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

    if (oldProfile?.avatar) {
      const oldPath = oldProfile.avatar.split("/avatars/")[1];
      if (oldPath) {
        await supabase.storage.from("avatars").remove([oldPath]);
      }
    }
  }

  const updateData: any = {
    fullname: formData.get("fullname") as string,
    phone: formData.get("phone") as string,
    gender: formData.get("gender") as string,
    address: formData.get("address") as string,
    dob: (formData.get("dob") as string) || null,
  };

  if (avatarUrl) {
    updateData.avatar = avatarUrl;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", id);

  if (error) throw error;

  revalidatePath(`/admin/customers/${id}`);
  revalidatePath("/admin/customers");
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

  const { error: custError } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);
  if (custError) {
    throw new Error(
      "Không thể xoá: khách hàng này vẫn còn lịch sử lịch hẹn liên quan.",
    );
  }

  const { error: authError } = await supabase.auth.admin.deleteUser(id);
  if (authError) throw authError;

  revalidatePath("/admin/customers");
}
