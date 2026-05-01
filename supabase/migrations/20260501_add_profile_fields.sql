-- Add user profile fields for email-authenticated accounts
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists phone text,
  add column if not exists avatar_url text;
