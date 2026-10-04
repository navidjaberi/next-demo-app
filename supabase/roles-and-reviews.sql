create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.profiles (id, full_name)
select id, split_part(email, '@', 1) from auth.users
on conflict (id) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;

create policy "Anyone can see profiles"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

revoke update on public.profiles from authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;

drop policy if exists "Logged in users can add foods" on public.foods;
drop policy if exists "Users can delete their own foods" on public.foods;

create policy "Admins can add foods"
  on public.foods for insert to authenticated
  with check (public.is_admin());

create policy "Admins can update foods"
  on public.foods for update to authenticated
  using (public.is_admin());

create policy "Admins can delete foods"
  on public.foods for delete to authenticated
  using (public.is_admin());

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('pending', 'preparing', 'delivered', 'cancelled'));

alter table public.orders drop constraint if exists orders_user_id_profiles_fkey;
alter table public.orders add constraint orders_user_id_profiles_fkey
  foreign key (user_id) references public.profiles (id) on delete cascade;

create policy "Admins can see all orders"
  on public.orders for select to authenticated
  using (public.is_admin());

create policy "Admins can update orders"
  on public.orders for update to authenticated
  using (public.is_admin());

create table if not exists public.reviews (
  id bigint generated always as identity primary key,
  food_id bigint not null references public.foods (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 3 and 500),
  created_at timestamptz not null default now(),
  unique (food_id, user_id)
);

alter table public.reviews enable row level security;

create policy "Anyone can see reviews"
  on public.reviews for select
  using (true);

create policy "Customers can add reviews"
  on public.reviews for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete to authenticated
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Logged in users can upload food images" on storage.objects;

create policy "Admins can upload food images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'food-images' and public.is_admin());

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Users can upload their own avatar"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
