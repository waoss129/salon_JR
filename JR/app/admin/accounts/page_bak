import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function AccountPage() {
  const supabase = await createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Lấy dữ liệu
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  // Action update nhanh
  async function updateAction(formData: FormData) {
    "use server";
    const supabase = await createAdminClient();
    await supabase
      .from("profiles")
      .update({
        fullname: formData.get("fullname"),
        phone: formData.get("phone"),
        address: formData.get("address"),
      })
      .eq("id", user?.id);
    revalidatePath("/admin/accounts");
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Tài khoản của tôi</h1>
      <form action={updateAction} className="space-y-4">
        <input
          name="fullname"
          defaultValue={profile?.fullname}
          className="border w-full p-2"
          placeholder="Họ tên"
        />
        <input
          name="phone"
          defaultValue={profile?.phone}
          className="border w-full p-2"
          placeholder="SĐT"
        />
        <input
          name="address"
          defaultValue={profile?.address}
          className="border w-full p-2"
          placeholder="Địa chỉ"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Lưu thông tin
        </button>
      </form>
    </div>
  );
}
