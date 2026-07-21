"use server";

import { getMailTransporter } from "./transporter";

export type ConfirmedEmailShift = {
  date: string;
  shiftLabel: string;
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

export async function sendScheduleConfirmedEmail(input: {
  toEmail: string;
  employeeName: string;
  shifts: ConfirmedEmailShift[];
}): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = getMailTransporter();

    const shiftsHtml = input.shifts
      .map(
        (s) =>
          `<li>${formatDateVi(s.date)} — <strong>${s.shiftLabel}</strong>${
            s.isSpecial ? " (cuối tuần)" : ""
          }</li>`,
      )
      .join("");

    await transporter.sendMail({
      from: `"JoyRide Beauty Studio" <${process.env.GMAIL_USER}>`,
      to: input.toEmail,
      subject: `[JoyRide] Lịch làm việc tuần sau đã được xác nhận`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
          <h2 style="margin-bottom: 4px;">Xin chào ${input.employeeName},</h2>
          <p>Lịch làm việc tuần sau của bạn đã được <strong>Admin xác nhận</strong>:</p>
          <ul style="line-height: 1.8;">${shiftsHtml}</ul>
          <p>Vui lòng đến đúng ca và check-in trên hệ thống khi bắt đầu làm việc.</p>
          <p style="font-size:12px;color:#999;">
            Đây là email tự động từ hệ thống JoyRide, vui lòng không trả lời email này.
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("sendScheduleConfirmedEmail error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Không thể gửi email.",
    };
  }
}
