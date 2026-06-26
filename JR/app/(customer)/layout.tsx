// src/app/(customer)/layout.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { createClient } from "@/lib/supabase/server";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} /> {/* Truyền user vào đây */}
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
