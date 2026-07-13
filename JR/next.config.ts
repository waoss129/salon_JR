import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Không để lỗi ESLint (vd: no-explicit-any) chặn `next build`.
    // Vẫn nên dọn dần các lỗi này khi có thời gian, chỉ là không bắt buộc phải xong ngay.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
