-- ============================================================
-- Sửa policy UPDATE của appointments: loại role 4 (Beautician) ra,
-- chỉ role 1, 2, 3, 5 được sửa lịch hẹn (đúng permissions.ts).
-- ============================================================
drop policy if exists "Admin sua tat ca lich hen" on public.appointments;
create policy "Admin sua tat ca lich hen"
on public.appointments for update
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3, 5)
  )
)
with check (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3, 5)
  )
);

-- ============================================================
-- Sửa policy SELECT của customers: loại role 4 ra, chỉ role 1, 2, 3, 5
-- được xem danh sách khách hàng (đúng permissions.ts, customers.view).
-- ============================================================
drop policy if exists "Admin xem tat ca customers" on public.customers;
create policy "Admin xem tat ca customers"
on public.customers for select
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3, 5)
  )
);