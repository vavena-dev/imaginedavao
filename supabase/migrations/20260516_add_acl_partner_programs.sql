-- Add ACL resources and partner income-stream programs.

create extension if not exists "uuid-ossp";

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  alter column role set default 'partner';

alter table public.profiles
  add constraint profiles_role_check
  check (
    role in (
      'admin',
      'partner',
      'user',
      'content_editor',
      'events_editor',
      'attractions_editor',
      'dining_editor',
      'lodging_editor',
      'guides_editor',
      'deals_editor',
      'partner_manager'
    )
  );

create table if not exists public.access_roles (
  role text primary key,
  label text not null,
  description text not null,
  inherits_all boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.access_rules (
  resource_key text primary key,
  resource_type text not null,
  label text not null,
  allowed_roles text[] not null default '{}',
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partner_programs (
  id uuid primary key default uuid_generate_v4(),
  city text not null,
  slug text not null,
  title text not null,
  category text not null,
  partner_type text not null,
  placement_type text not null,
  billing_model text not null check (billing_model in ('monthly', 'campaign', 'commission', 'lead_fee', 'hybrid')),
  price_amount numeric not null default 0,
  price_currency text not null default 'PHP',
  commission_rate numeric not null default 0,
  lead_fee_amount numeric not null default 0,
  featured_slots integer not null default 0,
  summary text not null,
  benefits text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(city, slug)
);

create index if not exists idx_access_rules_resource_type
  on public.access_rules(resource_type);

create index if not exists idx_partner_programs_city_status_sort
  on public.partner_programs(city, status, sort_order);

create or replace trigger trg_access_roles_updated_at
before update on public.access_roles
for each row execute procedure public.set_updated_at();

create or replace trigger trg_access_rules_updated_at
before update on public.access_rules
for each row execute procedure public.set_updated_at();

create or replace trigger trg_partner_programs_updated_at
before update on public.partner_programs
for each row execute procedure public.set_updated_at();

insert into public.access_roles (role, label, description, inherits_all)
values
  ('admin', 'Admin', 'Full access to every CMS, booking, partner, and access-control surface.', true),
  ('partner', 'Partner', 'Signed-in business partner account with access to partner profile and program surfaces.', false),
  ('user', 'User', 'General signed-in traveller account.', false),
  ('content_editor', 'Content Editor', 'Future editorial role for homepage and shared content blocks.', false),
  ('events_editor', 'Events Editor', 'Future editor role for Now in City and event content.', false),
  ('attractions_editor', 'Attractions Editor', 'Future editor role for Things To Do and activity content.', false),
  ('dining_editor', 'Dining Editor', 'Future editor role for Eat and Drink content.', false),
  ('lodging_editor', 'Lodging Editor', 'Future editor role for Where to Stay content.', false),
  ('guides_editor', 'Guides Editor', 'Future editor role for Maps and Guides content.', false),
  ('deals_editor', 'Deals Editor', 'Future editor role for Deals and passes content.', false),
  ('partner_manager', 'Partner Manager', 'Future manager role for partner programs, sponsored placements, and lead products.', false)
on conflict (role) do update
set
  label = excluded.label,
  description = excluded.description,
  inherits_all = excluded.inherits_all;

insert into public.access_rules (resource_key, resource_type, label, allowed_roles, description)
values
  ('nav:admin_cms', 'navigation', 'ADMIN CMS link', array['admin'], 'Controls visibility of the ADMIN CMS link in site navigation and account menus.'),
  ('page:admin', 'page', 'ADMIN CMS page', array['admin'], 'Controls access to the CMS workspace page.'),
  ('cms:index', 'cms_page', 'Homepage CMS', array['admin', 'content_editor'], 'Future role split for homepage CMS editing.'),
  ('cms:now', 'cms_page', 'Now in City CMS', array['admin', 'events_editor'], 'Future role split for events and current city programming.'),
  ('cms:things', 'cms_page', 'Things To Do CMS', array['admin', 'attractions_editor'], 'Future role split for attraction content.'),
  ('cms:eat', 'cms_page', 'Eat and Drink CMS', array['admin', 'dining_editor'], 'Future role split for dining content.'),
  ('cms:stay', 'cms_page', 'Where to Stay CMS', array['admin', 'lodging_editor'], 'Future role split for hotel and stay content.'),
  ('cms:guides', 'cms_page', 'Maps and Guides CMS', array['admin', 'guides_editor'], 'Future role split for itinerary and guide content.'),
  ('cms:deals', 'cms_page', 'Deals CMS', array['admin', 'deals_editor'], 'Future role split for deals and passes.'),
  ('partner:programs', 'partner_system', 'Partner programs', array['admin', 'partner_manager'], 'Controls future management of paid partner packages.')
on conflict (resource_key) do update
set
  resource_type = excluded.resource_type,
  label = excluded.label,
  allowed_roles = excluded.allowed_roles,
  description = excluded.description;

insert into public.partner_programs (
  city,
  slug,
  title,
  category,
  partner_type,
  placement_type,
  billing_model,
  price_amount,
  price_currency,
  commission_rate,
  lead_fee_amount,
  featured_slots,
  summary,
  benefits,
  status,
  sort_order
)
values
  (
    'davao',
    'featured-listing',
    'Featured Listing',
    'visibility',
    'Hotels, restaurants, attractions, tour operators',
    'Priority card on matching public pages',
    'monthly',
    12000,
    'PHP',
    0,
    0,
    4,
    'A recurring placement for partners that want steady visibility across high-intent travel pages.',
    array['Priority card placement on one matching section page', 'Tracked call-to-action link for booking or enquiry traffic', 'Monthly performance summary for renewals and upgrades'],
    'published',
    1
  ),
  (
    'davao',
    'seasonal-campaign',
    'Seasonal Campaign Feature',
    'campaign',
    'Events, festivals, restaurants, hotels',
    'Campaign bundle across partner page, deals, and booking prompts',
    'campaign',
    35000,
    'PHP',
    0,
    0,
    3,
    'A time-boxed promotion for festivals, long weekends, openings, and seasonal offers.',
    array['Campaign story and offer card across relevant pages', 'Partner offer surfaced inside booking and itinerary prompts', 'Post-campaign click and enquiry report'],
    'published',
    2
  ),
  (
    'davao',
    'affiliate-booking',
    'Affiliate Booking Row',
    'booking',
    'Hotels, experiences, car rentals',
    'Bookable row in the on-site booking demo flow',
    'commission',
    0,
    'PHP',
    8,
    0,
    10,
    'A performance-led option where ImagineDavao earns from tracked bookings instead of a fixed placement fee.',
    array['Partner row in Flights, Hotels, Experiences, or Cars', 'Tracked outbound booking URL', 'Commission or affiliate payout tied to completed partner checkout'],
    'published',
    3
  ),
  (
    'davao',
    'qualified-lead',
    'Qualified Lead Package',
    'lead-generation',
    'Tour operators, event organizers, private transport',
    'Inquiry routing from itinerary and concierge surfaces',
    'lead_fee',
    0,
    'PHP',
    0,
    450,
    8,
    'A low-friction model for partners that prefer paying only when a traveller asks for a quote or contact.',
    array['Lead capture from relevant planning journeys', 'Category and city filters to keep enquiries qualified', 'Lead fee charged only for valid traveller enquiries'],
    'published',
    4
  )
on conflict (city, slug) do update
set
  title = excluded.title,
  category = excluded.category,
  partner_type = excluded.partner_type,
  placement_type = excluded.placement_type,
  billing_model = excluded.billing_model,
  price_amount = excluded.price_amount,
  price_currency = excluded.price_currency,
  commission_rate = excluded.commission_rate,
  lead_fee_amount = excluded.lead_fee_amount,
  featured_slots = excluded.featured_slots,
  summary = excluded.summary,
  benefits = excluded.benefits,
  status = excluded.status,
  sort_order = excluded.sort_order;
