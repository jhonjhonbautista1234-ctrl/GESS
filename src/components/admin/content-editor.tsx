"use client";
import { useState } from "react";
import { prepareMediaUpload } from "@/app/actions/admin";
import { uploadSignedMedia } from "@/lib/media-upload";
import type { ContentRecord, Module } from "@/lib/cms";

interface Props { module: Module; record: ContentRecord | null; pending: boolean; save: (form: FormData) => void; }
export default function ContentEditor({ module, record, pending, save }: Props) {
 const [image, setImage] = useState(record?.image_url ?? "");
 const [file, setFile] = useState(record?.file_url ?? "");
 const [uploading, setUploading] = useState(false);
 const [notice, setNotice] = useState("");
 async function upload(selected: File | undefined, kind: "image" | "pdf") {
  if (!selected) return;
  if (kind === "image" && !selected.type.startsWith("image/") || kind === "pdf" && selected.type !== "application/pdf") { setNotice("Select the correct media type."); return; }
  setUploading(true); setNotice("");
  try {
   const result = await prepareMediaUpload(module, selected.type, selected.size);
   if (!result.success || !result.path || !result.token || !result.url) { setNotice(result.message); return; }
   const { error } = await uploadSignedMedia(result.path, result.token, selected);
   if (error) { setNotice("Upload failed. Please retry."); return; }
   if (kind === "image") setImage(result.url); else setFile(result.url);
   setNotice("Uploaded. Save changes to attach this media.");
  } catch { setNotice("Upload failed. Please retry."); } finally { setUploading(false); }
 }
 const input = (name: keyof ContentRecord, label: string, type = "text") => <label className="studio-field">{label}<input name={name} type={type} defaultValue={String(record?.[name] ?? "")} /></label>;
 return <form onSubmit={event => { event.preventDefault(); save(new FormData(event.currentTarget)); }} className="studio-card">
  <fieldset disabled={pending || uploading}>
   <p className="studio-eyebrow">{record ? "Edit record" : "New record"}</p>
   {record && <input type="hidden" name="id" value={record.id} />}
   <label className="studio-field">Title / name<input name="title" defaultValue={record?.title} required minLength={3} maxLength={180} /></label>
   <label className="studio-field">URL slug<input name="slug" defaultValue={record?.slug ?? ""} required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="my-new-story" /><small>Lowercase words separated by hyphens.</small></label>
   <label className="studio-field">Summary<textarea name="excerpt" maxLength={500} defaultValue={record?.excerpt ?? ""} rows={2} /></label>
   <label className="studio-field">Content / description<textarea name="body" required minLength={3} maxLength={module === "announcements" ? 10000 : 30000} defaultValue={module === "journalism" ? record?.content : record?.body} rows={7} /><small>Text is rendered safely as paragraphs; HTML is not executed.</small></label>
   <label className="studio-field">Image URL<input name="image_url" value={image} onChange={e => setImage(e.target.value)} /></label>
   <label className="studio-field">Upload image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => void upload(e.target.files?.[0], "image")} /></label>
   {image && <img src={image} alt="Selected artwork preview" className="mb-5 max-h-52 w-full rounded-lg object-contain" />}
   {module === "documents" ? <><label className="studio-field">PDF URL<input name="file_url" value={file} onChange={e => setFile(e.target.value)} required /></label><label className="studio-field">Upload PDF<input type="file" accept="application/pdf" onChange={e => void upload(e.target.files?.[0], "pdf")} /></label></> : <input type="hidden" name="file_url" value={file} />}
   {module === "events" && <>{input("starts_at", "Event date (ISO with timezone)")}{input("location", "Location")}<label className="studio-field">Gallery URLs (one per line)<textarea name="gallery_urls" defaultValue={record?.gallery_urls?.join("\n")} rows={4} /></label></>}
   {module !== "events" && <input type="hidden" name="gallery_urls" value={record?.gallery_urls?.join("\n") ?? ""} />}
   {module === "achievements" && input("year", "Year", "number")}
   {module === "officers" && <>{input("role", "Role")}{input("committee", "Committee")}</>}
   {module === "merch" && <>{input("price", "Price in PHP")}{input("availability", "Availability")}</>}
   <div className="grid gap-4 sm:grid-cols-2"><label className="studio-field">Visibility<select name="status" defaultValue={record?.status === "published" ? "published" : "draft"}><option value="draft">Draft — private</option><option value="published">Published — public</option></select></label><label className="studio-field">Display order<input type="number" name="sort_order" min={0} max={100000} defaultValue={record?.sort_order ?? 0} required /></label></div>
   <button className="studio-button is-primary" type="submit">{pending ? "Saving…" : uploading ? "Uploading…" : "Save changes"}</button>
  </fieldset>
  {notice && <p role="status" className="studio-alert">{notice}</p>}
 </form>;
}

