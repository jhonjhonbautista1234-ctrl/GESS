"use client";
import { createBrowserClient } from "@supabase/ssr";

const fetchWithTimeout: typeof fetch = (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(10_000) });

export const createClient = () => createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { global: { fetch: fetchWithTimeout } });
