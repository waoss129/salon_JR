CREATE OR REPLACE FUNCTION public.update_user_email_rpc(uid uuid, new_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
BEGIN
  -- Kiểm tra email mới chưa được ai khác dùng (auth.users.email có UNIQUE constraint,
  -- nếu trùng sẽ tự báo lỗi, nhưng kiểm tra trước để có message rõ ràng hơn)
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = new_email AND id != uid) THEN
    RAISE EXCEPTION 'Email này đã được sử dụng bởi tài khoản khác';
  END IF;

  UPDATE auth.users
  SET email = new_email,
      email_confirmed_at = now() -- admin đổi hộ, coi như đã xác thực luôn (không qua email confirm)
  WHERE id = uid;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Không tìm thấy tài khoản với id: %', uid;
  END IF;
END;
$function$;