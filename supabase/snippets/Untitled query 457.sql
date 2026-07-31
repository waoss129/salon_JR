-- Kiểm tra các policy hiện có trên bảng employees
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'employees';