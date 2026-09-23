import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ContentImage } from "@/components/public-content";
import { publishedContent } from "@/lib/cms-data";
export const dynamic = "force-dynamic";
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const post = (await publishedContent("journalism")).find(row => row.slug === slug);
 if (!post) notFound();
 return <><SiteHeader /><main className="mx-auto max-w-3xl px-6 py-16"><ContentImage row={post} /><article className="prose prose-slate mt-8 max-w-none"><p className="font-semibold tracking-widest text-survey">JOURNALISM</p><h1>{post.title}</h1>{(post.content || post.body).split(/\n\s*\n/).map((paragraph,index) => <p className="whitespace-pre-wrap" key={index}>{paragraph}</p>)}</article></main></>;
}
