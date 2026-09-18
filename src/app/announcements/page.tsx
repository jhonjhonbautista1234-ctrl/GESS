import { SiteHeader } from "@/components/site-header";
import { getPublishedAnnouncements } from "@/features/announcements/queries";
import { connection } from "next/server";

export const revalidate = 300;

const publishedDateFormatter = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "long",
  timeZone: "Asia/Manila",
});

export default async function AnnouncementsPage() {
  // Keep the route request-rendered so a deployment never needs a live
  // Supabase connection while building. The data function remains cached.
  await connection();
  const announcements = await getPublishedAnnouncements();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="relative z-10 mx-auto max-w-7xl">
            <p className="section-kicker">Official updates</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">
              What&apos;s happening at GESS.
            </h1>
            <p className="mt-5 max-w-2xl leading-7 text-emerald-50/80">
              Stay informed about society announcements, opportunities, and important dates.
            </p>
          </div>
        </section>

        <section className="content-band">
          <div className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow-rule">Latest notices</p>
                <h2 className="mt-3 text-2xl font-bold text-forest">Announcements</h2>
              </div>
              <p className="hidden text-sm font-medium text-slate-500 sm:block">
                {announcements.length} {announcements.length === 1 ? "update" : "updates"}
              </p>
            </div>

            {announcements.length > 0 ? (
              <div className="space-y-5">
                {announcements.map((announcement) => (
                  <article className="interactive-card overflow-hidden" key={announcement.id}>
                    <div
                      className="relative flex min-h-56 items-end overflow-hidden p-7 text-white sm:p-9"
                      style={{
                        aspectRatio: announcement.design.aspect,
                        backgroundColor: announcement.design.color,
                        backgroundImage: announcement.design.overlay ? "linear-gradient(130deg,rgba(4,14,7,.82),rgba(4,14,7,.28) 60%,rgba(123,198,53,.18))" : undefined,
                        borderRadius: announcement.design.radius,
                        boxShadow: `0 ${announcement.design.shadow / 2}px ${announcement.design.shadow}px rgba(0,0,0,.25)`,
                      }}
                    >
                      <div className="relative z-10 max-w-3xl">
                        <span className="inline-block rounded-full border border-white/30 bg-black/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em]">GESS / Announcements</span>
                        <h2 className="mt-4 text-3xl leading-tight sm:text-4xl" style={{ fontWeight: Number(announcement.design.weight), letterSpacing: `${announcement.design.tracking}em` }}>{announcement.title}</h2>
                        {announcement.excerpt && <p className="mt-4 max-w-2xl leading-7 text-emerald-50/90">{announcement.excerpt}</p>}
                      </div>
                    </div>
                    <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold uppercase tracking-[.14em] text-survey">
                      {announcement.isPinned ? (
                        <span className="rounded-full bg-topo/15 px-3 py-1 text-survey">Pinned</span>
                      ) : null}
                      <time dateTime={announcement.publishedAt}>
                        {publishedDateFormatter.format(new Date(announcement.publishedAt))}
                      </time>
                    </div>
                    <p className="mt-4 max-w-3xl whitespace-pre-wrap leading-7 text-slate-600">{announcement.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <section className="surface-card border-dashed p-8 text-center sm:p-12" aria-labelledby="empty-announcements-title">
                <p className="section-kicker justify-center">Clear for now</p>
                <h2 className="mt-4 text-2xl font-bold text-forest" id="empty-announcements-title">
                  No announcements have been published yet.
                </h2>
                <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
                  Please check back soon for verified society updates.
                </p>
              </section>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
