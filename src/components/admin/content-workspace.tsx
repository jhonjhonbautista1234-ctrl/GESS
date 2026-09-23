import ContentManager from "./content-manager";
import { AnnouncementManager } from "./announcement-manager";
import { toAdminAnnouncement, type AdminAnnouncement } from "@/features/announcements/admin-types";
import { requireAdmin } from "@/lib/admin";
import { modules, type Module, type ContentRecord } from "@/lib/cms";

export default async function ContentWorkspace({ module }: { module: Module }) {
 const { supabase } = await requireAdmin();
 let query = supabase.from(modules[module].table).select("*");
 if (module !== "announcements") query = query.is("deleted_at", null);
 const { data, error } = await query.order("sort_order").order("created_at", { ascending: false }).returns<ContentRecord[]>();
 if (error) throw new Error("Unable to load content. Apply the Content Studio schema in Supabase and retry.");
 const records = data ?? [];
 return <><ContentManager key={module} module={module} records={records.filter(row => !row.deleted_at)} />
 {module === "announcements" && <details className="studio-card mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both bg-emerald-950/20 backdrop-blur-md border border-emerald-800/30 rounded-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-emerald-900/30 hover:shadow-xl hover:shadow-emerald-900/20 hover:border-emerald-600/50"><summary className="cursor-pointer font-bold transition-all duration-300 ease-in-out hover:text-emerald-50 hover:pl-2">Announcement design studio and archive</summary><div className="mt-6"><AnnouncementManager announcements={records.map(toAdminAnnouncement).filter((row): row is AdminAnnouncement => row !== null)} /></div></details>}
 </>;
}

