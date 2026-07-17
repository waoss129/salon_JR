-- Chạy trong SQL Editor của Supabase (hoặc supabase migration nếu bạn dùng CLI)

-- 1. Cột khoá email trên profiles: mặc định false, chỉ được set true đúng 1 lần
--    (lúc nhân viên kích hoạt tài khoản), sau đó không ai sửa được email nữa.
alter table public.profiles
  add column if not exists email_locked boolean not null default false;

-- 2. Bảng lưu token kích hoạt tài khoản nhân viên
create table if not exists public.employee_activation_tokens (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_activation_tokens_employee_id
  on public.employee_activation_tokens(employee_id);

-- 3. Trigger chặn đổi email khi email_locked = true, bất kể ai gọi update
--    (kể cả admin qua Supabase Dashboard, hay bug trong code)
create or replace function public.prevent_email_change()
returns trigger as $$
begin
  if OLD.email_locked = true and NEW.email is distinct from OLD.email then
    raise exception 'Email đã bị khoá, không thể thay đổi';
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists lock_email_after_activation on public.profiles;
create trigger lock_email_after_activation
  before update on public.profiles
  for each row execute function public.prevent_email_change();

-- 4. Cấp quyền cần thiết
grant select, insert, update on public.employee_activation_tokens to authenticated;
grant select on public.employee_activation_tokens to anon; -- cần để verify token lúc chưa đăng nhập

-- 5. RLS cho bảng token — chỉ đọc được token của chính mình qua server action
--    (server action dùng service role nên tự bỏ qua RLS, dòng dưới đây chủ
--    yếu để phòng trường hợp gọi trực tiếp từ client)
alter table public.employee_activation_tokens enable row level security;

create policy "No direct client access to activation tokens"
  on public.employee_activation_tokens
  for all
  to anon, authenticated
  using (false);