CREATE POLICY le_tan_insert_bill_services ON public.bill_services FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.employees e
  WHERE ((e.id = auth.uid()) AND (e.role_id = ANY (ARRAY[(5)::bigint, (1)::bigint]))))));
CREATE POLICY le_tan_select_bill_services ON public.bill_services FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.employees e
  WHERE ((e.id = auth.uid()) AND (e.role_id = ANY (ARRAY[(5)::bigint, (1)::bigint]))))));
CREATE POLICY le_tan_insert_bills ON public.bills FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.employees e
  WHERE ((e.id = auth.uid()) AND (e.role_id = ANY (ARRAY[(5)::bigint, (1)::bigint]))))));
CREATE POLICY le_tan_select_bills ON public.bills FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.employees e
  WHERE ((e.id = auth.uid()) AND (e.role_id = ANY (ARRAY[(1)::bigint, (2)::bigint, (3)::bigint, (4)::bigint, (5)::bigint]))))));
CREATE POLICY le_tan_update_bills ON public.bills FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.employees e
  WHERE ((e.id = auth.uid()) AND (e.role_id = ANY (ARRAY[(5)::bigint, (1)::bigint])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.employees e
  WHERE ((e.id = auth.uid()) AND (e.role_id = ANY (ARRAY[(5)::bigint, (1)::bigint]))))));
CREATE POLICY "Admin xem tat ca customers" ON public.customers FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.employees e
  WHERE (e.id = auth.uid()))));
