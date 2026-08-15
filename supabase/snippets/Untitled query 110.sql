alter policy "quanly_select_promotions"
on "public"."promotions"
to authenticated
using (
  (EXISTS ( SELECT 1
   FROM employees e
   WHERE ((e.id = auth.uid()) AND (e.role_id = ANY (ARRAY[(1)::bigint, (2)::bigint, (3)::bigint, (5)::bigint])))))
);