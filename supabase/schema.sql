create table if not exists public.foods (
  id bigint generated always as identity primary key,
  name text not null,
  description text not null,
  ingredients text not null,
  price numeric(10, 2) not null check (price > 0),
  category text not null default 'pizza',
  image_url text,
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  food_id bigint not null references public.foods (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, food_id)
);

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  items jsonb not null,
  total numeric(10, 2) not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.foods enable row level security;
alter table public.favorites enable row level security;
alter table public.orders enable row level security;

create policy "Anyone can see the menu"
  on public.foods for select
  using (true);

create policy "Logged in users can add foods"
  on public.foods for insert to authenticated
  with check (auth.uid() = created_by);

create policy "Users can delete their own foods"
  on public.foods for delete to authenticated
  using (auth.uid() = created_by);

create policy "Users can see their favorites"
  on public.favorites for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can add favorites"
  on public.favorites for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can remove favorites"
  on public.favorites for delete to authenticated
  using (auth.uid() = user_id);

create policy "Users can see their orders"
  on public.orders for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can place orders"
  on public.orders for insert to authenticated
  with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('food-images', 'food-images', true)
on conflict (id) do nothing;

create policy "Logged in users can upload food images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'food-images');
