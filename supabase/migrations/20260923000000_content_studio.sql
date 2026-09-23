-- Run in Supabase SQL Editor. Additive migration: existing records are preserved.
begin;
create extension if not exists pgcrypto;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 role text not null default 'member' check (role in ('member','admin')),
 created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
-- Role escalation is permitted only through trusted database administration.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='admin'); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
drop policy if exists cms_profile_read on public.profiles;
create policy cms_profile_read on public.profiles for select to authenticated
 using (id=auth.uid() or public.is_admin());

-- Every module shares publication, ordering and media fields.
do $$
declare t text; p record;
begin
 foreach t in array array['announcements','blog_posts','events','documents','achievements','officers','merch'] loop
  execute format('create table if not exists public.%I (
   id uuid primary key default gen_random_uuid(),
   title text not null check(char_length(trim(title)) between 3 and 180),
   created_at timestamptz not null default now()
  )',t);
  execute format('alter table public.%I
   add column if not exists body text not null default '''',
   add column if not exists excerpt text,
   add column if not exists image_url text,
   add column if not exists file_url text,
   add column if not exists gallery_urls text[] not null default ''{}'',
   add column if not exists slug text,
   add column if not exists status text not null default ''draft'',
   add column if not exists published_at timestamptz,
   add column if not exists updated_at timestamptz not null default now(),
   add column if not exists created_by uuid references auth.users(id),
   add column if not exists sort_order integer not null default 0,
   add column if not exists deleted_at timestamptz',t);
  execute format('create unique index if not exists %I on public.%I(slug) where slug is not null',t||'_cms_slug',t);
  execute format('create index if not exists %I on public.%I(status,sort_order,published_at desc)',t||'_cms_feed',t);
  execute format('alter table public.%I enable row level security',t);
  execute format('update public.%I set published_at=created_at where status=''published'' and published_at is null',t);
  execute format('alter table public.%I drop constraint if exists cms_status_check',t);
  execute format('alter table public.%I add constraint cms_status_check check(status in (''draft'',''published'',''archived''))',t);
  -- Remove legacy permissive policies so they cannot bypass draft protection.
  for p in select policyname from pg_policies where schemaname='public' and tablename=t loop
   execute format('drop policy %I on public.%I',p.policyname,t);
  end loop;
  execute format('revoke all on public.%I from anon, authenticated',t);
  execute format('grant select on public.%I to anon, authenticated',t);
  execute format('grant insert,update,delete on public.%I to authenticated',t);
  execute format('create policy cms_read on public.%I for select to anon,authenticated using
   (public.is_admin() or (status=''published'' and deleted_at is null and published_at<=now()))',t);
  execute format('create policy cms_write on public.%I for all to authenticated
   using(public.is_admin()) with check(public.is_admin())',t);
 end loop;
end $$;
alter table public.announcements
 add column if not exists is_pinned boolean not null default false,
 add column if not exists design jsonb not null default '{}',
 add column if not exists updated_by uuid references auth.users(id),
 add column if not exists deleted_by uuid references auth.users(id);
alter table public.blog_posts add column if not exists content text not null default '';
update public.blog_posts set body=content where body='';
alter table public.events add column if not exists starts_at timestamptz, add column if not exists location text;
alter table public.achievements add column if not exists year integer;
alter table public.officers add column if not exists role text, add column if not exists committee text;
alter table public.merch add column if not exists price numeric(12,2) check(price>=0),
 add column if not exists availability text;
create or replace function public.cms_updated_at() returns trigger
language plpgsql set search_path=public as $$ begin new.updated_at=now(); return new; end $$;
do $$ declare t text; begin
 foreach t in array array['announcements','blog_posts','events','documents','achievements','officers','merch'] loop
 execute format('drop trigger if exists cms_updated_at on public.%I',t);
 execute format('create trigger cms_updated_at before update on public.%I for each row execute function public.cms_updated_at()',t);
 end loop;
end $$;

-- Public media is intended for publication; it must not contain private material.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('gess-media','gess-media',true,52428800,array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict(id) do update set public=true,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists gess_media_read on storage.objects;
create policy gess_media_read on storage.objects for select to anon,authenticated using(bucket_id='gess-media');
drop policy if exists gess_media_insert on storage.objects;
create policy gess_media_insert on storage.objects for insert to authenticated
 with check(bucket_id='gess-media' and public.is_admin());
drop policy if exists gess_media_update on storage.objects;
create policy gess_media_update on storage.objects for update to authenticated
 using(bucket_id='gess-media' and public.is_admin()) with check(bucket_id='gess-media' and public.is_admin());
drop policy if exists gess_media_delete on storage.objects;
create policy gess_media_delete on storage.objects for delete to authenticated using(bucket_id='gess-media' and public.is_admin());
commit;
