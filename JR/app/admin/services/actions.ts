"use server"; // Dòng này bắt buộc để Next.js hiểu đây là Server Action
import { createAdminAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Hàm Xóa
export async function deleteService(id: number) {
  const supabase = await createAdminAuthClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (!error) {
    // Lệnh này giúp reload lại trang ngay lập tức sau khi xóa
    revalidatePath("/admin/services/[type]", "page");
  }
}

// Hàm Thêm (bạn sẽ dùng nó cho Form trong trang Add)
export async function addService(formData: FormData) {
  const supabase = await createAdminAuthClient();
  await supabase.from("services").insert({
    name: formData.get("name"),
    price: Number(formData.get("price")),
    category_id: Number(formData.get("category_id")),
    description: formData.get("description") || null,
    duration: formData.get("duration") || null,
    // Quan trọng: luôn set status khi tạo mới, tránh để NULL (NULL sẽ bị coi là
    // "không active" ở mọi nơi lọc theo status = 'active', ví dụ trang hóa đơn/khuyến mãi).
    status: (formData.get("status") as string) || "active",
    //image_url: formData.get("image_url") || null,
  });
  revalidatePath("/admin/services/[type]");
}

export async function updateService(id: number, formData: FormData) {
  const supabase = await createAdminAuthClient();
  await supabase
    .from("services")
    .update({
      name: formData.get("name"),
      price: Number(formData.get("price")),
      description: formData.get("description") || null,
      duration: formData.get("duration") || null,
      status: (formData.get("status") as string) || "active",
      //image_url: formData.get("image_url") || null,
    })
    .eq("id", id);
  revalidatePath("/admin/services/[type]");
}

// Bật/tắt nhanh trạng thái active-inactive ngay trên bảng danh sách.
export async function toggleServiceStatus(
  id: number,
  currentStatus: string | null,
) {
  const supabase = await createAdminAuthClient();
  const nextStatus = currentStatus === "active" ? "inactive" : "active";
  await supabase.from("services").update({ status: nextStatus }).eq("id", id);
  revalidatePath("/admin/services/[type]", "page");
}
