"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, LogOut, Menu, Search, X } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { adminNavigation } from "./navigation";

export default function StudioShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [railOpen, setRailOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const items = adminNavigation.flatMap(group => group.items);
  const availableItems = items.filter((item) => item.available !== false);
  const active = items.find(item => item.href === pathname)?.label ?? "Content Studio";
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") { event.preventDefault(); dialog.current?.showModal(); }
      if (event.key === "Escape") setRailOpen(false);
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  async function signOut() {
    setSigningOut(true); setError("");
    try {
      const result = await createClient().auth.signOut();
      if (result.error) throw result.error;
      router.replace("/admin/login"); router.refresh();
    } catch { setError("Could not sign out. Please try again."); setSigningOut(false); }
  }
  return <div className="studio-shell">
    <a href="#studio-content" className="studio-skip">Skip to workspace</a>
    <header className="studio-topbar">
      <button className="studio-icon-button studio-menu-toggle" aria-label="Toggle navigation" aria-controls="studio-navigation" aria-expanded={railOpen} onClick={() => setRailOpen(!railOpen)}><Menu size={18} /></button>
      <Link href="/admin/dashboard" className="studio-brand"><span className="studio-monogram">G</span><span><small>GESS / CONTENT STUDIO</small><strong>{active}</strong></span></Link>
      <div className="studio-top-actions">
        <button className="studio-button studio-command-trigger" onClick={() => dialog.current?.showModal()}><Search size={14} /><span>Search commands</span><kbd>Ctrl K</kbd></button>
        <span className="studio-account" title={email}>{email}</span>
        <Link className="studio-button" href="/" target="_blank" rel="noreferrer">View site <ArrowUpRight size={14} /></Link>
        <button className="studio-button" disabled={signingOut} onClick={signOut}><LogOut size={14} /><span>{signingOut ? "Signing out…" : "Sign out"}</span></button>
      </div>
    </header>
    {error && <p className="studio-alert" role="alert">{error}</p>}
    <div className="studio-body">
      {railOpen && <button className="studio-scrim" aria-label="Close navigation" onClick={() => setRailOpen(false)} />}
      <aside id="studio-navigation" className={`studio-rail ${railOpen ? "is-open" : ""}`}><nav aria-label="Admin workspace">
        {adminNavigation.map(group => <div className="studio-nav-group" key={group.group}><p>{group.group}</p>{group.items.map(item => item.available === false ? <span className="studio-nav-disabled" key={item.label} title="This content manager is planned but is not available yet"><item.icon size={15} /><span>{item.label}</span><small>Later</small></span> : <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={() => setRailOpen(false)}><item.icon size={15} /><span>{item.label}</span></Link>)}</div>)}
      </nav><div className="studio-rail-note"><span className="studio-status-dot" />Private workspace<br /><small>One administrator. One source of truth.</small></div></aside>
      <main id="studio-content" className="studio-stage" tabIndex={-1}>{children}</main>
    </div>
    <dialog ref={dialog} className="studio-command-dialog"><div className="studio-dialog-header"><Search size={18} /><input aria-label="Search workspace pages" placeholder="Where would you like to go?" value={query} onChange={event => setQuery(event.target.value)} /><button className="studio-icon-button" aria-label="Close search" onClick={() => dialog.current?.close()}><X size={18} /></button></div>
      <div className="studio-command-results">{availableItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase())).map(item => <Link key={item.href} href={item.href} onClick={() => { dialog.current?.close(); setQuery(""); }}><item.icon size={17} />Go to {item.label}<ArrowUpRight size={14} /></Link>)}{!availableItems.some(item => item.label.toLowerCase().includes(query.toLowerCase())) && <p>No matching pages.</p>}</div>
    </dialog>
  </div>;
}
