-- ============================================================
-- Đề xuất lịch làm việc tuần sau: admin đề xuất -> nhân viên chọn -> admin chốt
-- Không đụng tới bảng `schedules` hiện có — chỉ ghi vào `schedules` ở bước
-- admin chốt cuối cùng (xem Giai đoạn C).
-- ============================================================

create table if not exists public.schedule_proposal_batches (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id),
  week_start date not null,
  week_end date not null,
  deadline timestamptz not null,
  -- awaiting_employee: chờ nhân viên chọn
  -- awaiting_admin: nhân viên đã chọn xong (hoặc đã quá hạn, áp dụng mặc định), chờ admin chốt
  -- confirmed: admin đã chốt, đã copy sang bảng schedules thật
  status text not null default 'awaiting_employee'
    check (status in ('awaiting_employee', 'awaiting_admin', 'confirmed')),
  proposed_by uuid references public.employees(id),
  employee_responded_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, week_start)
);

create table if not exists public.schedule_proposal_items (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.schedule_proposal_batches(id) on delete cascade,
  session_id bigint not null references public.sessions(id),
  date date not null,
  shift_type text not null check (shift_type in ('regular', 'special')),
  -- Mặc định true: nếu nhân viên không vào chọn gì trước hạn, giữ nguyên
  -- true hết = tự động áp dụng toàn bộ ca admin đã đề xuất.
  is_selected boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (batch_id, date)
);

alter table public.schedule_proposal_batches enable row level security;
alter table public.schedule_proposal_items enable row level security;

-- ===== Batches =====

drop policy if exists "admin_all_batches" on public.schedule_proposal_batches;
create policy "admin_all_batches"
on public.schedule_proposal_batches for all
to authenticated
using (
  exists (select 1 from public.employees e where e.id = auth.uid() and e.role_id in (1, 2, 3))
)
with check (
  exists (select 1 from public.employees e where e.id = auth.uid() and e.role_id in (1, 2, 3))
);

drop policy if exists "employee_select_own_batch" on public.schedule_proposal_batches;
create policy "employee_select_own_batch"
on public.schedule_proposal_batches for select
to authenticated
using (employee_id = auth.uid());

drop policy if exists "employee_update_own_batch" on public.schedule_proposal_batches;
create policy "employee_update_own_batch"
on public.schedule_proposal_batches for update
to authenticated
using (employee_id = auth.uid() and deadline > now())
with check (employee_id = auth.uid());

-- ===== Items =====

drop policy if exists "admin_all_items" on public.schedule_proposal_items;
create policy "admin_all_items"
on public.schedule_proposal_items for all
to authenticated
using (
  exists (select 1 from public.employees e where e.id = auth.uid() and e.role_id in (1, 2, 3))
)
with check (
  exists (select 1 from public.employees e where e.id = auth.uid() and e.role_id in (1, 2, 3))
);

drop policy if exists "employee_select_own_items" on public.schedule_proposal_items;
create policy "employee_select_own_items"
on public.schedule_proposal_items for select
to authenticated
using (
  exists (
    select 1 from public.schedule_proposal_batches b
    where b.id = batch_id and b.employee_id = auth.uid()
  )
);

drop policy if exists "employee_update_own_items" on public.schedule_proposal_items;
create policy "employee_update_own_items"
on public.schedule_proposal_items for update
to authenticated
using (
  exists (
    select 1 from public.schedule_proposal_batches b
    where b.id = batch_id and b.employee_id = auth.uid() and b.deadline > now()
  )
)
with check (
  exists (
    select 1 from public.schedule_proposal_batches b
    where b.id = batch_id and b.employee_id = auth.uid()
  )
);
-- Cho phép 1 ngày có nhiều dòng (SA + CH) trong cùng 1 batch đề xuất,
-- thay vì giới hạn 1 dòng/ngày như trước.
alter table public.schedule_proposal_items
  drop constraint if exists schedule_proposal_items_batch_id_date_key;

alter table public.schedule_proposal_items
  add constraint schedule_proposal_items_batch_date_session_key
  unique (batch_id, date, session_id);