import { SiteHeader } from "@/components/site-header";

export default function AnnouncementsLoading() {
  return (
    <>
      <SiteHeader />
      <main aria-busy="true" aria-label="Loading announcements">
        <section className="page-hero">
          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="h-4 w-36 animate-pulse rounded bg-topo/30" />
            <div className="mt-5 h-12 max-w-2xl animate-pulse rounded bg-white/15" />
            <div className="mt-5 h-5 max-w-xl animate-pulse rounded bg-white/10" />
          </div>
        </section>
        <section className="content-band">
          <div className="mx-auto max-w-5xl space-y-5 px-6 py-14 sm:py-20">
            {[0, 1, 2].map((index) => (
              <div className="surface-card animate-pulse p-8" key={index}>
                <div className="h-3 w-28 rounded bg-emerald-950/10" />
                <div className="mt-5 h-8 max-w-xl rounded bg-emerald-950/10" />
                <div className="mt-5 h-5 max-w-3xl rounded bg-emerald-950/10" />
                <div className="mt-3 h-5 max-w-2xl rounded bg-emerald-950/10" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
