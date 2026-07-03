"use server"; // Dòng này bắt buộc để Next.js hiểu đây là Server Action
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Hàm Xóa
export async function deleteService(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (!error) {
    // Lệnh này giúp reload lại trang ngay lập tức sau khi xóa
    revalidatePath("/admin/services/[type]", "page");
  }
}

// Hàm Thêm (bạn sẽ dùng nó cho Form trong trang Add)
export async function addService(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("services").insert({
    name: formData.get("name"),
    price: Number(formData.get("price")),
    category_id: Number(formData.get("category_id")),
    description: formData.get("description") || null,
    duration: formData.get("duration") || null,
    //image_url: formData.get("image_url") || null,
  });
  revalidatePath("/admin/services/[type]");
}

export async function updateService(id: number, formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("services")
    .update({
      name: formData.get("name"),
      price: Number(formData.get("price")),
      description: formData.get("description") || null,
      duration: formData.get("duration") || null,
      //image_url: formData.get("image_url") || null,
    })
    .eq("id", id);
  revalidatePath("/admin/services/[type]");
}
