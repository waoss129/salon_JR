// src/app/layout.tsx
import "./globals.css"; // Đảm bảo bạn có file này để import Tailwind

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="font-sans">
      <body className="font-sans">{children}</body>
    </html>
  );
}
