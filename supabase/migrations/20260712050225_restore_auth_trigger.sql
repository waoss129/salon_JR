CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- 1. Luôn tạo profile
  INSERT INTO public.profiles (id, email, fullname)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'fullname', ''))
  ON CONFLICT (id) DO NOTHING;

  -- 2. Luôn tạo customer (vì ai đăng ký cũng là khách hàng)
  INSERT INTO public.customers (id, status)
  VALUES (new.id, 'active')
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$function$;

-- Gắn lại trigger (đã bị mất khi reset volume)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();