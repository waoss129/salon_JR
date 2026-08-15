-- Bỏ ràng buộc UNIQUE cũ (áp dụng cho MỌI dòng, kể cả đã cancelled — đây là bug)
ALTER TABLE public.shift_registrations
  DROP CONSTRAINT IF EXISTS shift_registrations_unique;

-- Thay bằng UNIQUE INDEX có điều kiện — chỉ áp dụng cho dòng CHƯA bị hủy.
-- Nhờ vậy: 1 người có thể đăng ký → hủy → đăng ký lại cùng 1 ca thoải mái,
-- mỗi lần chỉ có tối đa 1 dòng "đang hoạt động" cho mỗi (nhân viên, ca, ngày),
-- còn lịch sử các lần hủy trước vẫn được giữ lại (không bị ràng buộc chặn).
CREATE UNIQUE INDEX IF NOT EXISTS shift_registrations_active_unique
  ON public.shift_registrations (employee_id, session_id, date)
  WHERE status <> 'cancelled';