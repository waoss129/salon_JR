"use server";

import { redirect } from "next/navigation";
import { createAdminAuthClient } from "@/lib/supabase/server";

export async function logoutAction() {
  const supabase = await createAdminAuthClient();

  await supabase.auth.signOut();

  redirect("/admin/login");
}
