import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { PdfViewer } from "@/components/pdf-viewer";
import { OfficerCarousel } from "@/components/officer-carousel";
import { publishedContent } from "@/lib/cms-data";
import { modules, type Module, type ContentRecord } from "@/lib/cms";

export function ContentImage({ row }: { row: ContentRecord }) {
 return row.image_url ? <Image src={row.image_url} alt={row.title} width={1200} height={900} className="max-h-[36rem] w-full bg-forest object-contain" /> : null;
}
function Card({ row, module }: { row: ContentRecord; module: Module }) {
 return <article className="surface-card overflow-hidden">
  <ContentImage row={row} />
  <div className="p-6"><h2 className="text-2xl font-bold text-forest">{row.title}</h2>
   <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">{row.excerpt || row.body}</p>
   {module === "events" && <><p className="mt-3 text-sm text-survey">{row.location}{row.starts_at && " · " + new Intl.DateTimeFormat("en-PH", { dateStyle: "long", timeZone: "Asia/Manila" }).format(new Date(row.starts_at))}</p><Link className="mt-5 inline-block font-bold text-survey" href={"/events/" + row.slug}>Explore event →</Link></>}
   {module === "journalism" && <Link className="mt-5 inline-block font-bold text-survey" href={"/blog/" + row.slug}>Read story →</Link>}
   {module === "documents" && row.file_url && <a className="mt-5 inline-block font-bold text-survey" href={row.file_url} target="_blank" rel="noreferrer">Open PDF ↗</a>}
   {module === "merch" && <><p className="mt-4 font-bold text-survey">{row.price != null && new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(row.price)}</p><p className="mt-2 text-sm">{row.availability}</p><Link className="mt-5 inline-block font-bold text-survey" href="/contacts#suggestions">Ask about availability →</Link></>}
  </div>
 </article>;
}
const headings: Record<Module, string> = {
 announcements: "What's happening at GESS.", journalism: "GESS stories", events: "Gather, learn, and build together.",
 documents: "GESS documents", achievements: "Proud moments, mapped in motion.", officers: "Meet the GESS officers.",
 merch: "Wear the work. Carry the community.",
};
export default async function PublicContent({ module }: { module: Module }) {
 const rows = await publishedContent(module);
 const documents = module === "officers" ? await publishedContent("documents") : [];
 const years = [...new Set(rows.map(row => row.year ?? 0))].sort((a,b) => b-a);
 return <><SiteHeader /><main><section className="page-hero"><div className="relative z-10 mx-auto max-w-7xl"><p className="section-kicker">{modules[module].label}</p><h1 className="mt-4 max-w-4xl text-4xl font-bold sm:text-5xl">{headings[module]}</h1></div></section>
  <section className="content-band px-6 py-14 sm:py-20"><div className="mx-auto max-w-7xl">
   {!rows.length && <p className="surface-card p-8 text-slate-600">No {modules[module].label.toLowerCase()} have been published yet.</p>}
   {module === "officers" ? <>{rows.some(row => row.image_url) && <div className="rounded-2xl bg-forest px-4 py-10 text-white"><OfficerCarousel officers={rows.filter(row => row.image_url).map(row => ({ name: row.title, role: row.role || "", committee: row.committee || "", image: row.image_url!, alt: row.title }))} /></div>}
    {rows.filter(row => !row.image_url).map(row => <Card key={row.id} row={row} module={module} />)}
    {documents.filter(row => row.slug === "officer-directory" && row.file_url).map(row => <div className="mt-12" key={row.id}><PdfViewer src={row.file_url!} title={row.title} /></div>)}</>
   : module === "achievements" ? years.map(year => <section className="mb-12" key={year}><h2 className="mb-6 border-b pb-4 text-3xl font-bold text-forest">{year || "Highlights"}</h2><div className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">{rows.filter(row => (row.year ?? 0) === year).map(row => <Card row={row} module={module} key={row.id} />)}</div></section>)
   : <div className="grid items-start gap-6 md:grid-cols-2">{rows.map(row => <Card row={row} module={module} key={row.id} />)}</div>}
  </div></section>
 </main></>;
}

