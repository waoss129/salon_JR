-- Bước 1: Nếu lỡ có dữ liệu cũ mang status 'scheduled' (theo schema cũ),
-- đổi thành 'assigned' trước khi áp constraint mới, tránh vi phạm ngay lập tức
update public.schedules
set status = 'assigned'
where status = 'scheduled';

-- Bước 2: Xoá constraint cũ
alter table public.schedules
drop constraint if exists schedules_status_check;

-- Bước 3: Thêm constraint mới đúng theo type ScheduleStatus trong actions.ts
alter table public.schedules
add constraint schedules_status_check
check (status = any (array['assigned', 'checked_in', 'completed', 'absent', 'cancelled']));