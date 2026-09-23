import "server-only";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { contentSchema, isModule, modules, type Module, type ActionResult } from "./cms";

function invalidate(module: Module) {
 revalidatePath(modules[module].path, "layout");
 revalidatePath("/admin/dashboard", "layout");
 revalidatePath("/");
 if (module === "announcements") revalidateTag("announcements");
 if (module === "documents") revalidatePath("/officers");
}
export async function mutate(moduleName: string, operation: "create" | "update" | "delete", form: FormData): Promise<ActionResult> {
 const { supabase, user } = await requireAdmin();
 if (!isModule(moduleName)) return { success: false, message: "Unknown content section." };
 const module = moduleName;
 const id = z.string().uuid().safeParse(form.get("id"));
 if (operation !== "create" && !id.success) return { success: false, message: "Invalid record reference." };
 try {
  if (operation === "delete") {
   const { data, error } = await supabase.from(modules[module].table).delete().eq("id", id.data!).select("id");
   if (error || !data?.length) return { success: false, message: "Delete failed. Refresh and try again." };
  } else {
   const string = (key: string) => String(form.get(key) ?? "").trim();
   const parsed = contentSchema.safeParse({
    title: string("title"), body: string("body"), excerpt: string("excerpt"),
    slug: string("slug"), image_url: string("image_url"), file_url: string("file_url"),
    gallery_urls: string("gallery_urls").split("\n").map(s => s.trim()).filter(Boolean),
    status: string("status"), sort_order: string("sort_order") || "0",
   });
   if (!parsed.success) return { success: false, message: parsed.error.issues.map(i => i.path.join(".") + ": " + i.message).join("; ") };
   const value = parsed.data;
   if (value.image_url && !/\.(jpe?g|png|webp)$/i.test(value.image_url)) return { success: false, message: "The image URL must point to JPEG, PNG or WebP media." };
   if (value.gallery_urls.some(url => !/\.(jpe?g|png|webp)$/i.test(url))) return { success: false, message: "Gallery URLs must point to images." };
   if (value.file_url && !/\.pdf$/i.test(value.file_url)) return { success: false, message: "The document URL must point to a PDF." };
   if (module === "announcements" && value.body.length > 10000) return { success: false, message: "Announcements support up to 10,000 characters." };
   if (module === "journalism" && value.excerpt.length < 3) return { success: false, message: "Add a summary of at least 3 characters." };
   if (module === "announcements" && value.excerpt && value.excerpt.length < 3) return { success: false, message: "Summary needs at least 3 characters." };
   const values: Record<string, unknown> = {
    ...value, excerpt: value.excerpt || null, image_url: value.image_url || null, file_url: value.file_url || null,
    published_at: value.status === "published" ? new Date().toISOString() : null,
   };
   if (operation === "create") values.created_by = user.id;
   if (module === "journalism") values.content = value.body;
   if (module === "events") {
    const date = string("starts_at");
    if (date && !z.string().datetime({ offset: true }).safeParse(date).success) return { success: false, message: "Event date must be an ISO timestamp with a timezone, e.g. 2026-10-01T09:00:00+08:00." };
    values.starts_at = date || null; values.location = string("location").slice(0, 300);
   }
   if (module === "achievements") values.year = z.coerce.number().int().min(1900).max(2200).parse(string("year"));
   if (module === "officers") { values.role = string("role").slice(0,180); values.committee = string("committee").slice(0,180); }
   if (module === "merch") {
    values.price = string("price") ? z.coerce.number().finite().min(0).max(9999999999.99).parse(string("price")) : null;
    values.availability = string("availability").slice(0,180);
   }
   if (module === "documents" && !value.file_url) return { success: false, message: "Upload or select a PDF first." };
   const query = operation === "create" ? supabase.from(modules[module].table).insert(values) : supabase.from(modules[module].table).update(values).eq("id", id.data!);
   const { data, error } = await query.select("id");
   if (error || !data?.length) return { success: false, message: error?.code === "23505" ? "That slug is already used. Choose another." : "Could not save. Check the database migration and try again." };
  }
  invalidate(module);
  return { success: true, message: operation === "delete" ? "Deleted. The public page has been refreshed." : "Saved. The public page has been refreshed." };
 } catch { return { success: false, message: "Could not save. Check field values and your connection, then retry." }; }
}

