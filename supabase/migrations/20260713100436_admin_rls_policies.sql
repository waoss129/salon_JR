-- ============================================================
-- RLS cho bills / bill_services
-- Xem: role 1 (Admin), 2 (CEO), 3 (Manager), 5 (Receptionist)
-- Quản lý (thêm/sửa): role 1, 3, 5 — CEO (2) chỉ xem, không sửa
-- ============================================================

alter table public.bills enable row level security;
alter table public.bill_services enable row level security;

drop policy if exists "le_tan_select_bills" on public.bills;
drop policy if exists "xem_bills" on public.bills;
create policy "xem_bills"
on public.bills for select
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3, 5)
  )
);

drop policy if exists "le_tan_insert_bills" on public.bills;
drop policy if exists "quanly_insert_bills" on public.bills;
create policy "quanly_insert_bills"
on public.bills for insert
to authenticated
with check (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 3, 5)
  )
);

drop policy if exists "le_tan_update_bills" on public.bills;
drop policy if exists "quanly_update_bills" on public.bills;
create policy "quanly_update_bills"
on public.bills for update
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 3, 5)
  )
)
with check (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 3, 5)
  )
);

drop policy if exists "le_tan_select_bill_services" on public.bill_services;
drop policy if exists "xem_bill_services" on public.bill_services;
create policy "xem_bill_services"
on public.bill_services for select
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3, 5)
  )
);

drop policy if exists "le_tan_insert_bill_services" on public.bill_services;
drop policy if exists "quanly_insert_bill_services" on public.bill_services;
create policy "quanly_insert_bill_services"
on public.bill_services for insert
to authenticated
with check (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 3, 5)
  )
);

-- ============================================================
-- RLS cho promotions / promotion_services
-- Xem: role 1, 3, 5 (Admin, Manager, Receptionist)
-- Quản lý (thêm/sửa/xóa): chỉ role 1, 3 — CEO (2) không còn quyền quản lý khuyến mãi
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
    where e.id = auth.uid() and e.role_id in (1, 3, 5)
  )
);

drop policy if exists "quanly_insert_promotions" on public.promotions;
create policy "quanly_insert_promotions"
on public.promotions for insert
to authenticated
with check (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 3)
  )
);

drop policy if exists "quanly_update_promotions" on public.promotions;
create policy "quanly_update_promotions"
on public.promotions for update
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 3)
  )
)
with check (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 3)
  )
);

drop policy if exists "quanly_delete_promotions" on public.promotions;
create policy "quanly_delete_promotions"
on public.promotions for delete
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 3)
  )
);

drop policy if exists "quanly_select_promotion_services" on public.promotion_services;
create policy "quanly_select_promotion_services"
on public.promotion_services for select
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 3, 5)
  )
);

drop policy if exists "quanly_insert_promotion_services" on public.promotion_services;
create policy "quanly_insert_promotion_services"
on public.promotion_services for insert
to authenticated
with check (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 3)
  )
);

drop policy if exists "quanly_delete_promotion_services" on public.promotion_services;
create policy "quanly_delete_promotion_services"
on public.promotion_services for delete
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 3)
  )
);

-- ============================================================
-- RLS cho roles (không đổi — chỉ chứa tên vai trò, không nhạy cảm)
-- ============================================================

alter table public.roles enable row level security;

drop policy if exists "authenticated_select_roles" on public.roles;
create policy "authenticated_select_roles"
on public.roles for select
to authenticated
using (true);

-- ============================================================
-- RLS cho schedules: role 4 (Beautician) chỉ được UPDATE lịch CỦA CHÍNH MÌNH
-- (check-in/check-out), role 1,2,3 quản lý toàn bộ, role 5 chỉ xem
-- ============================================================

alter table public.schedules enable row level security;

drop policy if exists "xem_schedules" on public.schedules;
create policy "xem_schedules"
on public.schedules for select
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3, 4, 5)
  )
);

drop policy if exists "quanly_insert_schedules" on public.schedules;
create policy "quanly_insert_schedules"
on public.schedules for insert
to authenticated
with check (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3)
  )
);

-- Role 1,2,3: sửa mọi lịch. Role 4: CHỈ sửa đúng lịch có employee_id = chính mình.
drop policy if exists "quanly_update_schedules" on public.schedules;
create policy "quanly_update_schedules"
on public.schedules for update
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3)
  )
  or (
    employee_id = auth.uid()
    and exists (
      select 1 from public.employees e
      where e.id = auth.uid() and e.role_id = 4
    )
  )
)
with check (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3)
  )
  or (
    employee_id = auth.uid()
    and exists (
      select 1 from public.employees e
      where e.id = auth.uid() and e.role_id = 4
    )
  )
);

drop policy if exists "quanly_delete_schedules" on public.schedules;
create policy "quanly_delete_schedules"
on public.schedules for delete
to authenticated
using (
  exists (
    select 1 from public.employees e
    where e.id = auth.uid() and e.role_id in (1, 2, 3)
  )
);

-- ============================================================
-- Backfill dữ liệu cũ: services.status từng bị NULL do form không set giá trị
-- ============================================================

update public.services set status = 'active' where status is null;