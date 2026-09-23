"use client";
import { createClient } from "@supabase/supabase-js";

// A signed upload needs no persisted authentication session. Allow enough time
// for PDFs without changing the short timeouts on regular database requests.
export async function uploadSignedMedia(path: string, token: string, file: File) {
 const storage = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(120_000) }) } },
 ).storage;
 return storage.from("gess-media").uploadToSignedUrl(path, token, file, { contentType: file.type });
}
