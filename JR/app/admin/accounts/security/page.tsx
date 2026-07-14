import { getCurrentEmail } from "./actions";
import SecurityForm from "@/components/admin/SecurityForm";
import { createAdminAuthClient } from "@/lib/supabase/server";
import { canChangeEmail } from "@/lib/supabase/permissions";

export default async function AccountSecurityPage() {
  const email = await getCurrentEmail();

  const supabase = await createAdminAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let roleId: number | null = null;
  if (user) {
    const { data: employee } = await supabase
      .from("employees")
      .select("role_id")
      .eq("id", user.id)
      .single();
    roleId = employee?.role_id ?? null;
  }

  return (
    <SecurityForm
      currentEmail={email ?? ""}
      canEditEmail={canChangeEmail(roleId)}
    />
  );
}
