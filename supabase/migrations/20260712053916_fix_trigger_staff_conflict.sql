CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Chỉ tự động tạo profile + customer khi user tự đăng ký qua web
  -- (nhận diện qua raw_user_meta_data có key 'fullname', do signUp() truyền vào)
  -- Nhân viên tạo qua create_staff() không có key này nên sẽ được bỏ qua ở đây,
  -- để create_staff() tự xử lý insert profiles/employees của riêng nó.
  IF NEW.raw_user_meta_data ? 'fullname' THEN
    INSERT INTO public.profiles (id, email, fullname)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'fullname', ''))
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.customers (id, status)
    VALUES (NEW.id, 'active')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;