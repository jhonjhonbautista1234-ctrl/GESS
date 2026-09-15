-- Run once in the Supabase SQL Editor. The admin invite secret stays only in
-- ADMIN_INVITE_SECRET on the server; it is never stored in this database.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  message text not null check (char_length(trim(message)) between 3 and 3000),
  contact_hint text check (contact_hint is null or char_length(contact_hint) <= 180),
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 3 and 180),
  body text not null check (char_length(trim(body)) between 3 and 10000),
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 3 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text not null check (char_length(trim(excerpt)) between 3 and 500),
  content text not null check (char_length(trim(content)) between 3 and 30000),
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists suggestions_created_at_idx on public.suggestions (created_at desc);
create index if not exists announcements_published_idx on public.announcements (status, published_at desc);
create index if not exists blog_posts_published_idx on public.blog_posts (status, published_at desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.suggestions enable row level security;
alter table public.announcements enable row level security;
alter table public.blog_posts enable row level security;

drop policy if exists "Profiles are visible to their owner or an admin" on public.profiles;
create policy "Profiles are visible to their owner or an admin"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "Public may submit suggestions" on public.suggestions;
create policy "Public may submit suggestions"
  on public.suggestions for insert to anon, authenticated
  with check (char_length(trim(message)) between 3 and 3000);
drop policy if exists "Admins may read suggestions" on public.suggestions;
create policy "Admins may read suggestions"
  on public.suggestions for select to authenticated
  using (public.is_admin());

drop policy if exists "Published announcements are public" on public.announcements;
create policy "Published announcements are public"
  on public.announcements for select to anon, authenticated
  using (status = 'published' or public.is_admin());
drop policy if exists "Admins manage announcements" on public.announcements;
create policy "Admins manage announcements"
  on public.announcements for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Published blogs are public" on public.blog_posts;
create policy "Published blogs are public"
  on public.blog_posts for select to anon, authenticated
  using (status = 'published' or public.is_admin());
drop policy if exists "Admins manage blogs" on public.blog_posts;
create policy "Admins manage blogs"
  on public.blog_posts for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

do $$
begin
  alter publication supabase_realtime add table public.suggestions;
exception when duplicate_object then null;
end $$;
