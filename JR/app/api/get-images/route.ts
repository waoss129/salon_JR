import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder');

  if (!folder) {
    return NextResponse.json({ images: [] });
  }

  try {
    // Xác định đường dẫn đến thư mục public/images/[folder]
    const dirPath = path.join(process.cwd(), 'public', 'images', folder);
    
    // Nếu thư mục chưa tồn tại trên máy, trả về mảng rỗng thay vì làm sập trang
    if (!fs.existsSync(dirPath)) {
      return NextResponse.json({ images: [] });
    }

    const files = fs.readdirSync(dirPath);

    // Quét sạch các file đuôi ảnh thông dụng
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file))
      .map(file => `/images/${folder}/${file}`);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Lỗi quét thư mục:", error);
    return NextResponse.json({ images: [] });
  }
}