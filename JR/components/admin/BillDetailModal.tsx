"use client";

// Cần cài thư viện tạo QR: npm install qrcode
// (và nếu dùng TypeScript nghiêm ngặt: npm install -D @types/qrcode)
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import {
  confirmBillPayment,
  getBillDetail,
  type BillDetail,
  type BillStatus,
} from "@/app/admin/bills/actions";

const STATUS_LABEL: Record<BillStatus, string> = {
  unpaid: "Chưa thanh toán",
  paid: "Đã thanh toán",
  refunded: "Đã hoàn tiền",
};

const GENDER_LABEL: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
  prefer_not_to_say: "Không muốn tiết lộ",
};

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

function formatDate(value: string | null, withTime = true) {
  if (!value) return "—";
  const date = new Date(value);
  return withTime
    ? date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : date.toLocaleDateString("vi-VN");
}

function shortId(id?: string | null) {
  return id ? `#${id.slice(0, 8).toUpperCase()}` : "—";
}

// Phân bổ discount_amount (1 số cho cả hóa đơn) xuống từng dòng dịch vụ theo
// tỷ lệ subtotal, để cột "Thành tiền" cộng lại đúng bằng "Tổng tiền".
// Dòng cuối nhận phần dư của phép chia để tránh lệch do làm tròn.
function allocateDiscountToLines<T extends { subtotal: number }>(
  lines: T[],
  discountAmount: number,
): (T & { finalAmount: number })[] {
  const totalSubtotal = lines.reduce((sum, l) => sum + l.subtotal, 0);
  if (totalSubtotal <= 0 || discountAmount <= 0) {
    return lines.map((l) => ({ ...l, finalAmount: l.subtotal }));
  }

  let allocatedSoFar = 0;
  return lines.map((line, idx) => {
    const isLast = idx === lines.length - 1;
    const share = isLast
      ? discountAmount - allocatedSoFar
      : Math.round((line.subtotal / totalSubtotal) * discountAmount);
    allocatedSoFar += share;
    return { ...line, finalAmount: line.subtotal - share };
  });
}

