"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  ["Events", "/events"],
  ["Documents", "/documents"],
  ["Achievements", "/achievements"],
  ["Officers", "/officers"],
  ["Merch", "/merch"],
  ["Contact", "/contacts"],
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-topo/15 bg-forest/95 text-white shadow-lg shadow-forest/15 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 items-center gap-5">
          <Link href="/" onClick={closeMenu} className="group flex min-w-0 items-center gap-3" aria-label="GESS home">
            <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-topo/60 bg-topo/15 shadow-[0_0_18px_rgba(123,198,53,.22)]">
              <Image alt="GESS logo" className="object-cover" fill priority sizes="44px" src="/GESS_Logo.jpg" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-lg font-bold leading-none">GESS</span>
              <span className="mt-1 block truncate text-[9px] font-bold tracking-[.12em] text-topo sm:text-[10px]">GEODETIC ENGINEERING STUDENTS SOCIETY</span>
            </span>
          </Link>
          <div className="ml-auto hidden items-center gap-1 lg:flex">
            {links.map(([label, href]) => <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm font-semibold text-emerald-50 transition hover:bg-topo/10 hover:text-topo focus:outline-none focus:ring-2 focus:ring-topo">{label}</Link>)}
            <Link href="/contacts#suggestions" className="ml-2 rounded-md border border-topo px-4 py-2 text-sm font-bold text-topo transition hover:bg-topo hover:text-forest">Connect</Link>
          </div>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} className="ml-auto grid h-10 w-10 place-items-center rounded-md border border-topo/25 text-topo lg:hidden" aria-controls="mobile-navigation" aria-expanded={menuOpen} aria-label="Toggle navigation">
            <span className="grid gap-1.5" aria-hidden="true"><i className="block h-0.5 w-5 bg-current" /><i className="block h-0.5 w-5 bg-current" /><i className="block h-0.5 w-5 bg-current" /></span>
          </button>
        </div>
        {menuOpen && <div id="mobile-navigation" className="border-t border-topo/15 py-3 lg:hidden">
          <div className="grid gap-1">{links.map(([label, href]) => <Link key={href} onClick={closeMenu} href={href} className="rounded-md px-3 py-2.5 text-sm font-semibold text-emerald-50 hover:bg-topo/10 hover:text-topo">{label}</Link>)}</div>
          <Link onClick={closeMenu} href="/contacts#suggestions" className="mt-3 block rounded-md border border-topo px-3 py-2.5 text-center text-sm font-bold text-topo">Connect</Link>
        </div>}
      </nav>
    </header>
  );
}
