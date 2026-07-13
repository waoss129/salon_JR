-- ===== SCHEDULES =====
create policy "Nhan vien dang nhap co the tao lich lam viec"
on public.schedules for insert to authenticated
with check (exists (select 1 from public.employees e where e.id = auth.uid()));

create policy "Nhan vien dang nhap co the sua lich lam viec"
on public.schedules for update to authenticated
using (exists (select 1 from public.employees e where e.id = auth.uid()))
with check (exists (select 1 from public.employees e where e.id = auth.uid()));

create policy "Nhan vien dang nhap co the xoa lich lam viec"
on public.schedules for delete to authenticated
using (exists (select 1 from public.employees e where e.id = auth.uid()));

-- ===== APPOINTMENTS =====
create policy "Khach hang xem lich hen cua minh"
on public.appointments for select to authenticated
using (customer_id = auth.uid());

create policy "Khach hang tao lich hen cho minh"
on public.appointments for insert to authenticated
with check (customer_id = auth.uid());

create policy "Khach hang tu huy lich hen cua minh"
on public.appointments for update to authenticated
using (customer_id = auth.uid())
with check (customer_id = auth.uid());

create policy "Admin xem tat ca lich hen"
on public.appointments for select to authenticated
using (exists (select 1 from public.employees e where e.id = auth.uid()));

create policy "Admin sua tat ca lich hen"
on public.appointments for update to authenticated
using (exists (select 1 from public.employees e where e.id = auth.uid()))
with check (exists (select 1 from public.employees e where e.id = auth.uid()));

-- ===== DETAILS =====
create policy "Khach hang xem details cua minh"
on public.details for select to authenticated
using (exists (select 1 from public.appointments a where a.id = details.appointment_id and a.customer_id = auth.uid()));

create policy "Khach hang tao details cho minh"
on public.details for insert to authenticated
with check (exists (select 1 from public.appointments a where a.id = details.appointment_id and a.customer_id = auth.uid()));

create policy "Admin xem tat ca details"
on public.details for select to authenticated
using (exists (select 1 from public.employees e where e.id = auth.uid()));

-- ===== SESSIONS =====
create policy "Ai cung xem duoc sessions"
on public.sessions for select to authenticated, anon
using (true);