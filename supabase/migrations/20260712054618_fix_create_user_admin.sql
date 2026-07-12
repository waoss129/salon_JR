CREATE OR REPLACE FUNCTION public.create_user_admin(
  new_email text,
  new_password text,
  new_fullname text,
  is_staff boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  new_user_id uuid;
BEGIN
  INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data
  )
  VALUES (
    extensions.uuid_generate_v4(),
    new_email,
    crypt(new_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('fullname', new_fullname, 'is_staff', is_staff)
  )
  RETURNING id INTO new_user_id;

  RETURN new_user_id;
END;
$function$;



CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Chỉ xử lý khi có 'fullname' trong metadata (tức là tạo qua signUp() hoặc create_user_admin())
  IF NEW.raw_user_meta_data ? 'fullname' THEN
    INSERT INTO public.profiles (id, email, fullname)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'fullname', ''))
    ON CONFLICT (id) DO NOTHING;

    -- Chỉ tạo customer nếu KHÔNG phải nhân viên
    IF COALESCE((NEW.raw_user_meta_data->>'is_staff')::boolean, false) = false THEN
      INSERT INTO public.customers (id, status)
      VALUES (NEW.id, 'active')
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;