-- Apply this migration through the Supabase CLI or SQL Editor after backing up
-- the production project. It upgrades the existing schema without deleting data.

-- The website permits at most one administrator profile. The preflight keeps a
-- broken legacy state from being silently accepted.
do $$
declare
  admin_count integer;
begin
  select count(*) into admin_count
  from public.profiles
  where role = 'admin';

  if admin_count > 1 then
    raise exception 'Cannot enforce one-admin policy: % admin profiles exist. Resolve this before applying the migration.', admin_count;
  end if;
end
$$;

create unique index if not exists profiles_one_admin_idx
  on public.profiles (role)
  where role = 'admin';

-- This function is invoked only by the Auth trigger. It must not remain
-- directly callable by arbitrary database roles.
revoke all on function public.handle_new_user() from public;

-- Announcement lifecycle fields. Existing rows remain intact and every
-- previously published row receives a valid publication timestamp.
alter table public.announcements
  add column if not exists excerpt text,
  add column if not exists is_pinned boolean not null default false,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists updated_by uuid references auth.users(id),
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by uuid references auth.users(id);

update public.announcements
set published_at = created_at
where status = 'published'
  and published_at is null;

alter table public.announcements
  drop constraint if exists announcements_status_check;

alter table public.announcements
  add constraint announcements_status_check
  check (status in ('draft', 'published', 'archived'));

alter table public.announcements
  drop constraint if exists announcements_published_requires_timestamp_check;

alter table public.announcements
  add constraint announcements_published_requires_timestamp_check
  check (status <> 'published' or published_at is not null);

alter table public.announcements
  drop constraint if exists announcements_excerpt_length_check;

alter table public.announcements
  add constraint announcements_excerpt_length_check
  check (excerpt is null or char_length(trim(excerpt)) between 3 and 500);

create index if not exists announcements_public_feed_idx
  on public.announcements (is_pinned desc, published_at desc, id desc)
  where status = 'published' and deleted_at is null;

create or replace function public.set_announcement_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_announcement_updated_at() from public;

drop trigger if exists announcements_set_updated_at on public.announcements;
create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute procedure public.set_announcement_updated_at();

create table if not exists public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('announcement')),
  entity_id uuid not null,
  action text not null check (action in ('created', 'updated', 'archived', 'deleted', 'restored')),
  actor_id uuid references auth.users(id),
  snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists content_revisions_entity_idx
  on public.content_revisions (entity_type, entity_id, created_at desc);

alter table public.content_revisions enable row level security;

drop policy if exists "Admins may read content revisions" on public.content_revisions;
create policy "Admins may read content revisions"
  on public.content_revisions for select to authenticated
  using (public.is_admin());

revoke all on public.content_revisions from anon, authenticated;
grant select on public.content_revisions to authenticated;

create or replace function public.log_announcement_revision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  revision_action text;
begin
  if tg_op = 'INSERT' then
    insert into public.content_revisions (entity_type, entity_id, action, actor_id, snapshot)
    values ('announcement', new.id, 'created', new.created_by, to_jsonb(new));
    return new;
  end if;

  if new.deleted_at is not null and old.deleted_at is null then
    revision_action := 'deleted';
  elsif new.deleted_at is null and old.deleted_at is not null then
    revision_action := 'restored';
  elsif new.status = 'archived' and old.status is distinct from 'archived' then
    revision_action := 'archived';
  else
    revision_action := 'updated';
  end if;

  insert into public.content_revisions (entity_type, entity_id, action, actor_id, snapshot)
  values ('announcement', new.id, revision_action, coalesce(new.updated_by, auth.uid()), to_jsonb(new));

  return new;
end;
$$;

revoke all on function public.log_announcement_revision() from public;

drop trigger if exists announcements_log_revision on public.announcements;
create trigger announcements_log_revision
  after insert or update on public.announcements
  for each row execute procedure public.log_announcement_revision();

-- Explicit database privileges and RLS give visitors read-only access to live
-- content while the authenticated administrator retains managed write access.
revoke all on public.announcements from anon;
revoke all on public.announcements from authenticated;
grant select on public.announcements to anon, authenticated;
grant insert, update, delete on public.announcements to authenticated;

drop policy if exists "Published announcements are public" on public.announcements;
create policy "Published announcements are public"
  on public.announcements for select to anon, authenticated
  using (
    public.is_admin()
    or (
      status = 'published'
      and published_at <= now()
      and deleted_at is null
    )
  );

drop policy if exists "Admins manage announcements" on public.announcements;
create policy "Admins manage announcements"
  on public.announcements for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
