// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 1. Khởi tạo Supabase Client dành riêng cho môi trường Server/Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 2. Lấy thông tin user hiện tại từ Supabase Session thực tế
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // 3. LOGIC ĐIỀU HƯỚNG THÔNG MINH (Giống Facebook):

  // Trường hợp: Đã đăng nhập rồi mà cố tình truy cập trang Login
  if (url.pathname === "/admin/login" && user) {
    url.pathname = "/admin/dashboard"; // Điều hướng thẳng vào dashboard
    return NextResponse.redirect(url);
  }

  // Trường hợp: Chưa đăng nhập mà đòi vào các trang quản trị bên trong
  if (url.pathname.startsWith("/admin/dashboard") && !user) {
    url.pathname = "/admin/login"; // Đá ngược ra trang đăng nhập
    return NextResponse.redirect(url);
  }

  return response;
}

// Chỉ quét các đường dẫn thuộc phân hệ Admin để tối ưu hiệu năng
export const config = {
  matcher: ["/admin/:path*"],
};
