-- Chạy: supabase migration new employee_base_salary rồi paste vào, hoặc SQL Editor

-- Thêm lương cứng theo tháng (VNĐ), admin tự đặt riêng cho từng nhân viên
alter table public.employees
  add column if not exists base_salary integer not null default 0;

comment on column public.employees.base_salary is
  'Lương cứng theo tháng (VNĐ). Dùng để tính thống kê lương tại /admin/statistics/payroll — thay thế hoàn toàn cho hourly_rate (mô hình cũ theo giờ, không còn dùng).';

-- hourly_rate của migration trước giờ không còn dùng trong tính lương nữa.
-- Không xoá vội (phòng trường hợp có chỗ khác đang tham chiếu) — nếu bạn
-- xác nhận không còn nơi nào dùng, chạy thêm dòng dưới đây riêng:
-- alter table public.employees drop column if exists hourly_rate;