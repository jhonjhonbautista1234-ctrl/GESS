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
 {module === "announcements" && <details className="studio-card mt-8"><summary className="cursor-pointer font-bold">Announcement design studio and archive</summary><div className="mt-6"><AnnouncementManager announcements={records.map(toAdminAnnouncement).filter((row): row is AdminAnnouncement => row !== null)} /></div></details>}
 </>;
}

