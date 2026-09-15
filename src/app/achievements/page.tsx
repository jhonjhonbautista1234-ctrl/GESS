import Image from "next/image";
import { SiteHeader } from "@/components/site-header";

const images = [
  ["Map-Making Champion", "/assets/achievements/2025/mapmakingchampion.jpg", "2025"],
  ["Quiz Show Second Place", "/assets/achievements/2025/quizshowsecondplace.jpg", "2025"],
  ["Second Best Research", "/assets/achievements/2025/secondbestresearch.jpg", "2025"],
  ["Mapping Day 2026", "/assets/achievements/2026/MD2026.jpg", "2026"],
  ["Roxy and Friends Champions", "/assets/achievements/2026/RoxyandFriendsChamp2026.jpg", "2026"],
] as const;

export default function AchievementsPage() {
  return <><SiteHeader /><main><section className="page-hero"><div className="relative z-10 mx-auto max-w-7xl"><p className="section-kicker">Achievement archive</p><h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">Proud moments, mapped in motion.</h1><p className="mt-5 max-w-xl leading-7 text-emerald-50/80">A record of the creativity, persistence, and collaboration that shape GESS.</p></div></section><section className="content-band"><div className="mx-auto max-w-7xl px-6 py-14 sm:py-20"><div className="mb-8"><p className="eyebrow-rule">Field notes</p><h2 className="mt-3 text-2xl font-bold text-forest">The work speaks for itself.</h2></div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{images.map(([title, src, year], index) => <article className={`image-frame group relative ${index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}`} key={src}><Image src={src} alt={title} width={1200} height={800} className={`w-full object-cover transition duration-500 group-hover:scale-105 ${index === 0 ? "aspect-[16/8]" : "aspect-[4/3]"}`} /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest via-forest/65 to-transparent px-5 pb-5 pt-16 text-white"><p className="text-xs font-bold tracking-[.16em] text-topo">{year}</p><h2 className="mt-1 font-display text-xl font-bold">{title}</h2></div></article>)}</div></div></section></main></>;
}
