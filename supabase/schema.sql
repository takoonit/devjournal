-- DevJournal Supabase schema for ISR-backed public portfolio
-- Region: ap-southeast-2

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text not null,
  github_url text,
  twitter_url text,
  linkedin_url text,
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
  category text not null check (category in ('plan-change', 'build', 'reflect')),
  title text not null,
  template_data jsonb not null,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_slug on public.projects(slug);
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
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.entries enable row level security;

-- public portfolio reads
create policy if not exists "public can read profiles"
on public.profiles for select
using (true);

create policy if not exists "public can read projects"
on public.projects for select
using (true);

create policy if not exists "public can read public entries"
on public.entries for select
using (is_public = true);

-- single authenticated owner writes (replace auth.uid with your user id if needed)
create policy if not exists "owner can write profiles"
on public.profiles for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy if not exists "owner can write projects"
on public.projects for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy if not exists "owner can write entries"
on public.entries for all
using (auth.uid() is not null)
with check (auth.uid() is not null);
