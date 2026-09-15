import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SuggestionForm } from "@/components/suggestion-form";
import TopographicBackground from "@/components/TopographicBackground";

const destinations = [
  ["Events", "Four ways to learn, compete, and celebrate together.", "/events"],
  ["Achievements", "Recognizing work that moves our community forward.", "/achievements"],
  ["Officers", "Open the current leadership directory.", "/officers"],
  ["Merch", "Explore the GESS uniform collection.", "/merch"],
] as const;

const stats = [
  ["500+", "Active Members"],
  ["13+", "Years of Excellence"],
  ["30+", "Projects Completed"],
] as const;

export default function HomePage() {
  return (
    <><SiteHeader /><main>
      <section className="relative isolate overflow-hidden bg-[#0D2E14] px-6 py-10 text-white sm:py-12">
        <TopographicBackground />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div>
            <p className="section-kicker">USEP - EST. 2011</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[.98] sm:text-5xl lg:text-[3.25rem]">Precision in <span className="text-topo">Every</span><br />Dimension.<br />Excellence in <span className="hero-outline">Every Map.</span></h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-50/80">Empowering the next generation of spatial data scientists and geodetic engineers to measure the earth and model the future.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Link href="/contacts#suggestions" className="button-primary">Join Our Society <span className="ml-2">→</span></Link><Link href="/events" className="button-secondary">Explore Events</Link></div>
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-white/15 pt-6">{stats.map(([value, label]) => <div key={label}><p className="font-display text-3xl font-bold text-topo">{value}</p><p className="mt-1 text-xs font-semibold text-emerald-100/65">{label}</p></div>)}</div>
          </div>
          <div className="relative mx-auto hidden w-full max-w-[16rem] lg:block" aria-label="GESS emblem graphic">
            <Image src="/assets/hero/gess-hero-emblem.svg" alt="Layered green GESS emblem frame" width={640} height={640} sizes="(max-width: 1280px) 22rem, 26rem" className="h-auto w-full drop-shadow-[0_20px_44px_rgba(0,0,0,.38)]" priority unoptimized />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="section-kicker text-survey">Explore GESS</p><h2 className="mt-3 text-3xl font-bold text-forest sm:text-4xl">Find your next point of connection.</h2></div><Link href="/documents" className="font-bold text-survey underline decoration-topo decoration-2 underline-offset-4 hover:text-forest">Browse documents →</Link></div><div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{destinations.map(([title, description, href], index) => <Link key={href} href={href} className="interactive-card group p-6"><span className="font-display text-sm font-bold text-topo">0{index + 1}</span><h3 className="mt-8 text-xl font-bold text-forest">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{description}</p><span className="mt-6 inline-block font-bold text-survey group-hover:text-forest">Explore →</span></Link>)}</div></section>
      <section id="suggestions" className="border-y border-emerald-950/10 bg-emerald-50/60"><div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[.9fr_1.1fr] lg:items-start"><div><p className="section-kicker text-survey">Your voice matters</p><h2 className="mt-3 text-3xl font-bold text-forest">Announcements, stories, and suggestions.</h2><p className="mt-5 max-w-md leading-7 text-slate-600">Read official updates, discover journalism from the community, or send a private comment to the GESS administrators.</p><div className="mt-6 flex gap-5"><Link className="font-bold text-survey underline decoration-topo decoration-2 underline-offset-4" href="/announcements">Announcements</Link><Link className="font-bold text-survey underline decoration-topo decoration-2 underline-offset-4" href="/blog">Journalism blog</Link></div></div><SuggestionForm /></div></section>
    </main></>
  );
}
