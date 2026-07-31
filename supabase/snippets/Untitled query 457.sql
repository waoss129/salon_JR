update public.categories set status = 'active' where status is null;
update public.services set status = 'active' where status is null;

-- Kiểm tra lại ngay
select id, name, status from public.categories;