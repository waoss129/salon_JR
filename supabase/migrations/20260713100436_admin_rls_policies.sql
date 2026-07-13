-- ============================================================
-- RLS policies cho bills / bill_services
-- Role được phép: 1 (Admin), 5 (Receptionist/Lễ tân)
-- ============================================================

alter table public.bills enable row level security;
alter table public.bill_services enable row level security;

drop policy if exists "le_tan_select_bills" on public.bills;
create policy "le_tan_select_bills"
on public.bills for select
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (5, 1)
  )
);

drop policy if exists "le_tan_insert_bills" on public.bills;
create policy "le_tan_insert_bills"
on public.bills for insert
to authenticated
with check (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (5, 1)
  )
);

drop policy if exists "le_tan_update_bills" on public.bills;
create policy "le_tan_update_bills"
on public.bills for update
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (5, 1)
  )
)
with check (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (5, 1)
  )
);

drop policy if exists "le_tan_select_bill_services" on public.bill_services;
create policy "le_tan_select_bill_services"
on public.bill_services for select
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (5, 1)
  )
);

drop policy if exists "le_tan_insert_bill_services" on public.bill_services;
create policy "le_tan_insert_bill_services"
on public.bill_services for insert
to authenticated
with check (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (5, 1)
  )
);

-- ============================================================
-- RLS policies cho promotions / promotion_services
-- Quản lý (thêm/sửa/xóa): 1 (Admin), 2 (CEO), 3 (Manager)
-- Xem (chỉ đọc, cần để tự động áp khuyến mãi khi lập hóa đơn): thêm cả 5 (Receptionist)
-- ============================================================

alter table public.promotions enable row level security;
alter table public.promotion_services enable row level security;

drop policy if exists "quanly_select_promotions" on public.promotions;
create policy "quanly_select_promotions"
on public.promotions for select
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3, 5)
  )
);

drop policy if exists "quanly_insert_promotions" on public.promotions;
create policy "quanly_insert_promotions"
on public.promotions for insert
to authenticated
with check (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3)
  )
);

drop policy if exists "quanly_update_promotions" on public.promotions;
create policy "quanly_update_promotions"
on public.promotions for update
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3)
  )
)
with check (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3)
  )
);

drop policy if exists "quanly_delete_promotions" on public.promotions;
create policy "quanly_delete_promotions"
on public.promotions for delete
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3)
  )
);

drop policy if exists "quanly_select_promotion_services" on public.promotion_services;
create policy "quanly_select_promotion_services"
on public.promotion_services for select
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3, 5)
  )
);

drop policy if exists "quanly_insert_promotion_services" on public.promotion_services;
create policy "quanly_insert_promotion_services"
on public.promotion_services for insert
to authenticated
with check (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3)
  )
);

drop policy if exists "quanly_delete_promotion_services" on public.promotion_services;
create policy "quanly_delete_promotion_services"
on public.promotion_services for delete
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3)
  )
);

-- ============================================================
-- RLS policy cho roles
-- Chỉ chứa tên vai trò, không nhạy cảm -> cho mọi user đã đăng nhập đọc được
-- ============================================================

alter table public.roles enable row level security;

drop policy if exists "authenticated_select_roles" on public.roles;
create policy "authenticated_select_roles"
on public.roles for select
to authenticated
using (true);

-- ============================================================
-- Backfill dữ liệu cũ: services.status từng bị NULL do form không set giá trị
-- ============================================================

update public.services set status = 'active' where status is null;