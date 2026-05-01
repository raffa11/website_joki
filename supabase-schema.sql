-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create profiles table first (required for auth references)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'user',
  created_at timestamp with time zone default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

create policy "Admin can view all profiles"
  on public.profiles
  for select
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- 2. Create orders table
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  user_name text,
  phone text,
  game_name text default 'Mobile Legends',
  game_id text,
  server_id text,
  order_code text unique,
  current_rank text,
  target_rank text,
  stars_total int default 0,
  stars_progress int default 0,
  progress_percentage int default 0,
  status text default 'new' check (status in ('new', 'paid', 'in_progress', 'paused', 'completed')),
  payment_status text default 'unpaid',
  payment_method text,
  price bigint,
  booster text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_user_id on public.orders(user_id);

-- Enable RLS on orders
alter table public.orders enable row level security;

-- Orders policies
create policy "Users can view own orders"
  on public.orders
  for select
  using (auth.uid() = user_id);

create policy "Admin full access orders"
  on public.orders
  for all
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- 3. Create logs table
create table if not exists public.logs (
  id uuid primary key default uuid_generate_v4(),
  action text,
  order_id uuid references public.orders(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Enable RLS on logs
alter table public.logs enable row level security;

create policy "Admin can view logs"
  on public.logs
  for select
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- 4. Auto-update updated_at function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for orders updated_at
drop trigger if exists handle_orders_updated_at on public.orders;
create trigger handle_orders_updated_at
  before update on public.orders
  for each row
  execute function public.handle_updated_at();

-- 5. Auto-create profile on user signup (optional but recommended)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
