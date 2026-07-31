create policy "Cho phép xem promotions đang active"
on promotions for select
to authenticated, anon
using (is_active = true);