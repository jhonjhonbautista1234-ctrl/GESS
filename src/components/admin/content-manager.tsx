"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteContent, saveContent } from "@/app/actions/admin";
import { modules, type Module, type ContentRecord } from "@/lib/cms";
import ContentEditor from "./content-editor";

export default function ContentManager({ module, records }: { module: Module; records: ContentRecord[] }) {
 const router = useRouter();
 const [record, setRecord] = useState<ContentRecord | null>(null);
 const [version, setVersion] = useState(0);
 const [query, setQuery] = useState("");
 const [message, setMessage] = useState("");
 const [pending, startTransition] = useTransition();
 const config = modules[module];
 function save(form: FormData) {
  setMessage("");
  startTransition(async () => {
   try {
    const result = await saveContent(module, form); setMessage(result.message);
    if (result.success) { setRecord(null); setVersion(v => v + 1); router.refresh(); }
   } catch { setMessage("Save failed. Your form has been preserved; try again."); }
  });
 }
 function remove(row: ContentRecord) {
  if (!window.confirm('Delete "' + row.title + '"? This removes it from the public website.')) return;
  startTransition(async () => {
   try {
    const form = new FormData(); form.set("id", row.id);
    const result = await deleteContent(module, form); setMessage(result.message);
    if (result.success) { if (record?.id === row.id) setRecord(null); router.refresh(); }
   } catch { setMessage("Delete failed. Please retry."); }
  });
 }
 return <>
  <header className="studio-page-head"><div><p className="studio-eyebrow">Content studio / {config.label}</p><h1 className="studio-heading">Manage {config.label.toLowerCase()}.</h1><p className="studio-muted">Draft privately. Publish when ready. Changes update the public website.</p></div><Link href={config.path} target="_blank" className="studio-button">View public page ↗</Link></header>
  {message && <p role="status" className="studio-alert">{message}</p>}
  <div className="studio-journalism-layout">
   <ContentEditor key={(record?.id ?? "new") + version} module={module} record={record} pending={pending} save={save} />
   <section className="studio-card"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Library ({records.length})</h2><button className="studio-button" disabled={pending} onClick={() => { setRecord(null); setVersion(v => v + 1); }}>New record</button></div>
    <label className="studio-field mt-5">Search<input type="search" value={query} onChange={e => setQuery(e.target.value)} /></label>
    <div className="studio-list">{records.filter(row => row.title.toLowerCase().includes(query.toLowerCase())).map(row => <article className="studio-list-row" key={row.id}><div><span className="studio-badge">{row.status}</span><h3>{row.title}</h3><p className="studio-muted">/{row.slug}</p></div><div className="flex gap-2"><button className="studio-button" disabled={pending} onClick={() => { setRecord(row); setMessage(""); }}>Edit</button><button className="studio-button is-danger" disabled={pending} onClick={() => remove(row)}>Delete</button></div></article>)}</div>
    {!records.length && <p className="studio-muted mt-5">No records yet. Create your first entry.</p>}
   </section>
  </div>
 </>;
}

