"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

export async function createBlog(form: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = String(form.get("title")).trim();
  const published = Boolean(form.get("publish"));
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  await supabase.from("blog_posts").insert({
    title,
    slug,
    excerpt: String(form.get("excerpt")).trim(),
    content: String(form.get("content")).trim(),
    status: published ? "published" : "draft",
    published_at: published ? new Date().toISOString() : null,
    created_by: user.id,
  });

  revalidatePath("/blog");
  revalidatePath("/admin/dashboard");
}
