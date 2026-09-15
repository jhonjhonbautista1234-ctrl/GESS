import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const fetchWithTimeout: typeof fetch = async (input, init) => {
	const timeoutSignal = AbortSignal.timeout(10_000);
	return fetch(input, { ...init, signal: init?.signal ?? timeoutSignal });
};

export async function createClient() {
	const store = cookies();
	type Update = { name: string; value: string; options: Parameters<typeof store.set>[2] };

	return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			getAll: () => store.getAll(),
			setAll: (items: Update[]) => {
				try { items.forEach(({ name, value, options }) => store.set(name, value, options)); } catch {}
			},
		},
		global: { fetch: fetchWithTimeout },
	});
}
