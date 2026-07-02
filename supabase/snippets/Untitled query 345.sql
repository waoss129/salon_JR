-- Lệnh này ép hệ thống đọc lại danh sách toàn bộ các bảng đang có trong schema public
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';