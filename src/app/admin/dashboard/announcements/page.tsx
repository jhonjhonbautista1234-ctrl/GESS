import { AnnouncementManager } from "@/components/admin/announcement-manager";
import { toAdminAnnouncement, type AdminAnnouncement } from "@/features/announcements/admin-types";
import { requireAdmin } from "@/lib/admin";

export default async function AnnouncementManagementPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("announcements")
    .select("id,title,body,excerpt,status,is_pinned,published_at,created_at,updated_at,deleted_at,design")
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error) {
    throw new Error("Unable to load announcements for the administrator workspace.");
  }

  const announcements: AdminAnnouncement[] = (data ?? [])
    .map(toAdminAnnouncement)
    .filter((announcement): announcement is AdminAnnouncement => announcement !== null);

  return <AnnouncementManager announcements={announcements} />;
}
