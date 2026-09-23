import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { publishedContent } from "@/lib/cms-data";
export const dynamic = "force-dynamic";
export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const event = (await publishedContent("events")).find(row => row.slug === slug);
 if (!event) notFound();
 return <><SiteHeader /><main className="mx-auto max-w-6xl px-6 py-16"><p className="section-kicker text-survey">Event spotlight</p><h1 className="mt-4 text-4xl font-bold text-forest">{event.title}</h1><p className="mt-4 text-survey">{event.location}</p>{event.starts_at && <time className="mt-2 block" dateTime={event.starts_at}>{new Intl.DateTimeFormat("en-PH", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(event.starts_at))}</time>}<p className="mt-6 whitespace-pre-wrap leading-8">{event.body}</p><div className="mt-10 grid gap-6 sm:grid-cols-2">{[...new Set([event.image_url, ...event.gallery_urls].filter((url): url is string => Boolean(url)))].map((src, index) => <Image src={src} alt={event.title + " photograph " + (index+1)} key={src} width={1200} height={900} className="h-auto w-full rounded-xl object-contain" />)}</div></main></>;
}
