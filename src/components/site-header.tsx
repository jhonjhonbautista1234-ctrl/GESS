"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronDown, MapPinned } from "lucide-react";
import { useState } from "react";

const links = [
  ["Announcements", "/announcements"],
  ["Events", "/events"],
  ["Game", "/games"],
  ["Documents", "/documents"],
  ["Achievements", "/achievements"],
  ["Officers", "/officers"],
  ["Merch", "/merch"],
  ["Contact", "/contacts"],
] as const;

const learnLinks = [
  { label: "Field", detail: "Survey practice and fieldwork games", href: "/learn/field/index.html", icon: MapPinned },
  { label: "Academic", detail: "Course reviewers and study workspaces", href: "/learn/academic/remote-sensing/index.html", icon: BookOpen },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const closeAllMenus = () => { setMenuOpen(false); setLearnOpen(false); };

  return (
    <header className="sticky top-0 z-50 border-b border-topo/15 bg-forest/95 text-white shadow-lg shadow-forest/15 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 items-center gap-5">
          <Link href="/" onClick={closeAllMenus} className="group flex min-w-0 items-center gap-3" aria-label="GESS home">
            <Image src="/GESS_Logo.jpg" alt="GESS Logo" width={44} height={44} priority className="h-11 w-11 shrink-0 rounded-full border border-[#7BC635] object-cover shadow-[0_0_18px_rgba(123,198,53,.22)]" />
            <span className="min-w-0">
              <span className="block font-display text-lg font-bold leading-none">GESS</span>
              <span className="mt-1 block truncate text-[9px] font-bold tracking-[.12em] text-topo sm:text-[10px]">GEODETIC ENGINEERING STUDENTS SOCIETY</span>
            </span>
          </Link>
          <div className="ml-auto hidden shrink-0 items-center gap-1 whitespace-nowrap xl:flex">
            {links.map(([label, href]) => <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm font-semibold text-emerald-50 transition hover:bg-topo/10 hover:text-topo focus:outline-none focus:ring-2 focus:ring-topo">{label}</Link>)}
            <div
              className="relative"
              onMouseEnter={() => setLearnOpen(true)}
              onMouseLeave={() => setLearnOpen(false)}
              onFocus={() => setLearnOpen(true)}
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setLearnOpen(false); }}
            >
              <button type="button" onClick={() => setLearnOpen(true)} className="inline-flex min-h-10 items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-emerald-50 transition hover:bg-topo/10 hover:text-topo focus:outline-none focus:ring-2 focus:ring-topo" aria-expanded={learnOpen} aria-haspopup="menu">
                Learn <ChevronDown aria-hidden="true" size={16} className={`transition-transform duration-200 ${learnOpen ? "rotate-180" : ""}`} />
              </button>
              {learnOpen && <div role="menu" aria-label="Learn areas" className="absolute left-0 top-full z-50 w-80 pt-2">
                <div className="overflow-hidden rounded-xl border border-topo/30 bg-forest/98 p-2 shadow-2xl shadow-black/35 ring-1 ring-white/10">
                  <div className="mb-1 flex items-center gap-2 border-b border-topo/15 px-2 pb-2">
                    <Image src="/learn-cursor.png" alt="Surveying and learning illustration" width={34} height={34} className="h-8 w-8 rounded-md object-cover" />
                    <span className="text-xs font-bold uppercase tracking-[.14em] text-topo">Learning spaces</span>
                  </div>
                  {learnLinks.map(({ label, detail, href, icon: Icon }) => <Link key={href} href={href} onClick={closeAllMenus} role="menuitem" className="flex items-center gap-3 rounded-lg px-3 py-3 text-emerald-50 transition hover:bg-topo/10 focus:bg-topo/10 focus:outline-none">
                    <Icon aria-hidden="true" size={18} className="shrink-0 text-topo" />
                    <span><span className="block text-sm font-bold">{label}</span><span className="mt-0.5 block text-xs leading-4 text-emerald-100/70">{detail}</span></span>
                  </Link>)}
                </div>
              </div>}
            </div>
            <Link href="/contacts#suggestions" className="ml-2 rounded-md border border-topo px-4 py-2 text-sm font-bold text-topo transition hover:bg-topo hover:text-forest">Connect</Link>
            <Link href="/admin/login" className="ml-1 rounded-md border border-white/35 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:border-topo hover:bg-topo hover:text-forest focus:outline-none focus:ring-2 focus:ring-topo focus:ring-offset-2 focus:ring-offset-forest">Admin sign in</Link>
          </div>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} className="ml-auto grid h-10 w-10 place-items-center rounded-md border border-topo/25 text-topo xl:hidden" aria-controls="mobile-navigation" aria-expanded={menuOpen} aria-label="Toggle navigation">
            <span className="grid gap-1.5" aria-hidden="true"><i className="block h-0.5 w-5 bg-current" /><i className="block h-0.5 w-5 bg-current" /><i className="block h-0.5 w-5 bg-current" /></span>
          </button>
        </div>
        {menuOpen && <div id="mobile-navigation" className="border-t border-topo/15 py-3 xl:hidden">
          <div className="grid gap-1">{links.map(([label, href]) => <Link key={href} onClick={closeAllMenus} href={href} className="rounded-md px-3 py-2.5 text-sm font-semibold text-emerald-50 hover:bg-topo/10 hover:text-topo">{label}</Link>)}</div>
          <div className="mt-2 rounded-lg border border-topo/20 bg-white/5 p-2">
            <button type="button" onClick={() => setLearnOpen((open) => !open)} className="flex min-h-11 w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm font-bold text-topo focus:outline-none focus:ring-2 focus:ring-topo" aria-expanded={learnOpen} aria-controls="mobile-learn-navigation">
              Learn <ChevronDown aria-hidden="true" size={17} className={`transition-transform duration-200 ${learnOpen ? "rotate-180" : ""}`} />
            </button>
            {learnOpen && <div id="mobile-learn-navigation" className="mt-1 grid gap-1 border-t border-topo/15 pt-2">
              {learnLinks.map(({ label, detail, href, icon: Icon }) => <Link key={href} href={href} onClick={closeAllMenus} className="flex items-center gap-3 rounded-md px-2 py-2.5 text-emerald-50 hover:bg-topo/10 hover:text-topo"><Icon aria-hidden="true" size={18} className="shrink-0 text-topo" /><span><span className="block text-sm font-bold">{label}</span><span className="block text-xs text-emerald-100/70">{detail}</span></span></Link>)}
            </div>}
          </div>
          <Link onClick={closeAllMenus} href="/contacts#suggestions" className="mt-3 block rounded-md border border-topo px-3 py-2.5 text-center text-sm font-bold text-topo">Connect</Link>
          <Link onClick={closeAllMenus} href="/admin/login" className="mt-2 block rounded-md border border-white/35 bg-white/5 px-3 py-2.5 text-center text-sm font-bold text-white transition hover:border-topo hover:bg-topo hover:text-forest focus:outline-none focus:ring-2 focus:ring-topo focus:ring-offset-2 focus:ring-offset-forest">Admin sign in</Link>
        </div>}
      </nav>
    </header>
  );
}
