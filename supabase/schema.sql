-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  name text,
  email text not null,
  is_admin boolean not null default false,
  wallet_cents bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by owner"
on public.profiles for select
using ( auth.uid() = id );

create policy "Users can insert their own profile"
on public.profiles for insert
with check ( auth.uid() = id );

create policy "Users can update their own profile"
on public.profiles for update
using ( auth.uid() = id );

-- Helper function to check if user is admin
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return exists(
    select 1 from public.profiles 
    where id = user_id and is_admin = true
  );
end;
$$ language plpgsql security definer;

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', ''));
  -- ensure a cart and wishlist are created for the user
  insert into public.carts (user_id) values (new.id) on conflict do nothing;
  insert into public.wishlists (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Categories and sizes
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique
);

create table if not exists public.sizes (
  id uuid primary key default uuid_generate_v4(),
  label text not null unique
);

-- Products
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price_cents bigint not null,
  color text,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_active boolean not null default true
);

alter table public.products enable row level security;

-- Anyone can view active products
create policy "Read active products" on public.products
for select using ( is_active = true );

-- Admins can manage products
create policy "Admin manage products" on public.products for all
using ( public.is_admin(auth.uid()) ) with check ( public.is_admin(auth.uid()) );

-- Product images stored in Supabase Storage; optional table for metadata
create table if not exists public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  path text not null,
  is_primary boolean not null default false
);

alter table public.product_images enable row level security;
create policy "Read product images" on public.product_images for select using ( true );
create policy "Admin manage product images" on public.product_images for all
using ( public.is_admin(auth.uid()) ) with check ( public.is_admin(auth.uid()) );

-- Product variants (size inventory)
create table if not exists public.product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  size_id uuid not null references public.sizes(id),
  stock int not null default 0,
  unique(product_id, size_id)
);

alter table public.product_variants enable row level security;
create policy "Read product variants" on public.product_variants for select using ( true );

-- Wishlists
create table if not exists public.wishlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.wishlist_items (
  id uuid primary key default uuid_generate_v4(),
  wishlist_id uuid not null references public.wishlists(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(wishlist_id, product_id)
);

alter table public.wishlists enable row level security;
alter table public.wishlist_items enable row level security;

create policy "Own wishlist read" on public.wishlists for select using ( user_id = auth.uid() );
create policy "Own wishlist modify" on public.wishlists for all using ( user_id = auth.uid() ) with check ( user_id = auth.uid() );
create policy "Own wishlist items read" on public.wishlist_items for select using (
  exists(select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = auth.uid())
);
create policy "Own wishlist items modify" on public.wishlist_items for all using (
  exists(select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = auth.uid())
 ) with check (
  exists(select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = auth.uid())
 );

-- Carts
create table if not exists public.carts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_variant_id uuid not null references public.product_variants(id),
  quantity int not null check (quantity > 0),
  unique(cart_id, product_variant_id)
);

alter table public.carts enable row level security;
alter table public.cart_items enable row level security;

create policy "Own cart read" on public.carts for select using ( user_id = auth.uid() );
create policy "Own cart modify" on public.carts for all using ( user_id = auth.uid() ) with check ( user_id = auth.uid() );
create policy "Own cart items read" on public.cart_items for select using (
  exists(select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
);
create policy "Own cart items modify" on public.cart_items for all using (
  exists(select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
 ) with check (
  exists(select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
 );

-- Orders
create type public.order_status as enum ('pending','paid','shipped','delivered','cancelled');

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete set null,
  status public.order_status not null default 'pending',
  subtotal_cents bigint not null,
  shipping_cents bigint not null default 0,
  total_cents bigint not null,
  -- Customer details
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address text not null,
  shipping_city text not null,
  shipping_postal_code text,
  shipping_country text not null default 'Namibia',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  size_id uuid not null references public.sizes(id),
  quantity int not null,
  price_cents bigint not null
);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Own orders read" on public.orders for select using ( user_id = auth.uid() );
create policy "Own order items read" on public.order_items for select using (
  exists(select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);

-- Wallet transactions
create type public.wallet_tx_type as enum ('deposit','purchase','refund');

create table if not exists public.wallet_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_cents bigint not null,
  kind public.wallet_tx_type not null,
  order_id uuid references public.orders(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.wallet_transactions enable row level security;
create policy "Own wallet tx read" on public.wallet_transactions for select using ( user_id = auth.uid() );
create policy "Own wallet tx insert" on public.wallet_transactions for insert with check ( user_id = auth.uid() );

-- Analytics: product views & aggregates
create table if not exists public.product_views (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.product_views enable row level security;
create policy "Read product views" on public.product_views for select using ( true );
create policy "Insert views" on public.product_views for insert with check ( true );

-- Basic helper function to update profile updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profile_updated_at on public.profiles;
create trigger set_profile_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Site settings (singleton)
create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  cover_image_path text,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
create policy "Read site settings" on public.site_settings for select using ( true );
create policy "Admin update site settings" on public.site_settings for all
  using ( public.is_admin(auth.uid()) ) with check ( public.is_admin(auth.uid()) );

-- Optional: ensure single row exists
create or replace function public.ensure_site_settings_row()
returns void as $$
begin
  if not exists(select 1 from public.site_settings) then
    insert into public.site_settings (cover_image_path) values (null);
  end if;
end;
$$ language plpgsql;


