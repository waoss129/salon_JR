-- 1. Bật Row Level Security bảo mật cho bảng profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Xóa sạch tất cả các chính sách (policy) cũ để tránh xung đột quyền
DROP POLICY IF EXISTS "Allow anonymous insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow system to insert profiles" ON public.profiles;

-- 3. CẤP QUYỀN SELECT: Cho phép tất cả User đã đăng nhập được xem hồ sơ của chính họ (Để load thông tin lên ô Input)
CREATE POLICY "Allow users to read their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 4. CẤP QUYỀN UPDATE: Cho phép tất cả User đã đăng nhập được sửa hồ sơ của chính họ (Để bấm Lưu thay đổi không bị lỗi)
CREATE POLICY "Allow users to update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5. CẤP QUYỀN INSERT: Giữ nguyên quyền tạo mới cho Trigger/Đăng ký tài khoản
CREATE POLICY "Allow system to insert profiles"
ON public.profiles FOR INSERT
WITH CHECK (true);