GRANT ALL ON TABLE public.employees TO authenticated;
GRANT ALL ON TABLE public.employees TO service_role;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;

DROP POLICY IF EXISTS "Allow authenticated insert" ON public.employees;
CREATE POLICY "Allow authenticated insert"
ON public.employees FOR INSERT TO authenticated WITH CHECK (true);