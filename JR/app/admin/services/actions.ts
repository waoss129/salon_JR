"use server"; // Dòng này bắt buộc để Next.js hiểu đây là Server Action
import { createAdminAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireManage } from "@/lib/supabase/admin-guard";

// Hàm Xóa
export async function deleteService(id: number) {
  // Trước đây hàm này KHÔNG có kiểm tra quyền nào — ai gọi cũng xoá được,
  // kể cả role chỉ có view (vd: CEO). Thêm requireManage để khớp với
  // PERMISSIONS.services.manage trong lib/supabase/permissions.ts.
  await requireManage("services");

  const supabase = await createAdminAuthClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (!error) {
    // Lệnh này giúp reload lại trang ngay lập tức sau khi xóa
    revalidatePath("/admin/services/[type]", "page");
  }
}

// Hàm Thêm (bạn sẽ dùng nó cho Form trong trang Add)
export async function addService(formData: FormData) {
  await requireManage("services");

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
  await requireManage("services");

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
  // Bật/tắt cũng là hành động "sửa" -> cần quyền manage, không phải view.
  await requireManage("services");

  const supabase = await createAdminAuthClient();
  const nextStatus = currentStatus === "active" ? "inactive" : "active";
  await supabase.from("services").update({ status: nextStatus }).eq("id", id);
  revalidatePath("/admin/services/[type]", "page");
}