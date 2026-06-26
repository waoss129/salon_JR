import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // Mở ra nếu bạn dùng Prisma

export async function GET() {
  try {
    // 1. ĐOẠN ĐỂ LẤY DATA THẬT TỪ DATABASE (Sau này bạn sẽ dùng dòng này):
    // const totalUsers = await prisma.user.count();
    // const successBookings = await prisma.booking.count({ where: { status: "SUCCESS" } });
    // const todayRevenue = await prisma.revenue.aggregate({ ... });

    // 2. HIỆN TẠI: Trả về cục JSON chuẩn để giao diện Dashboard đọc được
    const fakeDatabaseData = {
      totalUsers: 105,          // Thử đổi số này xem trên màn hình có nhảy không nhé
      successBookings: 189,     // Thử đổi số này
      todayRevenue: 5200000,    // Thử đổi số này
    };

    return NextResponse.json(fakeDatabaseData);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi kết nối database" }, { status: 500 });
  }
}