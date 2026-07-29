-- ============================================================
-- SEED: Dữ liệu ảo Doanh thu (Tháng 1 -> Tháng 6/2026)
-- Dùng cho: getMonthlyRevenue() ở app/admin/dashboard/queries.ts
--           (group theo bills.updated_at, chỉ tính status = 'paid')
--
-- ⚠️ KHÔNG idempotent — chạy lại sẽ tạo THÊM hoá đơn ảo mới (nhân đôi
-- dữ liệu), không tự phát hiện đã seed hay chưa. Chỉ chạy 1 lần.
-- Muốn xoá làm lại, xem phần XOÁ ở cuối file.
--
-- Cách chạy: dán vào Supabase SQL Editor, bấm Run.
-- ============================================================

do $$
declare
  cust_count int;
  target_customers int := 15;
  new_email text;
  m int;
  b int;
  bills_per_month int := 20;
  cust_ids uuid[];
  rand_customer uuid;
  rand_date date;
  rand_ts timestamptz;
  new_appointment_id uuid;
  new_bill_id uuid;
  svc record;
  num_services int;
  s int;
  running_total integer;
  days_in_month int;
begin
  -- 1. Đảm bảo có đủ khách hàng để gán hoá đơn/lịch hẹn ảo vào.
  --    Dùng đúng create_user_admin() hiện có -> đi đúng luồng trigger
  --    thật (tự tạo profiles + customers), không insert tay.
  select count(*) into cust_count from public.customers;
  if cust_count < target_customers then
    for b in (cust_count + 1)..target_customers loop
      new_email := 'seed_customer_' || b || '_' || extract(epoch from clock_timestamp())::bigint || '@example.test';
      perform public.create_user_admin(new_email, 'Seed@12345', 'Khách Test ' || b, false);
    end loop;
  end if;

  select array_agg(id) into cust_ids from public.customers;

  -- 2. Tạo appointments (completed) + bills (paid) + bill_services
  --    cho từng tháng 1 -> 6 năm 2026.
  for m in 1..6 loop
    days_in_month := extract(day from (make_date(2026, m, 1) + interval '1 month' - interval '1 day'))::int;

    for b in 1..bills_per_month loop
      rand_customer := cust_ids[1 + floor(random() * array_length(cust_ids, 1))::int];
      rand_date := make_date(2026, m, 1) + floor(random() * days_in_month)::int;
      rand_ts := rand_date::timestamp
        + (floor(random() * 24)::int || ' hours')::interval
        + (floor(random() * 60)::int || ' minutes')::interval;

      insert into public.appointments (customer_id, appointment_date, status)
      values (rand_customer, rand_ts, 'completed')
      returning id into new_appointment_id;

      insert into public.bills (appointment_id, total_price, discount_amount, status, created_at, updated_at)
      values (new_appointment_id, 0, 0, 'paid', rand_ts, rand_ts)
      returning id into new_bill_id;

      running_total := 0;
      num_services := 1 + floor(random() * 3)::int;

      for s in 1..num_services loop
        select id, price into svc
        from public.services
        where status = 'active'
        order by random()
        limit 1;

        if svc.id is not null then
          -- Không insert cột "subtotal" — đây là generated column
          -- (Postgres tự tính quantity * price_at_time), insert tay sẽ lỗi.
          insert into public.bill_services (bill_id, service_id, quantity, price_at_time)
          values (new_bill_id, svc.id, 1, svc.price);
          running_total := running_total + svc.price;
        end if;
      end loop;

      update public.bills set total_price = running_total where id = new_bill_id;
    end loop;
  end loop;
end $$;

-- ------------------------------------------------------------
-- 3. Kiểm tra lại sau khi chạy
-- ------------------------------------------------------------
-- select date_trunc('month', updated_at)::date as thang, sum(total_price) as doanh_thu
-- from public.bills
-- where status = 'paid' and updated_at >= '2026-01-01' and updated_at < '2026-07-01'
-- group by thang order by thang;

-- ------------------------------------------------------------
-- XOÁ dữ liệu ảo này nếu cần làm lại (bills tạo trong khoảng seed):
-- ------------------------------------------------------------
-- delete from public.bill_services where bill_id in (
--   select id from public.bills where updated_at >= '2026-01-01' and updated_at < '2026-07-01'
-- );
-- delete from public.appointments where id in (
--   select appointment_id from public.bills where updated_at >= '2026-01-01' and updated_at < '2026-07-01'
-- );
-- delete from public.bills where updated_at >= '2026-01-01' and updated_at < '2026-07-01';