import Link from "next/link";
import Image from "next/image";

const links = [["Events", "/events"], ["Documents", "/documents"], ["Achievements", "/achievements"], ["Officers", "/officers"], ["Merch", "/merch"], ["Contact", "/contacts"]] as const;

export function SiteHeader() {
  return <header className="sticky top-0 z-50 border-b border-topo/20 bg-forest/95 text-white shadow-lg shadow-forest/15 backdrop-blur"><nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4 sm:px-8"><Link href="/" className="group flex items-center gap-3" aria-label="GESS home"><span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-topo/60 bg-topo/15 shadow-[0_0_18px_rgba(123,198,53,.22)]"><Image alt="GESS logo" className="object-cover" fill priority sizes="44px" src="/GESS_Logo.jpg" /></span><span><span className="block font-display text-lg font-bold leading-none">GESS</span><span className="mt-1 block text-[10px] font-bold tracking-[.13em] text-topo">GEODETIC ENGINEERING STUDENTS SOCIETY</span></span></Link><div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold sm:gap-x-5">{links.map(([label, href]) => <Link key={href} href={href} className="rounded-md px-1 py-1 text-emerald-50 hover:text-topo focus:outline-none focus:ring-2 focus:ring-topo">{label}</Link>)}<Link href="/contacts#suggestions" className="rounded-lg border border-topo/40 bg-topo/15 px-3 py-2 text-topo hover:bg-topo hover:text-forest">Connect</Link></div></nav></header>;
}
