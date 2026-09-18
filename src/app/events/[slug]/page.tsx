import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

interface EventContent { title: string; detail: string; images: readonly string[]; }
const content: Record<string, EventContent> = {
  "gess-fest": { title: "NATGESS", detail: "A celebration of GESS community, activities, and shared achievements.", images: ["/assets/natgess/Image1.jpg", "/assets/natgess/Image2.jpg", "/assets/natgess/Image3.jpg"] },
  "general-assembly": { title: "GENERAL ASSEMBLY", detail: "Organization updates, conversations, and member participation.", images: ["/assets/general_assembly/AllStudents(2026GeneralAssembly).jpg", "/assets/general_assembly/GE2A.jpg", "/assets/general_assembly/GE3A.jpg", "/assets/general_assembly/GE4A.jpg", "/assets/general_assembly/GE5A.jpg"] },
  "ge-night": { title: "GE NIGHT", detail: "A dedicated night for connection across the geodetic engineering community.", images: [] },
  geodexpo: { title: "GeodExpo", detail: "A showcase for mapping, spatial data, research, and technical projects.", images: [] },
};

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = content[slug];
  if (!event) notFound();
  return <><SiteHeader /><main><section className="page-hero"><div className="relative z-10 mx-auto max-w-7xl"><p className="section-kicker">Event spotlight</p><h1 className="mt-4 text-4xl font-bold sm:text-5xl">{event.title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50/80">{event.detail}</p></div></section>{event.images.length > 0 && <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20"><h2 className="text-2xl font-bold text-forest">Event gallery</h2><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{event.images.map((src, index) => <div className={`image-frame ${index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}`} key={src}><Image alt={`${event.title} event photograph ${index + 1}`} className={`w-full object-cover ${index === 0 ? "aspect-[16/8]" : "aspect-[4/3]"}`} height={900} sizes={index === 0 ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"} src={src} width={1200} /></div>)}</div></section>}</main></>;
}
