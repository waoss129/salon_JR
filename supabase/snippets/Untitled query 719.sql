-- Kiểm tra cấu trúc cột
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name IN ('dob', 'gender');