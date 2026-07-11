// middleware.ts (đặt ở thư mục gốc project, ngang hàng với app/)
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Áp dụng middleware cho mọi route, TRỪ:
     * - file tĩnh Next.js (_next/static, _next/image)
     * - favicon.ico
     * - các file ảnh phổ biến
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
