-- Presentation values are validated by the server before saving. Existing
-- announcements receive the default design without changing their content.
alter table public.announcements
  add column if not exists design jsonb not null default '{}'::jsonb;
alter table public.announcements add constraint announcements_design_object
  check (jsonb_typeof(design) = 'object' and octet_length(design::text) <= 2048);
