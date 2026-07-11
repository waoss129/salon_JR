create policy "Allow authenticated select appointments" on "public"."appointments" for SELECT to authenticated using (true);
create policy "Allow authenticated update appointments" on "public"."appointments" for UPDATE to authenticated using (true) with check (true);
create policy "Allow authenticated select customers" on "public"."customers" for SELECT to authenticated using (true);
create policy "Allow authenticated select details" on "public"."details" for SELECT to authenticated using (true);
create policy "Allow authenticated select services" on "public"."services" for SELECT to authenticated using (true);