export default function BillDetailModal({
  billId,
  onClose,
  onUpdated,
}: {
  billId: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await getBillDetail(billId);
      if (error || !data) {
        setError(error ?? "Không tìm thấy hóa đơn.");
      } else {
        setBill(data);
      }
      setLoading(false);
    })();
  }, [billId]);

  // Sinh QR chứa mã hóa đơn + tổng tiền cuối cùng.
  useEffect(() => {
    if (!bill) return;
    const qrText = `HĐ ${shortId(bill.id)} - Tổng tiền: ${formatCurrency(bill.total_price)}`;
    QRCode.toDataURL(qrText, { margin: 1, width: 220 })
      .then(setQrDataUrl)
      .catch((err) => console.error("Tạo QR thất bại:", err));
  }, [bill]);

  const adjustedLines = bill
    ? allocateDiscountToLines(bill.lines, bill.discount_amount)
    : [];

  async function handleConfirmPayment() {
    if (!bill) return;
    setConfirming(true);
    const { data, error } = await confirmBillPayment(bill.id);
    setConfirming(false);
    if (error) {
      setError(error);
      return;
    }
    if (data) {
      setBill({ ...bill, status: data.status });
      onUpdated();
    }
  }

  function handlePrint() {
    if (!bill || !qrDataUrl) return;
    const profile = bill.appointments?.customers?.profiles;

    const rowsHtml = adjustedLines
      .map(
        (line, idx) => `
        <tr>
          <td style="padding:4px 8px;border:1px solid #ddd;text-align:center;">${idx + 1}</td>
          <td style="padding:4px 8px;border:1px solid #ddd;">${line.services?.categories?.name ?? "—"}</td>
          <td style="padding:4px 8px;border:1px solid #ddd;">${line.services?.name ?? "—"}</td>
          <td style="padding:4px 8px;border:1px solid #ddd;text-align:center;">${line.quantity}</td>
          <td style="padding:4px 8px;border:1px solid #ddd;text-align:right;">${formatCurrency(line.price_at_time)}</td>
          <td style="padding:4px 8px;border:1px solid #ddd;text-align:right;">${formatCurrency(line.finalAmount)}</td>
        </tr>`,
      )
      .join("");

    const printWindow = window.open("", "_blank", "width=700,height=900");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn ${shortId(bill.id)}</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
            h1 { font-size: 18px; margin-bottom: 4px; }
            table { border-collapse: collapse; width: 100%; margin-top: 12px; font-size: 13px; }
            th { background: #f5f5f5; }
            .row { display: flex; justify-content: space-between; margin: 4px 0; font-size: 13px; }
            .total { font-size: 16px; font-weight: bold; margin-top: 12px; text-align: right; }
            .qr { text-align: center; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>HÓA ĐƠN ${shortId(bill.id)}</h1>
          <div class="row"><span>Khách hàng:</span><span>${profile?.fullname ?? "—"}</span></div>
          <div class="row"><span>SĐT:</span><span>${profile?.phone ?? "—"}</span></div>
          <div class="row"><span>Ngày lập:</span><span>${formatDate(bill.created_at)}</span></div>
          <div class="row"><span>Phương thức:</span><span>Tiền mặt</span></div>
          <table>
            <thead>
              <tr>
                <th style="border:1px solid #ddd;padding:4px 8px;">STT</th>
                <th style="border:1px solid #ddd;padding:4px 8px;">Danh mục</th>
                <th style="border:1px solid #ddd;padding:4px 8px;">Dịch vụ</th>
                <th style="border:1px solid #ddd;padding:4px 8px;">SL</th>
                <th style="border:1px solid #ddd;padding:4px 8px;">Đơn giá</th>
                <th style="border:1px solid #ddd;padding:4px 8px;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          <div class="total">Tổng tiền: ${formatCurrency(bill.total_price)}</div>
          <div style="text-align:right;font-size:11px;color:#888;margin-top:2px;">(Đã bao gồm thuế VAT)</div>
          <div class="qr">
            <img src="${qrDataUrl}" width="180" height="180" />
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => printWindow.print();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Chi tiết hóa đơn
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          {loading ? (
            <p className="text-center text-gray-400">Đang tải...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : bill ? (
            <>
              {/* Thông tin khách hàng */}
              <section>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Thông tin khách hàng
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <Field
                    label="Mã khách hàng"
                    value={shortId(bill.appointments?.customers?.id)}
                  />
                  <Field
                    label="Họ và tên"
                    value={
                      bill.appointments?.customers?.profiles?.fullname ?? "—"
                    }
                  />
                  <Field
                    label="Ngày sinh"
                    value={formatDate(
                      bill.appointments?.customers?.profiles?.dob ?? null,
                      false,
                    )}
                  />
                  <Field
                    label="Giới tính"
                    value={
                      bill.appointments?.customers?.profiles?.gender
                        ? GENDER_LABEL[
                            bill.appointments.customers.profiles.gender
                          ]
                        : "—"
                    }
                  />
                  <Field
                    label="Số điện thoại"
                    value={bill.appointments?.customers?.profiles?.phone ?? "—"}
                  />
                </div>
              </section>

              {/* Thông tin hóa đơn */}
              <section>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Thông tin hóa đơn
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <Field label="Mã hóa đơn" value={shortId(bill.id)} />
                  <Field label="Ngày lập" value={formatDate(bill.created_at)} />
                  <Field label="Trạng thái" value={STATUS_LABEL[bill.status]} />
                  <Field label="Người lập" value="—" />
                </div>
              </section>

              {/* Thông tin thanh toán */}
              <section>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Thông tin thanh toán
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <Field
                    label="Tạm tính"
                    value={formatCurrency(
                      bill.total_price + bill.discount_amount,
                    )}
                  />
                  <Field label="Phương thức" value="Tiền mặt" />
                  <Field
                    label="Khuyến mãi áp dụng"
                    value={
                      bill.promotions
                        ? `${bill.promotions.code} (${bill.promotions.name}) − ${formatCurrency(bill.discount_amount)}`
                        : bill.discount_amount > 0
                          ? `Giảm ${formatCurrency(bill.discount_amount)}`
                          : "Không có"
                    }
                  />
                  <Field
                    label="Tổng tiền"
                    value={formatCurrency(bill.total_price)}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  (Đã bao gồm thuế VAT)
                </p>
              </section>

              {/* Dịch vụ thực hiện */}
              <section>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Dịch vụ thực hiện
                </h3>
                <div className="overflow-hidden rounded-md border border-gray-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-500">
                          STT
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500">
                          Danh mục
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500">
                          Dịch vụ
                        </th>
                        <th className="px-3 py-2 text-center font-medium text-gray-500">
                          SL
                        </th>
                        <th className="px-3 py-2 text-right font-medium text-gray-500">
                          Đơn giá
                        </th>
                        <th className="px-3 py-2 text-right font-medium text-gray-500">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {adjustedLines.map((line, idx) => (
                        <tr key={line.id}>
                          <td className="px-3 py-2">{idx + 1}</td>
                          <td className="px-3 py-2">
                            {line.services?.categories?.name ?? "—"}
                          </td>
                          <td className="px-3 py-2">
                            {line.services?.name ?? "—"}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {line.quantity}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {formatCurrency(line.price_at_time)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {formatCurrency(line.finalAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Preview QR */}
              {qrDataUrl && (
                <section className="flex flex-col items-center gap-2 pt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt="QR hóa đơn"
                    width={140}
                    height={140}
                  />
                  <p className="text-xs text-gray-400">
                    Quét để xem mã hóa đơn &amp; tổng tiền
                  </p>
                </section>
              )}
            </>
          ) : null}
        </div>

        {bill && (
          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Đóng
            </button>
            {bill.status === "unpaid" && (
              <button
                onClick={handleConfirmPayment}
                disabled={confirming}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {confirming ? "Đang xác nhận..." : "Xác nhận thanh toán"}
              </button>
            )}
            <button
              onClick={handlePrint}
              disabled={!qrDataUrl}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              In hóa đơn
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}