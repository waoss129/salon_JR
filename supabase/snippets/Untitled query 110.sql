CREATE POLICY "Admin có toàn quyền với bảng profiles" ON profiles
FOR ALL TO authenticated
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);