-- DevJournal Supabase schema for ISR-backed public portfolio
-- Region: ap-southeast-2

create extension if not exists "pgcrypto";
create schema if not exists private;

create table if not exists public.owner_settings (
  owner_id uuid primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text not null,
  github_url text,
  twitter_url text,
  linkedin_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists private.profiles_private (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  tech_stack text[] not null default '{}',
  repository_link text,
  status text not null check (status in ('in-progress', 'shipped')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  entry_type text not null default 'journal' check (entry_type in ('feature', 'fix', 'refactor', 'design', 'journal')),
  title text not null,
  content text not null default '',
  template_data jsonb,
  category text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_entries_project_public_created on public.entries(project_id, is_public, created_at desc);

-- timestamp maintenance
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_portfolio_owner()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.owner_settings
    where owner_id = auth.uid()
  );
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_entries_updated_at on public.entries;
create trigger set_entries_updated_at
before update on public.entries
for each row execute function public.set_updated_at();

-- RLS: single-user write/update, public read for portfolio tables
alter table public.owner_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.entries enable row level security;
alter table private.profiles_private enable row level security;

-- lock down owner settings table direct reads/writes to service role context
revoke all on table public.owner_settings from anon;
revoke all on table public.owner_settings from authenticated;
revoke all on table private.profiles_private from anon;
revoke all on table private.profiles_private from authenticated;

-- public portfolio reads
create policy if not exists "public can read profiles"
on public.profiles for select
using (auth.role() = 'authenticated' or auth.role() = 'service_role');

create or replace view public.public_profiles as
select id, name, role, bio, github_url, twitter_url, linkedin_url, created_at, updated_at
from public.profiles;

grant select on public.public_profiles to anon;
grant select on public.public_profiles to authenticated;

create policy if not exists "public can read projects"
on public.projects for select
using (true);

create policy if not exists "public can read public entries"
on public.entries for select
using (is_public = true);

-- single authenticated owner writes (owner configured in owner_settings)
create policy if not exists "owner can write profiles"
on public.profiles for all
using (public.is_portfolio_owner())
with check (public.is_portfolio_owner());

create policy if not exists "owner can write projects"
on public.projects for all
using (public.is_portfolio_owner())
with check (public.is_portfolio_owner());

create policy if not exists "owner can write entries"
on public.entries for all
using (public.is_portfolio_owner())
with check (public.is_portfolio_owner());

create policy if not exists "owner can manage private profiles"
on private.profiles_private for all
using (public.is_portfolio_owner())
with check (public.is_portfolio_owner());
