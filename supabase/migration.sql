-- ============================================================
-- TapLive Database Schema & RLS Policies
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1) PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2) PROVIDER PROFILES
create table if not exists public.provider_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  country text,
  city text,
  timezone text,
  bio text,
  languages jsonb default '[]'::jsonb,
  skills jsonb default '[]'::jsonb,
  can_do text,
  device_model text,
  camera_quality text default '1080p',
  network_type text default 'wifi',
  rate_hourly_usd numeric,
  min_session_minutes int default 30,
  availability jsonb default '{}'::jsonb,
  status text default 'draft',
  updated_at timestamptz default now()
);

alter table public.provider_profiles enable row level security;

create policy "Users can view own provider profile"
  on public.provider_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own provider profile"
  on public.provider_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own provider profile"
  on public.provider_profiles for update
  using (auth.uid() = user_id);


-- 3) ORDERS
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users(id) on delete set null,
  assigned_provider_id uuid references auth.users(id) on delete set null,
  location_text text not null,
  category text not null,
  description text not null,
  preferred_time_text text,
  budget_usd numeric,
  duration_minutes int,
  language_preference text,
  status text default 'open',
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

-- Customers can insert their own orders
create policy "Customers can create orders"
  on public.orders for insert
  with check (auth.uid() = customer_id);

-- Customers can see their own orders
create policy "Customers can view own orders"
  on public.orders for select
  using (auth.uid() = customer_id);

-- Providers can see open orders
create policy "Providers can view open orders"
  on public.orders for select
  using (
    status = 'open'
    and auth.uid() is not null
  );

-- Providers can see orders assigned to them
create policy "Providers can view assigned orders"
  on public.orders for select
  using (auth.uid() = assigned_provider_id);

-- Providers can accept open orders (update status + assign themselves)
create policy "Providers can accept open orders"
  on public.orders for update
  using (
    status = 'open'
    and auth.uid() is not null
  )
  with check (
    assigned_provider_id = auth.uid()
    and status = 'accepted'
  );

-- Customers can cancel their own orders
create policy "Customers can cancel own orders"
  on public.orders for update
  using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);
