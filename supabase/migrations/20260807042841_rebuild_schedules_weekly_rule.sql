-- ============================================================
-- SEED LẠI schedules: tối thiểu 4 ngày thường/tuần + 1 ngày cuối tuần
-- (Thứ 7) BẮT BUỘC. Mỗi nhân viên, mỗi tuần, random NGHỈ đúng 1 trong 5
-- ngày T2-T6. Chủ nhật luôn nghỉ.
--
-- Xoá sạch schedules 2026 trước (dữ liệu test, an toàn xoá) vì kiểm tra
-- cho thấy bảng đang trống — tránh xung đột với bất kỳ phần dữ liệu dở
-- dang nào còn sót lại từ lần chạy trước.
-- ============================================================

delete from public.schedules where date >= '2026-01-01' and date <= '2026-08-31';

do $$
declare
  emp record;
  week_start date;
  week_end date;
  skip_dow int;
  d date;
  dow int;
  sess_id bigint;
begin
  for emp in select id from public.employees where role_id in (3, 4, 5) loop
    -- Lùi về đúng Thứ 2 của tuần chứa 2026-01-01
    week_start := date '2026-01-01' - (extract(isodow from date '2026-01-01')::int - 1);

    while week_start <= date '2026-08-31' loop
      week_end := week_start + 6;
      -- Random 1 ngày NGHỈ trong tuần này (1=T2 ... 5=T6), riêng cho từng
      -- nhân viên, từng tuần — không phải cố định 1 ngày cho tất cả.
      skip_dow := 1 + floor(random() * 5)::int;

      d := week_start;
      while d <= week_end loop
        if d >= date '2026-01-01' and d <= date '2026-08-31' then
          dow := extract(isodow from d)::int;

          if dow between 1 and 5 and dow != skip_dow then
            -- Ngày thường ĐI LÀM: đủ cả ca SA + CH
            for sess_id in select id from public.sessions where day_of_week = dow loop
              insert into public.schedules (session_id, employee_id, date, status)
              values (sess_id, emp.id, d, 'completed');
            end loop;
          elsif dow = 6 then
            -- Thứ 7: BẮT BUỘC đi làm
            for sess_id in select id from public.sessions where day_of_week = 6 loop
              insert into public.schedules (session_id, employee_id, date, status)
              values (sess_id, emp.id, d, 'completed');
            end loop;
          end if;
          -- dow = 7 (CN) hoặc dow = skip_dow: không tạo gì -> đúng nghĩa "nghỉ"
        end if;
        d := d + 1;
      end loop;

      week_start := week_start + 7;
    end loop;
  end loop;
end $$;

-- Kiểm tra lại: mỗi tháng mỗi nhân viên nên có khoảng 21-23 ca hoàn thành
-- (4 ngày thường x ~4.3 tuần x 2 ca/ngày + ~4 Thứ 7 x 1 ca/ngày)
-- select date_trunc('month', date)::date as thang, count(*) 
-- from public.schedules where date >= '2026-01-01'
-- group by thang order by thang;