import { z } from "zod";

export const modules = {
 announcements: { table: "announcements", label: "Announcements", path: "/announcements" },
 journalism: { table: "blog_posts", label: "Journalism", path: "/blog" },
 events: { table: "events", label: "Events", path: "/events" },
 documents: { table: "documents", label: "Documents", path: "/documents" },
 achievements: { table: "achievements", label: "Achievements", path: "/achievements" },
 officers: { table: "officers", label: "Officers", path: "/officers" },
 merch: { table: "merch", label: "Merch", path: "/merch" },
} as const;
export type Module = keyof typeof modules;
export function isModule(value: string): value is Module { return Object.hasOwn(modules, value); }
export interface ActionResult { success: boolean; message: string; url?: string; }
export interface UploadResult extends ActionResult { path?: string; token?: string; }
export interface ContentRecord {
 id: string; title: string; body: string; content?: string; excerpt: string | null;
 image_url: string | null; file_url: string | null; gallery_urls: string[];
 slug: string | null; status: string; sort_order: number; published_at: string | null;
 deleted_at: string | null;
 year?: number | null; role?: string | null; committee?: string | null;
 starts_at?: string | null; location?: string | null; price?: number | null; availability?: string | null;
}
export const mediaUrl = z.string().trim().max(2048).refine(value => {
 if (!value) return true;
 if (value.startsWith("/assets/")) {
  try { return new URL(value, "https://local.invalid").pathname.startsWith("/assets/") && !decodeURIComponent(value).split("/").includes("..") && !value.includes("\\"); } catch { return false; }
 }
 try {
  const url = new URL(value);
  const project = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://invalid.local");
  return url.origin === project.origin && url.pathname.startsWith("/storage/v1/object/public/gess-media/") && !url.username && !url.password;
 } catch { return false; }
}, "Use a local /assets/ path or an uploaded GESS media URL.");
export const contentSchema = z.object({
 title: z.string().trim().min(3).max(180),
 body: z.string().trim().min(3).max(30000),
 excerpt: z.string().trim().max(500),
 image_url: mediaUrl, file_url: mediaUrl,
 gallery_urls: z.array(mediaUrl).max(30),
 slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180),
 status: z.enum(["draft","published"]),
 sort_order: z.coerce.number().int().min(0).max(100000),
});

