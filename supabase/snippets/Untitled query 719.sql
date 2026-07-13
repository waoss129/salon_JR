create policy "Admin xem tat ca customers"
on public.customers
for select
to authenticated
using (exists (select 1 from public.employees e where e.id = auth.uid()));