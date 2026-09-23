import { notFound } from "next/navigation";
import ContentWorkspace from "@/components/admin/content-workspace";
import { isModule } from "@/lib/cms";
import { ThemePreview } from "@/components/admin/theme-preview";
import { MessageInbox, type InboxMessage } from "@/components/message-inbox";
import { requireAdmin } from "@/lib/admin";

type WorkspaceSection = "analytics" | "journalism" | "contacts" | "theme" | "events" | "documents" | "achievements" | "officers" | "merch";
const sections = new Set<WorkspaceSection>(["analytics", "journalism", "contacts", "theme", "events", "documents", "achievements", "officers", "merch"]);

export default async function WorkspaceSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (isModule(section)) return <ContentWorkspace module={section} />;
  if (!sections.has(section as WorkspaceSection)) notFound();
  const { supabase } = await requireAdmin();


  if (section === "theme") return <ThemePreview />;

  if (section === "contacts") {
    const { data } = await supabase.from("suggestions").select("id,message,contact_hint,created_at").order("created_at", { ascending: false }).limit(100);
    return <><header className="studio-page-head"><div><p className="studio-eyebrow">People / Contacts</p><h1 className="studio-heading">Private message inbox.</h1><p className="studio-muted max-w-2xl">Suggestions submitted on the public contact page are visible only to the authenticated administrator.</p></div></header><div className="max-w-4xl"><MessageInbox initialMessages={(data ?? []) as InboxMessage[]} /></div></>;
  }



  const [{ count: announcements }, { count: posts }, { count: messages }] = await Promise.all([
    supabase.from("announcements").select("id", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("suggestions").select("id", { count: "exact", head: true }),
  ]);
  const total = (announcements ?? 0) + (posts ?? 0) + (messages ?? 0);
  return <><header className="studio-page-head"><div><p className="studio-eyebrow">Workspace / Analytics</p><h1 className="studio-heading">A clear view of activity.</h1><p className="studio-muted">Live totals from the current content workspace.</p></div></header><section className="studio-metrics"><Metric label="Announcements" value={announcements ?? 0} detail="Available in the content library" /><Metric label="Journal entries" value={posts ?? 0} detail="Drafts and published stories" /><Metric label="Messages" value={messages ?? 0} detail="Private contact submissions" /><Metric label="Total activity" value={total} detail="Tracked workspace records" /></section><section className="studio-card studio-activity-chart"><p className="studio-label">Content distribution</p><div className="mt-6 grid gap-4 sm:grid-cols-3">{[["Announcements", announcements ?? 0], ["Journalism", posts ?? 0], ["Contacts", messages ?? 0]].map(([label, value]) => <div key={String(label)}><div className="studio-chart-track"><span style={{ width: `${total ? (Number(value) / total) * 100 : 0}%` }} /></div><p className="mt-3 text-sm text-white">{label}</p><p className="studio-muted">{value} records</p></div>)}</div></section></>;
}

function Metric({ label, value, detail }: { label: string; value: number; detail: string }) { return <article className="studio-card"><p className="studio-label">{label}</p><strong className="studio-metric-value">{value}</strong><p className="studio-muted">{detail}</p></article>; }
