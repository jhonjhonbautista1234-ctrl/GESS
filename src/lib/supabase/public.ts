import { createClient } from "@supabase/supabase-js";

const fetchWithTimeout: typeof fetch = async (input, init) => {
  const timeoutSignal = AbortSignal.timeout(10_000);
  return fetch(input, { ...init, signal: init?.signal ?? timeoutSignal });
};

function getPublicEnvironmentVariable(
  name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY",
) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required public Supabase environment variable: ${name}`);
  }

  return value;
}

/**
 * A server-only, unauthenticated client for public cacheable reads.
 *
 * Do not replace this with the cookie-aware client: reading cookies would make
 * public routes dynamic and would make cached output depend on a visitor's
 * session.
 */
export function createPublicServerClient() {
  return createClient(
    getPublicEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL"),
    getPublicEnvironmentVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
      global: { fetch: fetchWithTimeout },
    },
  );
}
