-- ============================================================
-- BACKFILL RIÊNG: schedules (Tháng 1 -> Tháng 8/2026)
-- An toàn chạy bất kể hiện trạng — có NOT EXISTS nên không tạo trùng
-- nếu 1 phần dữ liệu đã tồn tại từ trước.
-- ============================================================

insert into public.schedules (session_id, employee_id, date, status)
select se.id, e.id, d::date, 'completed'
from public.employees e
cross join generate_series(date '2026-01-01', date '2026-08-31', interval '1 day') as d
cross join public.sessions se
where e.role_id in (3, 4, 5)
  and se.day_of_week = extract(isodow from d)
  and extract(isodow from d) between 1 and 6
  and not exists (
    select 1 from public.schedules ex
    where ex.employee_id = e.id and ex.date = d::date and ex.session_id = se.id
  );

-- Kiểm tra lại
-- select date_trunc('month', date)::date as thang, count(*)
-- from public.schedules where date >= '2026-01-01'
-- group by thang order by thang;