export function getBusinessHoursForDate(
  date: string,
): { start: number; end: number } | null {
  const [y, m, d] = date.split("-").map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  if (dow === 0 || dow === 6) return { start: 9, end: 17 }; // Thứ 7, Chủ nhật: 9h-17h
  return { start: 9, end: 21 }; // Thứ 2 - Thứ 6: 9h-21h
}

/**
 * Sinh danh sách khung giờ mỗi 1 tiếng, chừa 1 tiếng cuối trước giờ đóng cửa
 * để đủ thời gian phục vụ (vd đóng cửa 17h thì mốc cuối là 16h, không phải 17h).
 */
export function getTimeSlotsForDate(date: string): string[] {
  const hours = getBusinessHoursForDate(date);
  if (!hours) return [];
  const slots: string[] = [];
  for (let h = hours.start; h < hours.end; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  return slots;
}
