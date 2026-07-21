-- Chạy: supabase migration new add_salary_history rồi paste vào, hoặc SQL Editor

-- ============================================================
-- Bảng lưu lịch sử thay đổi lương cứng của nhân viên — thay thế cho
-- employees.base_salary (chỉ lưu được 1 mức lương duy nhất, không có
-- lịch sử). Mỗi lần đổi lương -> thêm 1 dòng mới với effective_from
-- tương ứng, KHÔNG sửa/xoá dòng cũ (giữ nguyên lịch sử).
-- ============================================================
create table public.salary_history (
  id uuid not null default gen_random_uuid(),
  employee_id uuid not null,
  base_salary integer not null,
  effective_from date not null,
  created_by uuid,
  created_at timestamp with time zone not null default now(),
  constraint salary_history_pkey primary key (id),
  constraint salary_history_employee_id_fkey foreign key (employee_id) references public.employees(id),
  constraint salary_history_created_by_fkey foreign key (created_by) references public.employees(id),
  -- Mỗi nhân viên chỉ được 1 mức lương hiệu lực trong 1 ngày — tránh 2 dòng
  -- cùng effective_from gây mơ hồ khi xác định lương hiện tại.
  constraint salary_history_employee_effective_unique unique (employee_id, effective_from)
);

comment on table public.salary_history is
  'Lịch sử thay đổi lương cứng của nhân viên. Lương "hiện tại" của 1 nhân viên = dòng có effective_from gần nhất nhưng <= hôm nay, cho employee_id đó.';

comment on column public.salary_history.base_salary is
  'Mức lương cứng theo tháng (VNĐ), áp dụng từ effective_from cho tới khi có dòng kế tiếp (effective_from mới hơn) của cùng employee_id.';

comment on column public.salary_history.created_by is
  'Admin/CEO đã thực hiện thay đổi. Có thể NULL — ví dụ các dòng được migrate tự động từ employees.base_salary cũ, không có người thực hiện cụ thể.';

-- Di chuyển dữ liệu lương hiện có (employees.base_salary) sang bảng lịch sử
-- TRƯỚC KHI xoá cột — tránh mất dữ liệu lương đang có của nhân viên hiện tại.
-- effective_from ưu tiên joined_at (ngày vào làm); nếu nhân viên chưa có
-- joined_at thì fallback về ngày tạo record (created_at).
insert into public.salary_history (employee_id, base_salary, effective_from, created_by, created_at)
select
  id as employee_id,
  base_salary,
  coalesce(joined_at, created_at::date) as effective_from,
  null as created_by,
  now() as created_at
from public.employees;

-- base_salary giờ sống ở salary_history (có lịch sử), không còn ở
-- employees nữa (chỉ lưu được 1 giá trị duy nhất, không đủ cho yêu cầu
-- lưu lịch sử thay đổi lương).
alter table public.employees
  drop column if exists base_salary;