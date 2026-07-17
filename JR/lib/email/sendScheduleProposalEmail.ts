"use server";

import { getMailTransporter } from "./transporter";

export type ProposalEmailShift = {
  date: string; // "YYYY-MM-DD"
  shiftLabel: string; // "Sáng" | "Chiều"
  isSpecial: boolean;
};

function formatDateVi(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
}

/**
 * Gửi mail báo cho nhân viên biết có lịch đề xuất tuần sau, kèm hạn chót
 * và link vào hệ thống để chọn/xác nhận ca.
 *
 * Không throw ra ngoài nếu gửi thất bại — trả về { success, error } để nơi
 * gọi tự quyết định xử lý (vd: vẫn giữ lại đề xuất đã tạo, chỉ báo cảnh báo
 * cho admin biết mail chưa gửi được, không rollback toàn bộ thao tác).
 */
export async function sendScheduleProposalEmail(input: {
  toEmail: string;
  employeeName: string;
  weekStart: string;
  weekEnd: string;
  deadlineIso: string;
  shifts: ProposalEmailShift[];
}): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = getMailTransporter();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const proposalUrl = `${siteUrl}/admin/schedule-proposal`;

    const deadline = new Date(input.deadlineIso).toLocaleString("vi-VN", {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });

    const shiftsHtml = input.shifts
      .map(
        (s) =>
          `<li>${formatDateVi(s.date)} — <strong>${s.shiftLabel}</strong>${
            s.isSpecial ? " (ca đặc biệt)" : ""
          }</li>`,
      )
      .join("");

    await transporter.sendMail({
      from: `"JoyRide Beauty Studio" <${process.env.GMAIL_USER}>`,
      to: input.toEmail,
      subject: `[JoyRide] Đề xuất lịch làm việc tuần ${input.weekStart} - ${input.weekEnd}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
          <h2 style="margin-bottom: 4px;">Xin chào ${input.employeeName},</h2>
          <p>Bạn vừa được đề xuất lịch làm việc cho tuần
            <strong>${input.weekStart} → ${input.weekEnd}</strong>:
          </p>
          <ul style="line-height: 1.8;">${shiftsHtml}</ul>
          <p>Vui lòng đăng nhập hệ thống để <strong>chọn/xác nhận</strong> các ca bạn sẽ làm,
             trước <strong>${deadline}</strong>.</p>
          <p style="color:#b45309;">
            Nếu bạn không vào chọn trước hạn, hệ thống sẽ tự động áp dụng toàn bộ ca đã đề xuất ở trên.
          </p>
          <p style="text-align:center; margin: 24px 0;">
            <a href="${proposalUrl}"
               style="background:#111;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
              Vào xem &amp; chọn ca
            </a>
          </p>
          <p style="font-size:12px;color:#999;">
            Đây là email tự động từ hệ thống JoyRide, vui lòng không trả lời email này.
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("sendScheduleProposalEmail error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Không thể gửi email.",
    };
  }
}
