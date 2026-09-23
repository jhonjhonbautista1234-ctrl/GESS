"use server";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/admin";
import { isModule, type ActionResult, type UploadResult } from "@/lib/cms";
import { mutate } from "@/lib/cms-mutations";

// Large files go directly to Storage using this short-lived upload permission.
// This avoids the hosting provider's request-body limit on server functions.
export async function prepareMediaUpload(module: string, mime: string, size: number): Promise<UploadResult> {
 const { supabase, user } = await requireAdmin();
 const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" };
 if (!isModule(module) || !Object.hasOwn(extensions, mime) || !Number.isSafeInteger(size) || size <= 0 || size > 50 * 1024 * 1024)
  return { success: false, message: "Select a JPEG, PNG, WebP or PDF no larger than 50 MB." };
 try {
  const path = module + "/" + user.id + "/" + randomUUID() + "." + extensions[mime];
  const { data, error } = await supabase.storage.from("gess-media").createSignedUploadUrl(path);
  if (error || !data) return { success: false, message: "Upload unavailable. Apply the Storage policies and retry." };
  return { success: true, message: "Upload authorized.", path, token: data.token, url: supabase.storage.from("gess-media").getPublicUrl(path).data.publicUrl };
 } catch { return { success: false, message: "Upload unavailable. Please retry." }; }
}

// Uses the cookie-authenticated Supabase client; no service-role bypass.
export async function uploadMedia(form: FormData): Promise<ActionResult> {
 const { supabase, user } = await requireAdmin();
 const module = String(form.get("module") ?? "");
 const file = form.get("file");
 if (!isModule(module) || !(file instanceof File) || file.size === 0) return { success: false, message: "Select a media file and content section." };
 if (file.size > 3 * 1024 * 1024) return { success: false, message: "Use the editor's direct upload for files larger than 3 MB." };
 const bytes = new Uint8Array(await file.arrayBuffer());
 const magic = String.fromCharCode(...bytes.slice(0,12));
 const extension = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? "jpg"
  : bytes[0] === 137 && magic.slice(1,4) === "PNG" ? "png"
  : magic.startsWith("RIFF") && magic.slice(8,12) === "WEBP" ? "webp"
  : magic.startsWith("%PDF-") ? "pdf" : null;
 const types = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", pdf: "application/pdf" };
 if (!extension || file.type !== types[extension]) return { success: false, message: "Upload a valid JPEG, PNG, WebP, or PDF." };
 try {
  const objectPath = module + "/" + user.id + "/" + randomUUID() + "." + extension;
  const { error } = await supabase.storage.from("gess-media").upload(objectPath, bytes, { contentType: types[extension], upsert: false });
  if (error) return { success: false, message: "Upload failed. Check the storage migration and retry." };
  return { success: true, message: "Uploaded. Save the record to publish this media.", url: supabase.storage.from("gess-media").getPublicUrl(objectPath).data.publicUrl };
 } catch { return { success: false, message: "Upload failed. Please retry." }; }
}
export async function saveContent(module: string, form: FormData) { return mutate(module, form.get("id") ? "update" : "create", form); }
export async function deleteContent(module: string, form: FormData) { return mutate(module, "delete", form); }
export async function createAnnouncement(form: FormData) { return mutate("announcements", "create", form); }
export async function updateAnnouncement(form: FormData) { return mutate("announcements", "update", form); }
export async function deleteAnnouncement(form: FormData) { return mutate("announcements", "delete", form); }
export async function createEvent(form: FormData) { return mutate("events", "create", form); }
export async function updateEvent(form: FormData) { return mutate("events", "update", form); }
export async function deleteEvent(form: FormData) { return mutate("events", "delete", form); }
export async function createJournalism(form: FormData) { return mutate("journalism", "create", form); }
export async function updateJournalism(form: FormData) { return mutate("journalism", "update", form); }
export async function deleteJournalism(form: FormData) { return mutate("journalism", "delete", form); }
export async function createAchievement(form: FormData) { return mutate("achievements", "create", form); }
export async function updateAchievement(form: FormData) { return mutate("achievements", "update", form); }
export async function deleteAchievement(form: FormData) { return mutate("achievements", "delete", form); }
export async function createOfficer(form: FormData) { return mutate("officers", "create", form); }
export async function updateOfficer(form: FormData) { return mutate("officers", "update", form); }
export async function deleteOfficer(form: FormData) { return mutate("officers", "delete", form); }
export async function createDocument(form: FormData) { return mutate("documents", "create", form); }
export async function updateDocument(form: FormData) { return mutate("documents", "update", form); }
export async function deleteDocument(form: FormData) { return mutate("documents", "delete", form); }
export async function createMerch(form: FormData) { return mutate("merch", "create", form); }
export async function updateMerch(form: FormData) { return mutate("merch", "update", form); }
export async function deleteMerch(form: FormData) { return mutate("merch", "delete", form); }

