"use server";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCustomer(formData: FormData) {
  const supabase = await createAdminClient();

  const email = (formData.get("email") as string).trim();
  const fullname = (formData.get("fullname") as string).trim();
  const phone = (formData.get("phone") as string).trim();
  const gender = (formData.get("gender") as string).trim();

  // 1. Tạo User trong Auth
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: email,
      password: "Password123!",
      email_confirm: true,
      user_metadata: { full_name: fullname },
    });

  if (authError) throw authError;

  // 2. Cập nhật Profile (đã có Trigger, nhưng update thêm phone để đảm bảo)
  await supabase
    .from("profiles")
    .update({ fullname, phone, gender })
    .eq("id", authData.user.id);
  await supabase
    .from("customers")
    .upsert({ id: authData.user.id, status: "active" });
  revalidatePath("/admin/customers");

  // 3. Đảm bảo bản ghi trong bảng customers được tạo
  const { error: custError } = await supabase.from("customers").upsert({
    id: authData.user.id,
    status: "active",
  });

  if (custError) throw custError;
}
export async function updateCustomer(id: string, formData: FormData) {
  const supabase = await createAdminClient();
  const fullname = formData.get("fullname") as string;
  const phone = formData.get("phone") as string;
  const gender = formData.get("gender") as string;

  await supabase.from("profiles").update({ fullname, phone }).eq("id", id);
  revalidatePath("/admin/customers");
}
