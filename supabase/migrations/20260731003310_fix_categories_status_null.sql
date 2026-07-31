-- Cùng bug đã từng xảy ra với services (xem migration admin_rls_policies.sql),
-- nay lặp lại ở categories: status NULL do chưa từng được set khi tạo danh mục.
update public.categories set status = 'active' where status is null;