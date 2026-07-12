-- Cho phép user đã đăng nhập upload vào bucket avatars
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Cho phép user đã đăng nhập cập nhật/ghi đè ảnh trong bucket avatars
CREATE POLICY "Authenticated users can update avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

-- Cho phép mọi người (kể cả chưa đăng nhập) xem ảnh avatar công khai
CREATE POLICY "Public can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Cho phép user đã đăng nhập xoá ảnh trong bucket avatars (nếu cần thay ảnh mới)
CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');