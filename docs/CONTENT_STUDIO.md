# Content Studio deployment

1. Run `supabase/schema.sql` in the existing project's Supabase SQL Editor.
   This is the same SQL as migration `20260923000000_content_studio.sql`;
   run one of these files, not both. Existing announcements and blog rows survive.
2. Run `supabase/seed-content.sql` once to import the existing 26 officer slides,
   five achievements, four events, officer PDF and two uniforms.
   This references the existing public assets; it does not re-upload or alter them.
   Do not rerun the seed after intentionally deleting seeded content.
3. Deploy the code with the same NEXT_PUBLIC_SUPABASE_URL and
   NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel. No service-role key is used.
4. Sign in as the existing admin. Each of the seven Content Studio sections has
   create, edit, draft/publish, display order, media upload and delete controls.

## Records and visibility

Journalism uses the existing `blog_posts` table. The other tables are
`announcements`, `events`, `documents`, `achievements`, `officers`, and `merch`.
The public site reads published, non-deleted rows with a publication timestamp.
The empty state is intentional when the last record is deleted: hard-coded
fallback content never reappears.

The Documents record with slug `officer-directory` controls the PDF on the
Officers page. Edit that record's PDF URL to replace the directory.
Achievement cards are grouped by year. Officer display order controls the carousel.
Merch supports a PHP price and availability text. Event gallery URLs are one per line.

Images and PDFs use the public `gess-media` bucket. Large uploads use a short-lived,
admin-authorized token and travel directly to Supabase Storage (up to 50 MB).
Public media must not contain confidential material, including media attached to drafts.
Deleting a record keeps the underlying media so other records sharing it do not break.
Remove unused files manually from Supabase Storage when no record references them.

## Security and validation

Every mutation and upload authorization calls `requireAdmin()` and uses the
cookie-authenticated client. RLS independently enforces admin-only writes.
Profile roles cannot be modified through the public API.
Next.js Server Actions enforce their standard same-origin CSRF protections;
no wildcard allowed origins are configured. React escapes text rather than rendering
submitted HTML, preventing stored HTML/XSS in article bodies.
The schema does not change the private Suggestions inbox policies.

## Verification

```powershell
node --test tests/cms-actions.test.cjs
node node_modules/typescript/bin/tsc --noEmit --pretty false
npm run build
```

Action tests mock Supabase at the service boundary; they do not prove production RLS.
After applying SQL, test a draft and published record in every module, edit it,
verify its public page in an incognito window, then delete the test record.
Verify unauthenticated users cannot open dashboard routes or mutate via the API.

## Announcements form binding

The server page is `src/app/admin/dashboard/announcements/page.tsx`.
It renders ContentWorkspace, which reads protected records and supplies ContentManager.
ContentManager calls the central Server Action and preserves input on failure:

```tsx
"use client";
import { useState } from "react";
import { createAnnouncement } from "@/app/actions/admin";

export function AnnouncementForm() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  return <form onSubmit={async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    try { setMessage((await createAnnouncement(form)).message); }
    catch { setMessage("Unable to save. Please retry."); }
    finally { setPending(false); }
  }}>
    <label>Title<input name="title" required minLength={3} maxLength={180} /></label>
    <label>Slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" /></label>
    <label>Body<textarea name="body" required minLength={3} maxLength={10000} /></label>
    <label>Image URL<input name="image_url" /></label>
    <input type="hidden" name="sort_order" value="0" />
    <label>Visibility<select name="status"><option value="draft">Draft</option><option value="published">Published</option></select></label>
    <button disabled={pending}>Save announcement</button>
    <p role="status">{message}</p>
  </form>;
}
```
