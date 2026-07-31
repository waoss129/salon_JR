-- Thêm 2 cột còn thiếu vào bảng sessions
alter table public.sessions
  add column if not exists day_of_week smallint,
  add column if not exists shift_type text;

alter table public.sessions
  drop constraint if exists sessions_day_of_week_check;
alter table public.sessions
  add constraint sessions_day_of_week_check
  check (day_of_week is null or (day_of_week between 1 and 7));

alter table public.sessions
  drop constraint if exists sessions_shift_type_check;
alter table public.sessions
  add constraint sessions_shift_type_check
  check (shift_type is null or shift_type in ('SA', 'CH'));

-- Tự động điền dữ liệu dựa theo quy luật đặt tên hiện có: "SA T2", "CH T3", "SA CN"...
-- SA/CH = phần đầu tên (shift_type), T2..T7/CN = phần sau (day_of_week: 1=Thứ2...6=Thứ7,7=CN)
update public.sessions set
  shift_type = split_part(name, ' ', 1),
  day_of_week = case split_part(name, ' ', 2)
    when 'T2' then 1
    when 'T3' then 2
    when 'T4' then 3
    when 'T5' then 4
    when 'T6' then 5
    when 'T7' then 6
    when 'CN' then 7
    else null
  end
where day_of_week is null;