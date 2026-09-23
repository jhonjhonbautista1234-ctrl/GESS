import Link from "next/link";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { AssetLibrary } from "@/components/admin/asset-library";
import { ThemePreview } from "@/components/admin/theme-preview";
import { MessageInbox, type InboxMessage } from "@/components/message-inbox";
import { assetSections, readPublicAssets } from "@/lib/admin-assets";
import { requireAdmin } from "@/lib/admin";
import { createBlog } from "../actions";

type WorkspaceSection = "analytics" | "journalism" | "contacts" | "theme" | "events" | "documents" | "achievements" | "officers" | "merch";
const sections = new Set<WorkspaceSection>(["analytics", "journalism", "contacts", "theme", "events", "documents", "achievements", "officers", "merch"]);

export default async function WorkspaceSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!sections.has(section as WorkspaceSection)) return null;
  const { supabase } = await requireAdmin();

  if (section in assetSections) {
    const assetSection = assetSections[section as keyof typeof assetSections];
    return <AssetLibrary section={assetSection} assets={await readPublicAssets(assetSection.assetDirectories, assetSection.extensions)} />;
  }
  if (section === "theme") return <ThemePreview />;

  if (section === "contacts") {
    const { data } = await supabase.from("suggestions").select("id,message,contact_hint,created_at").order("created_at", { ascending: false }).limit(100);
    return <><header className="studio-page-head"><div><p className="studio-eyebrow">People / Contacts</p><h1 className="studio-heading">Private message inbox.</h1><p className="studio-muted max-w-2xl">Suggestions submitted on the public contact page are visible only to the authenticated administrator.</p></div></header><div className="max-w-4xl"><MessageInbox initialMessages={(data ?? []) as InboxMessage[]} /></div></>;
  }

  if (section === "journalism") {
    const { data } = await supabase.from("blog_posts").select("id,title,slug,status,created_at,published_at").order("created_at", { ascending: false }).limit(100);
    const posts = data ?? [];
    return <><header className="studio-page-head"><div><p className="studio-eyebrow">Content / Journalism</p><h1 className="studio-heading">Publish stories with purpose.</h1><p className="studio-muted max-w-2xl">Write a draft, then publish it when it is ready for the public journal.</p></div><Link href="/blog" target="_blank" rel="noreferrer" className="studio-button">Open public journal <ArrowUpRight size={15} /></Link></header><div className="studio-journalism-layout"><section className="studio-card"><p className="studio-label">New article</p><BlogForm /></section><section className="studio-card"><p className="studio-label">Article library</p><div className="studio-list">{posts.length ? posts.map((post) => <article className="studio-list-row" key={post.id}><div><span className="studio-badge">{post.status}</span><h2>{post.title}</h2><p className="studio-muted">/{post.slug} · {new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(new Date(post.created_at))}</p></div></article>) : <p className="studio-muted mt-4">No articles yet. Create the first story using the editor.</p>}</div></section></div></>;
  }

  const [{ count: announcements }, { count: posts }, { count: messages }] = await Promise.all([
    supabase.from("announcements").select("id", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("suggestions").select("id", { count: "exact", head: true }),
  ]);
  const total = (announcements ?? 0) + (posts ?? 0) + (messages ?? 0);
  return <><header className="studio-page-head"><div><p className="studio-eyebrow">Workspace / Analytics</p><h1 className="studio-heading">A clear view of activity.</h1><p className="studio-muted">Live totals from the current content workspace.</p></div></header><section className="studio-metrics"><Metric label="Announcements" value={announcements ?? 0} detail="Available in the content library" /><Metric label="Journal entries" value={posts ?? 0} detail="Drafts and published stories" /><Metric label="Messages" value={messages ?? 0} detail="Private contact submissions" /><Metric label="Total activity" value={total} detail="Tracked workspace records" /></section><section className="studio-card studio-activity-chart"><p className="studio-label">Content distribution</p><div className="mt-6 grid gap-4 sm:grid-cols-3">{[["Announcements", announcements ?? 0], ["Journalism", posts ?? 0], ["Contacts", messages ?? 0]].map(([label, value]) => <div key={String(label)}><div className="studio-chart-track"><span style={{ width: `${total ? (Number(value) / total) * 100 : 0}%` }} /></div><p className="mt-3 text-sm text-white">{label}</p><p className="studio-muted">{value} records</p></div>)}</div></section></>;
}

function BlogForm() { return <form action={createBlog} className="mt-5 grid gap-3"><label className="studio-field">Title<input name="title" required minLength={3} maxLength={180} /></label><label className="studio-field">Summary<textarea name="excerpt" required minLength={3} maxLength={500} rows={3} /></label><label className="studio-field">Article<textarea name="content" required minLength={3} maxLength={30000} rows={9} /></label><label className="studio-toggle"><input name="publish" type="checkbox" />Publish immediately</label><button className="studio-button is-primary w-fit" type="submit"><Newspaper size={15} />Save article</button></form>; }
function Metric({ label, value, detail }: { label: string; value: number; detail: string }) { return <article className="studio-card"><p className="studio-label">{label}</p><strong className="studio-metric-value">{value}</strong><p className="studio-muted">{detail}</p></article>; }
