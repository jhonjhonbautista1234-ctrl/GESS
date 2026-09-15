import Image from "next/image";
import Link from "next/link";

const links = [
  ["Events", "/events"],
  ["Documents", "/documents"],
  ["Achievements", "/achievements"],
  ["Officers", "/officers"],
  ["Merch", "/merch"],
  ["Contact", "/contacts"],
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-survey/35 bg-[#050f07] px-5 py-9 text-white sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 sm:flex-row sm:items-center">
        <Link href="/" className="flex items-center gap-3" aria-label="GESS home">
          <span className="relative h-9 w-9 overflow-hidden rounded-full border border-topo/50">
            <Image src="/GESS_Logo.jpg" alt="GESS logo" fill sizes="36px" className="object-cover" />
          </span>
          <span>
            <span className="block font-display text-sm font-bold">GESS</span>
            <span className="block text-xs text-white/45">Geodetic Engineering Students Society</span>
          </span>
        </Link>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-white/50">
          {links.map(([label, href]) => <Link key={href} href={href} className="hover:text-topo focus:outline-none focus:ring-2 focus:ring-topo">{label}</Link>)}
        </nav>
        <p className="text-xs text-white/35">© {new Date().getFullYear()} GESS. All rights reserved.</p>
      </div>
    </footer>
  );
}
