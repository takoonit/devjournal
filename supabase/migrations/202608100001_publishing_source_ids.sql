-- Ownership is explicit. Signing up never grants publishing authority.
drop trigger if exists seed_owner_on_first_signup on auth.users;
drop function if exists public.auto_seed_owner();

create unique index if not exists owner_settings_single_owner
  on public.owner_settings ((true));

-- Provision the intended owner through the SQL editor or an admin migration:
-- insert into public.owner_settings (owner_id)
-- values ('<YOUR_AUTH_USER_UUID>')
-- on conflict (owner_id) do nothing;

-- Stable links from browser-local records to Supabase UUID rows.
alter table public.profiles
  add column if not exists source_id text;

alter table public.projects
  add column if not exists source_id text;

alter table public.entries
  add column if not exists source_id text;

create unique index if not exists profiles_source_id_unique
  on public.profiles (source_id)
  where source_id is not null;

create unique index if not exists projects_source_id_unique
  on public.projects (source_id)
  where source_id is not null;

create unique index if not exists entries_source_id_unique
  on public.entries (source_id)
  where source_id is not null;

comment on column public.profiles.source_id is 'Browser-local profile identifier used by owner publishing.';
comment on column public.projects.source_id is 'Browser-local project identifier used by owner publishing.';
comment on column public.entries.source_id is 'Browser-local entry identifier used by owner publishing.';

-- Anonymous visitors can discover only projects with a public entry.
drop policy if exists "public can read projects" on public.projects;
create policy "public can read projects"
on public.projects for select
using (
  exists (
    select 1
    from public.entries
    where entries.project_id = projects.id
      and entries.is_public = true
  )
);

-- Read-only deployment preflight. Back up and reconcile any returned rows
-- before enabling source-aware publishing; entries cannot be matched by title.
select 'profile' as record_type, id, null::uuid as parent_id, name as label, created_at
from public.profiles
where source_id is null
union all
select 'project', id, null::uuid, name, created_at
from public.projects
where source_id is null
union all
select 'entry', id, project_id, title, created_at
from public.entries
where source_id is null
order by record_type, created_at asc;
