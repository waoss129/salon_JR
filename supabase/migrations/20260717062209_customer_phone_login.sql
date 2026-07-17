-- Chạy trong SQL Editor, hoặc supabase migration new customer_phone_login rồi paste vào

-- 0. Dọn dữ liệu cũ: chuỗi rỗng không phải là "không có SĐT" theo đúng
--    nghĩa NULL, nhưng lại làm unique index bên dưới coi là trùng nhau.
--    Coi chuỗi rỗng = chưa có SĐT, chuyển hết về NULL trước khi tạo index.
update public.profiles set phone = null where phone = '';

-- 1. SĐT phải duy nhất để tra cứu đăng nhập không bị nhầm người.
--    Dùng partial unique index (chỉ áp dụng khi phone khác NULL) vì các
--    profiles cũ (nhân viên tạo trước tính năng này) có thể chưa có SĐT.
create unique index if not exists profiles_phone_unique
  on public.profiles (phone)
  where phone is not null;

-- 2. Cập nhật trigger để lưu luôn "phone" từ metadata lúc đăng ký, giống
--    cách "fullname" đang được lưu. Giữ nguyên toàn bộ logic cũ, chỉ thêm
--    phone vào câu INSERT.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.raw_user_meta_data ? 'fullname' THEN
    INSERT INTO public.profiles (id, email, fullname, phone)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'fullname', ''),
      NEW.raw_user_meta_data->>'phone'
    )
    ON CONFLICT (id) DO NOTHING;

    IF COALESCE((NEW.raw_user_meta_data->>'is_staff')::boolean, false) = false THEN
      INSERT INTO public.customers (id, status)
      VALUES (NEW.id, 'active')
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;