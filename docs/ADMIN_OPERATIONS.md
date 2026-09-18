# GESS administrator operations

The website intentionally exposes only `/admin/login`. It has no registration
page, invite endpoint, or browser-accessible administrator creation flow.

## Create the one administrator

Do this once, after the Supabase migrations have been applied:

1. In the Supabase Dashboard, open **Authentication → Users** and create the
   administrator's email/password account directly. Confirm the email if the
   project requires confirmation.
2. Open **Table Editor → profiles**, find the new user's row, and change
   `role` from `member` to `admin`.
3. Sign in at `/admin/login` and confirm that `/admin/dashboard` opens.

The `profiles_one_admin_idx` database index added by
`20260918000000_harden_admin_and_announcements.sql` prevents a second profile
from being assigned the `admin` role. If the change fails, keep the existing
administrator instead of bypassing the constraint.

## Prevent account creation

In **Authentication → Providers**, disable every provider that the website
does not actively use. In **Authentication → Settings**, disable new-user
sign-ups and anonymous sign-ins if they are enabled. The website already has
no sign-up UI; these settings close the backend alternatives as well.

## Change the administrator safely

There can be only one `admin` profile at a time. To transfer responsibility,
change the current administrator to `member` first, then change the intended
existing Supabase Auth user's profile to `admin`. Do not delete the original
user until the replacement has successfully signed in.

The Supabase project owner remains an infrastructure-level administrator and
can always manage Auth users. Keep that dashboard access in a small, trusted
group and enable MFA there.

## Never put credentials in the repository

Create passwords only in Supabase Authentication. Keep Supabase service-role
keys out of the application and out of Vercel's public (`NEXT_PUBLIC_*`)
environment variables. This application uses only the public anon key with
RLS for browser/server requests.
