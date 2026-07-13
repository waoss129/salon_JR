SET check_function_bodies = false;
DROP POLICY "Ai cung xem duoc sessions" ON public.sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO service_role;
CREATE OR REPLACE FUNCTION public.create_user_admin(new_email text, new_password text, new_fullname text, is_staff boolean DEFAULT false)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  new_user_id uuid;
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    email_change_token_current, phone_change, phone_change_token, reauthentication_token,
    created_at, updated_at
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    extensions.uuid_generate_v4(),
    'authenticated', 'authenticated',
    new_email,
    crypt(new_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('fullname', new_fullname, 'is_staff', is_staff),
    '', '', '', '', '', '', '', '',
    now(), now()
  )
  RETURNING id INTO new_user_id;

  -- Thêm identity để user mới đăng nhập được ngay (tránh lặp lại lỗi login đã gặp với admin/CEO)
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at, last_sign_in_at)
  VALUES (
    extensions.uuid_generate_v4(),
    new_user_id,
    new_user_id::text,
    jsonb_build_object('sub', new_user_id::text, 'email', new_email, 'email_verified', true, 'phone_verified', false),
    'email',
    now(), now(), now()
  );

  RETURN new_user_id;
END;
$function$;
GRANT DELETE, INSERT, SELECT, UPDATE ON public.appointments TO service_role;
CREATE INDEX idx_appointments_date ON public.appointments (appointment_date);
CREATE INDEX idx_appointments_schedule_id ON public.appointments (schedule_id);
CREATE INDEX idx_appointments_status ON public.appointments (status);
GRANT DELETE, INSERT, SELECT, UPDATE ON public.bill_services TO service_role;
GRANT DELETE, INSERT, SELECT, UPDATE ON public.bills TO service_role;
GRANT SELECT ON public.customers TO anon;
GRANT DELETE, INSERT, SELECT, UPDATE ON public.customers TO service_role;
GRANT DELETE, INSERT, SELECT, UPDATE ON public.details TO service_role;
CREATE INDEX idx_details_appointment ON public.details (appointment_id);
GRANT DELETE, INSERT, UPDATE ON public.employee_categories TO service_role;
CREATE INDEX idx_employee_categories_category ON public.employee_categories (category_id);
CREATE INDEX idx_employee_categories_employee ON public.employee_categories (employee_id);
CREATE POLICY "Users can update own employee record" ON public.employees FOR UPDATE TO authenticated USING ((id = auth.uid())) WITH CHECK ((id = auth.uid()));
GRANT DELETE, INSERT, SELECT, UPDATE ON public.promotion_services TO service_role;
GRANT DELETE, INSERT, SELECT, UPDATE ON public.promotions TO service_role;
GRANT DELETE, INSERT, SELECT, UPDATE ON public.roles TO service_role;
GRANT DELETE, INSERT, SELECT, UPDATE ON public.schedules TO service_role;
CREATE INDEX idx_schedules_employee_date ON public.schedules (employee_id, date);
CREATE POLICY "Ai cũng xem được schedules" ON public.schedules FOR SELECT TO anon, authenticated USING (true);
GRANT DELETE, INSERT, SELECT, UPDATE ON public.sessions TO service_role;
CREATE POLICY "Ai cũng xem được sessions" ON public.sessions FOR SELECT TO anon, authenticated USING (true);
