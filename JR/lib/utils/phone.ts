/**
 * Chuẩn hoá số điện thoại về dạng "0xxxxxxxxx" (10 số, bắt đầu bằng 0) —
 * loại bỏ khoảng trắng, dấu gạch ngang, và tự chuyển tiền tố +84/84 về 0.
 * Ném lỗi nếu không đúng định dạng số di động Việt Nam.
 */
export function normalizeVietnamesePhone(input: string): string {
  let digits = input.replace(/[\s\-().]/g, "");

  if (digits.startsWith("+84")) {
    digits = "0" + digits.slice(3);
  } else if (digits.startsWith("84") && digits.length === 11) {
    digits = "0" + digits.slice(2);
  }

  if (!/^0\d{9}$/.test(digits)) {
    throw new Error(
      "Số điện thoại không hợp lệ (cần đúng 10 số, bắt đầu bằng 0)",
    );
  }

  return digits;
}
