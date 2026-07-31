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

SELECT id, name, day_of_week, shift_type FROM public.sessions ORDER BY id;