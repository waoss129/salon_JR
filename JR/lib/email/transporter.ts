import nodemailer from "nodemailer";

// Dùng chung 1 transporter cho toàn bộ hệ thống — chỉ cần GMAIL_USER +
// GMAIL_APP_PASSWORD trong .env.local (App Password, KHÔNG phải mật khẩu
// đăng nhập Gmail thường — xem hướng dẫn tạo ở phần trước).
export function getMailTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "Thiếu cấu hình GMAIL_USER / GMAIL_APP_PASSWORD trong .env.local — không thể gửi mail.",
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}
