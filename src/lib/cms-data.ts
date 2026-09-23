import "server-only";
import { createPublicServerClient } from "@/lib/supabase/public";
import { modules, type Module, type ContentRecord } from "./cms";

export async function publishedContent(module: Module): Promise<ContentRecord[]> {
 const { data, error } = await createPublicServerClient().from(modules[module].table).select("*")
  .eq("status", "published").is("deleted_at", null).lte("published_at", new Date().toISOString())
  .order("sort_order").order("published_at", { ascending: false }).returns<ContentRecord[]>();
 if (error) throw new Error("Content could not be loaded. Please try again shortly.");
 return data ?? [];
}

