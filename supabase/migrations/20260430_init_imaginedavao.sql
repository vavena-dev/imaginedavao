-- ImagineDavao initial schema
create extension if not exists "uuid-ossp";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key,
  email text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_blocks (
  id uuid primary key default uuid_generate_v4(),
  city text not null,
  page text not null,
  section text not null,
  title text not null,
  body text not null,
  image_mode text not null default 'url' check (image_mode in ('upload', 'url')),
  image_url text,
  storage_path text,
  meta text,
  tag text,
  tags text[],
  cta_label text,
  cta_url text,
  booking_mode text not null default 'none' check (booking_mode in ('none', 'book', 'provider', 'info')),
  booking_type text check (booking_type in ('hotels', 'flights', 'experiences', 'cars')),
  booking_info text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_inventory (
  id uuid primary key default uuid_generate_v4(),
  city text not null,
  category text not null check (category in ('flights', 'hotels', 'experiences', 'cars')),
  provider_name text not null,
  title text not null,
  description text not null,
  location_label text,
  price_amount numeric,
  price_currency text not null default 'PHP',
  price_unit text,
  rating numeric,
  review_count integer,
  thumbnail_mode text not null default 'url' check (thumbnail_mode in ('upload', 'url')),
  thumbnail_url text,
  thumbnail_storage_path text,
  affiliate_url text,
  bookable boolean not null default true,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_content_blocks_city_page_section_status
  on public.content_blocks(city, page, section, status, sort_order);

create index if not exists idx_booking_inventory_city_category_status
  on public.booking_inventory(city, category, status, sort_order);

create index if not exists idx_profiles_role
  on public.profiles(role);

create or replace trigger trg_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create or replace trigger trg_content_blocks_updated_at
before update on public.content_blocks
for each row execute procedure public.set_updated_at();

create or replace trigger trg_booking_inventory_updated_at
before update on public.booking_inventory
for each row execute procedure public.set_updated_at();
