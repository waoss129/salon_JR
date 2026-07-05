import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Trả về response mặc định, không chặn bất cứ thứ gì
  return NextResponse.next();
}

// Bạn vẫn giữ config matcher để sau này bật lại là nó tự áp dụng
export const config = {
  matcher: ["/admin/:path*"],
};
