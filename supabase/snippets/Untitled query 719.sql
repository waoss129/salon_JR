-- 1. Đảm bảo RLS được bật (nếu chưa)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 2. Xóa các chính sách cũ (nếu có lỗi trùng lặp)
DROP POLICY IF EXISTS "Service role full access" ON public.customers;

-- 3. Tạo chính sách mới: Cho phép service_role (Admin) toàn quyền trên bảng
CREATE POLICY "Service role full access" ON public.customers
FOR ALL TO service_role USING (true) WITH CHECK (true);