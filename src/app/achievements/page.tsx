import Image from "next/image";
import { SiteHeader } from "@/components/site-header";

interface Achievement {
  title: string;
  src: string;
  alt: string;
  displayRatio: "square" | "landscape";
}

const achievementsByYear: Record<"2026" | "2025", Achievement[]> = {
  "2026": [
    { title: "Mapping Day 2026", src: "/assets/achievements/2026/MD2026.jpg", alt: "GESS members during Mapping Day 2026", displayRatio: "square" },
    { title: "Roxy and Friends Champions", src: "/assets/achievements/2026/RoxyandFriendsChamp2026.jpg", alt: "GESS Roxy and Friends champions in 2026", displayRatio: "landscape" },
  ],
  "2025": [
    { title: "Map-Making Champion", src: "/assets/achievements/2025/mapmakingchampion.jpg", alt: "GESS Map-Making Champion recognition in 2025", displayRatio: "square" },
    { title: "Quiz Show Second Place", src: "/assets/achievements/2025/quizshowsecondplace.jpg", alt: "GESS Quiz Show Second Place recognition in 2025", displayRatio: "square" },
    { title: "Second Best Research", src: "/assets/achievements/2025/secondbestresearch.jpg", alt: "GESS Second Best Research recognition in 2025", displayRatio: "square" },
  ],
};

function YearGallery({ year, items }: { year: "2026" | "2025"; items: Achievement[] }) {
  return (
    <section className="mt-12 first:mt-0">
      <div className="mb-6 flex items-end justify-between border-b border-emerald-950/10 pb-4">
        <div>
          <p className="section-kicker text-survey">Achievement year</p>
          <h2 className="mt-2 text-3xl font-bold text-forest">{year}</h2>
        </div>
        <p className="text-sm text-slate-500">{items.length} highlights</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <article key={item.src} className="surface-card group overflow-hidden">
            <div className={`relative bg-[#0D2E14] ${item.displayRatio === "square" ? "aspect-square" : "aspect-[4/3]"}`}>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
                priority={year === "2026" && index === 0}
              />
            </div>
            <div className="border-t border-topo/20 bg-forest px-5 py-4 text-white">
              <p className="text-xs font-bold tracking-[.16em] text-topo">{year}</p>
              <h3 className="mt-1 font-display text-xl font-bold">{item.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function AchievementsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="relative z-10 mx-auto max-w-7xl">
            <p className="section-kicker">Achievement archive</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">Proud moments, mapped in motion.</h1>
            <p className="mt-5 max-w-xl leading-7 text-emerald-50/80">A record of the creativity, persistence, and collaboration that shape GESS.</p>
          </div>
        </section>
        <section className="content-band">
          <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
            <YearGallery year="2026" items={achievementsByYear["2026"]} />
            <YearGallery year="2025" items={achievementsByYear["2025"]} />
          </div>
        </section>
      </main>
    </>
  );
}
