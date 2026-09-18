import { unstable_cache } from "next/cache";
import { createPublicServerClient } from "@/lib/supabase/public";
import type { PublishedAnnouncement } from "./types";
import { readAnnouncementDesign } from "./design";

const ANNOUNCEMENT_CACHE_TAG = "announcements";

type PublishedAnnouncementRow = {
  id: string;
  title: string;
  body: string;
  excerpt: string | null;
  is_pinned: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  design: unknown;
};

const getCachedPublishedAnnouncements = unstable_cache(
  async (): Promise<PublishedAnnouncement[]> => {
    const supabase = createPublicServerClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("id,title,body,excerpt,is_pinned,published_at,created_at,updated_at,design")
      .eq("status", "published")
      .is("deleted_at", null)
      .lte("published_at", new Date().toISOString())
      .order("is_pinned", { ascending: false })
      .order("published_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(50)
      .returns<PublishedAnnouncementRow[]>();

    if (error) {
      throw new Error("Unable to load published announcements.");
    }

    return (data ?? []).map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      body: announcement.body,
      excerpt: announcement.excerpt,
      isPinned: announcement.is_pinned,
      publishedAt: announcement.published_at,
      createdAt: announcement.created_at,
      updatedAt: announcement.updated_at,
      design: readAnnouncementDesign(announcement.design),
    }));
  },
  ["published-announcements"],
  {
    revalidate: 300,
    tags: [ANNOUNCEMENT_CACHE_TAG],
  },
);

/**
 * Public announcement feed, cached for five minutes and invalidated by the
 * admin mutation path with `revalidateTag("announcements")`.
 */
export function getPublishedAnnouncements() {
  return getCachedPublishedAnnouncements();
}

export { ANNOUNCEMENT_CACHE_TAG };
