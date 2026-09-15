import { MessageInbox, type InboxMessage } from "@/components/message-inbox";
import { requireAdmin } from "@/lib/admin";
import { createAnnouncement, createBlog } from "./actions";

interface ContentRow { id: string; title: string; status: string; }

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const [{ data: announcements }, { data: posts }, { data: rawMessages }] = await Promise.all([
    supabase.from("announcements").select("id,title,status,created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("blog_posts").select("id,title,slug,status,created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("suggestions").select("id,message,contact_hint,created_at").order("created_at", { ascending: false }).limit(30),
  ]);
  const messages = (rawMessages ?? []) as InboxMessage[];

  return <main className="min-h-dvh bg-mist px-5 py-8 sm:px-8"><div className="mx-auto max-w-7xl"><p className="section-kicker text-survey">Administrator workspace</p><h1 className="mt-3 text-3xl font-bold text-forest sm:text-4xl">GESS CMS</h1><p className="mt-3 max-w-2xl text-slate-600">Publish organization updates and securely review private community feedback.</p><div className="mt-8 grid gap-6 lg:grid-cols-2"><CmsForm action={createAnnouncement} title="New announcement" fields={["title", "body"]} /><CmsForm action={createBlog} title="New journalism blog" fields={["title", "excerpt", "content"]} /></div><section className="mt-8 grid gap-6 lg:grid-cols-3"><ContentPanel title="Announcements" rows={(announcements ?? []) as ContentRow[]} /><ContentPanel title="Blogs" rows={(posts ?? []) as ContentRow[]} /><MessageInbox initialMessages={messages} /></section></div></main>;
}

function CmsForm({ action, title, fields }: { action: (form: FormData) => Promise<void>; title: string; fields: readonly string[] }) {
  return <form action={action} className="surface-card p-6"><h2 className="text-xl font-bold text-forest">{title}</h2>{fields.map((field) => field === "body" || field === "content" ? <textarea className="mt-4 min-h-32 w-full rounded-lg border p-3 focus:border-topo focus:outline-none focus:ring-2 focus:ring-topo/30" key={field} name={field} placeholder={field === "body" ? "Announcement text" : "Article body"} required /> : <input className="mt-4 h-11 w-full rounded-lg border px-3 focus:border-topo focus:outline-none focus:ring-2 focus:ring-topo/30" key={field} name={field} placeholder={field[0].toUpperCase() + field.slice(1)} required />)}<label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700"><input className="h-4 w-4 accent-survey" name="publish" type="checkbox" /> Publish immediately</label><button className="button-primary mt-5" type="submit">Save {title.includes("blog") ? "article" : "announcement"}</button></form>;
}

function ContentPanel({ title, rows }: { title: string; rows: ContentRow[] }) { return <section className="surface-card p-6"><h2 className="text-xl font-bold text-forest">{title}</h2><ul className="mt-4 space-y-3 text-sm">{rows.length ? rows.map((row) => <li className="rounded-lg bg-emerald-50/65 p-3 text-slate-700" key={row.id}>{row.title}<span className="ml-2 text-xs font-bold uppercase tracking-wide text-survey">{row.status}</span></li>) : <li className="text-slate-500">None yet.</li>}</ul></section>; }
