import { SiteHeader } from "@/components/site-header"; import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
	let data = null;

	try {
		const supabase = await createClient();
		const result = await supabase.from("announcements").select("id,title,body,published_at").eq("status", "published").order("published_at", { ascending: false });
		if (result.error) throw result.error;
		data = result.data;
	} catch (error) {
		console.error("Failed to load announcements:", error);
	}

	return <><SiteHeader/><main className="mx-auto max-w-4xl px-6 py-16"><p className="font-semibold tracking-widest text-survey">ANNOUNCEMENTS</p><h1 className="mt-3 text-4xl font-bold">What&apos;s happening</h1><div className="mt-10 space-y-5">{data?.map((item) => <article className="rounded-xl border bg-white p-6" key={item.id}><h2 className="text-2xl font-bold">{item.title}</h2><p className="mt-3 whitespace-pre-wrap text-slate-600">{item.body}</p></article>) || <p>No announcements published yet.</p>}</div></main></>;
}
