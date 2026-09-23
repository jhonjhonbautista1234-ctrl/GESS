"use server";
import { redirect } from "next/navigation";
import { createJournalism } from "@/app/actions/admin";

export async function createBlog(form: FormData) {
 const title = String(form.get("title") ?? "").trim();
 form.set("slug", title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + crypto.randomUUID().slice(0,8));
 form.set("body", String(form.get("content") ?? ""));
 form.set("status", form.get("publish") ? "published" : "draft");
 const result = await createJournalism(form);
 if (!result.success) throw new Error(result.message);
 redirect("/admin/dashboard/journalism");
}
