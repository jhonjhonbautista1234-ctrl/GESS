import Link from "next/link";
import { ArrowUpRight, FilePlus2, Megaphone, MessageSquareText, Newspaper, PenLine } from "lucide-react";
import { MessageInbox, type InboxMessage } from "@/components/message-inbox";
import { requireAdmin } from "@/lib/admin";
import { createBlog } from "./actions";

interface ContentRow { id: string; title: string; status: string; }

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const [{ data: announcements }, { data: posts }, { data: rawMessages }] = await Promise.all([
    supabase.from("announcements").select("id,title,status,created_at").is("deleted_at", null).order("created_at", { ascending: false }).limit(8),
    supabase.from("blog_posts").select("id,title,slug,status,created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("suggestions").select("id,message,contact_hint,created_at").order("created_at", { ascending: false }).limit(30),
  ]);
  const announcementRows = (announcements ?? []) as ContentRow[];
  const postRows = (posts ?? []) as ContentRow[];
  const messages = (rawMessages ?? []) as InboxMessage[];
  const publishedAnnouncements = announcementRows.filter((row) => row.status === "published").length;

  return <>
    <header className="studio-page-head"><div><p className="studio-eyebrow">GESS / Workspace</p><h1 className="studio-heading">Create with clarity.</h1><p className="studio-muted">Your publishing hub. Start with the content that belongs on the public website.</p></div><Link className="studio-button is-primary" href="/admin/dashboard/announcements"><Megaphone size={16} />New announcement</Link></header>
    <section className="studio-metrics" aria-label="Website content summary">
      <Metric label="Announcements" value={announcementRows.length} detail={`${publishedAnnouncements} live on the website`} />
      <Metric label="Articles" value={postRows.length} detail="Latest journalism entries" />
      <Metric label="Messages" value={messages.length} detail="Private suggestions received" />
      <Metric label="Admin access" value={1} detail="The database permits one admin role" />
    </section>
    <section className="studio-overview-grid">
      <div className="grid gap-4">
        <section className="studio-card"><p className="studio-label">Quick actions</p><div className="mt-4 grid gap-2 sm:grid-cols-2"><QuickLink href="/admin/dashboard/announcements" icon={<Megaphone size={16} />} label="Create an announcement" /><QuickLink href="#new-article" icon={<PenLine size={16} />} label="Write an article" /><QuickLink href="/admin/dashboard/announcements" icon={<FilePlus2 size={16} />} label="Review content library" /><QuickLink href="#inbox" icon={<MessageSquareText size={16} />} label="Review private messages" /></div></section>
        <div className="grid gap-4 lg:grid-cols-2"><ContentPanel label="Announcements" rows={announcementRows} href="/admin/dashboard/announcements" /><ContentPanel label="Articles" rows={postRows} href="#new-article" /></div>
        <section id="new-article" className="studio-card"><p className="studio-eyebrow">Journalism</p><h2 className="text-xl font-bold">Draft a new article</h2><p className="studio-muted mt-2">This is a private draft until you select publish.</p><BlogForm /></section>
      </div>
      <div id="inbox"><MessageInbox initialMessages={messages} /></div>
    </section>
  </>;
}

function Metric({ label, value, detail }: { label: string; value: number; detail: string }) { return <article className="studio-card"><p className="studio-label">{label}</p><strong className="studio-metric-value">{value}</strong><p className="studio-muted">{detail}</p></article>; }
function QuickLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) { return <Link className="studio-quick-link" href={href}>{icon}<span>{label}</span><ArrowUpRight size={14} /></Link>; }
function ContentPanel({ label, rows, href }: { label: string; rows: ContentRow[]; href: string }) { return <section className="studio-card"><div className="flex items-center justify-between gap-4"><p className="studio-label">{label}</p><Link className="studio-button" href={href}>Open <ArrowUpRight size={14} /></Link></div><div className="mt-4 grid gap-2">{rows.length ? rows.map((row) => <div className="rounded-lg border border-white/5 bg-white/[.025] p-3" key={row.id}><p className="font-medium text-white">{row.title}</p><p className="studio-muted mt-1 capitalize">{row.status}</p></div>) : <p className="studio-muted">Nothing has been created yet.</p>}</div></section>; }
function BlogForm() { return <form action={createBlog} className="mt-5 grid gap-3"><label className="studio-field">Title<input name="title" required minLength={3} maxLength={180} /></label><label className="studio-field">Summary<textarea name="excerpt" required minLength={3} maxLength={500} rows={2} /></label><label className="studio-field">Article<textarea name="content" required minLength={3} maxLength={30000} rows={5} /></label><label className="studio-toggle"><input name="publish" type="checkbox" />Publish immediately</label><button className="studio-button is-primary w-fit" type="submit"><Newspaper size={15} />Save article</button></form>; }
