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
  <header className="studio-page-head animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both"><div><p className="studio-eyebrow">Content studio / {config.label}</p><h1 className="studio-heading">Manage {config.label.toLowerCase()}.</h1><p className="studio-muted">Draft privately. Publish when ready. Changes update the public website.</p></div><Link href={config.path} target="_blank" className="studio-button transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-900/40 active:scale-95">View public page ↗</Link></header>
  {message && <p role="status" className="studio-alert animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both bg-emerald-950/20 backdrop-blur-md border border-emerald-800/30 rounded-xl">{message}</p>}
  <div className="studio-journalism-layout animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
   <ContentEditor key={(record?.id ?? "new") + version} module={module} record={record} pending={pending} save={save} />
   <section className="studio-card bg-emerald-950/20 backdrop-blur-md border border-emerald-800/30 rounded-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-emerald-900/30 hover:shadow-xl hover:shadow-emerald-900/20 hover:border-emerald-600/50"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Library ({records.length})</h2><button className="studio-button transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-900/40 active:scale-95" disabled={pending} onClick={() => { setRecord(null); setVersion(v => v + 1); }}>New record</button></div>
    <label className="studio-field mt-5">Search<input className="bg-black/20 border-emerald-900/50 transition-all duration-300 focus:bg-black/40 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none" type="search" value={query} onChange={e => setQuery(e.target.value)} /></label>
    <div className="studio-list">{records.filter(row => row.title.toLowerCase().includes(query.toLowerCase())).map(row => <article className="studio-list-row bg-emerald-950/20 backdrop-blur-md border border-emerald-800/30 rounded-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-emerald-900/30 hover:shadow-xl hover:shadow-emerald-900/20 hover:border-emerald-600/50" key={row.id}><div><span className="studio-badge">{row.status}</span><h3>{row.title}</h3><p className="studio-muted">/{row.slug}</p></div><div className="flex gap-2"><button className="studio-button transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-900/40 active:scale-95" disabled={pending} onClick={() => { setRecord(row); setMessage(""); }}>Edit</button><button className="studio-button is-danger transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-900/40 active:scale-95" disabled={pending} onClick={() => remove(row)}>Delete</button></div></article>)}</div>
    {!records.length && <p className="studio-muted mt-5 border border-dashed border-emerald-800/30 rounded-xl bg-emerald-950/20 backdrop-blur-md p-5">No records yet. Create your first entry.</p>}
   </section>
  </div>
 </>;
}

