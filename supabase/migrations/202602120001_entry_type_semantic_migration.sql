-- Normalize entries to semantic entry_type + content
alter table public.entries
  add column if not exists entry_type text,
  add column if not exists content text,
  alter column category drop not null,
  alter column template_data drop not null;

update public.entries
set entry_type = case
  when coalesce(template_data->>'subcategory', '') in ('debugging', 'post-mortem') then 'fix'
  when coalesce(template_data->>'subcategory', '') in ('implementation-guide', 'decision-log') then 'feature'
  when coalesce(template_data->>'subcategory', '') in ('idea-spark', 'milestone') then 'design'
  when coalesce(template_data->>'subcategory', '') in ('context-switch', 'review') then 'refactor'
  when coalesce(template_data->>'subcategory', '') in ('til-snippet', 'research-notes') then 'journal'
  when category = 'build' then 'feature'
  when category = 'reflect' then 'journal'
  else 'journal'
end
where entry_type is null
   or entry_type not in ('feature', 'fix', 'refactor', 'design', 'journal');

update public.entries
set content = coalesce(content, '')
where content is null;

alter table public.entries
  alter column entry_type set default 'journal',
  alter column entry_type set not null,
  alter column content set default '',
  alter column content set not null;

alter table public.entries
  add constraint entries_entry_type_check
  check (entry_type in ('feature', 'fix', 'refactor', 'design', 'journal'));
