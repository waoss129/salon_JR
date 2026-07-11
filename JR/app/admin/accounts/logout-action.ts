"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server"; // client anon key, gắn cookie phiên

export async function logoutAction() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  // Chuyển hẳn về trang login sau khi xoá session
  redirect("/admin/login");
}
