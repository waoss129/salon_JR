import { createAdminAuthClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { canView, type Feature } from "@/lib/supabase/permissions";

export async function getCurrentAdminRoleId(): Promise<number | null> {
  const supabase = await createAdminAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("employees")
    .select("role_id")
    .eq("id", user.id)
    .single();

  return data?.role_id ?? null;
}

/**
 * Gọi ở đầu mỗi page.tsx (Server Component) cần bảo vệ. Nếu không đủ
 * quyền xem, tự động đá về /admin/dashboard.
 */
export async function requireView(feature: Feature) {
  const roleId = await getCurrentAdminRoleId();
  if (!canView(roleId, feature)) {
    redirect("/admin/dashboard");
  }
  return roleId;
}
