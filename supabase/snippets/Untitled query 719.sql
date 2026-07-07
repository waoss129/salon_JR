-- Hàm này sẽ tự động copy email từ auth.users sang public.profiles khi tạo user mới
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, fullname, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger này kích hoạt hàm trên mỗi khi có user mới trong auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();