import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// 1. Client cho khách hàng (ANON KEY, cookie riêng)
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: "sb-customer-auth",
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll được gọi từ 1 Server Component (không phải Server Action/
            // Route Handler) — Next.js không cho phép ghi cookie ở đây. Bỏ qua
            // có chủ đích: middleware.ts đã tự lo refresh session trên mọi
            // request rồi, nên Server Component không refresh được cũng
            // không sao, phiên đăng nhập vẫn đúng ở tầng middleware.
          }
        },
      },
    },
  );
}

// 2. Client cho Admin (ANON KEY, cookie riêng — dùng ở server components/actions phía admin)
export async function createAdminAuthClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: "sb-admin-auth",
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Lý do bỏ qua giống hệt createClient() ở trên.
          }
        },
      },
    },
  );
}

// 3. Client cho Admin/Backend thao tác đặc quyền (SERVICE ROLE KEY — giữ nguyên, không đổi)
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
