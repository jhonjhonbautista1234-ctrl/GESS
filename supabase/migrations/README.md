# Supabase migrations

The SQL files in this directory are the source of truth for database changes.
`supabase/schema.sql` is retained only as a compatibility snapshot; do not use
it for new deployments or rerun it against an existing project.

## New Supabase project

Apply every migration in filename order (or use `supabase db push` after the
project is linked). This creates the baseline schema and the announcement/admin
hardening in one sequence.

## Existing Supabase project

Back up `profiles`, `announcements`, and `blog_posts`, then mark the baseline
as applied before applying the hardening migration. This prevents a known
production schema from being recreated:

```powershell
supabase migration repair --status applied 20260917000000
supabase db push
```

If the existing project has more than one `profiles.role = 'admin'` row, the
hardening migration intentionally stops. Resolve that ownership conflict before
retrying; it must not silently choose an administrator.

Run each migration against a staging project first. Do not import data from
`AdminDesign`.
