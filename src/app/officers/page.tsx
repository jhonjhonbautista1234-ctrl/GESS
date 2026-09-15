import { PdfViewer } from "@/components/pdf-viewer";
import { SiteHeader } from "@/components/site-header";

const officersPdf = "/assets/officers/officers.pdf";

export default function OfficersPage() {
  return <><SiteHeader /><main><section className="page-hero"><div className="relative z-10 mx-auto max-w-7xl"><p className="section-kicker">Leadership</p><h1 className="mt-4 max-w-2xl text-4xl font-bold sm:text-5xl">Meet the people guiding GESS forward.</h1><p className="mt-5 max-w-xl text-base leading-7 text-emerald-50/80">Browse the current officer directory directly in your browser, or download a copy for offline reference.</p></div></section><section className="mx-auto max-w-7xl px-6 py-12 sm:py-16"><PdfViewer title="GESS Officers Directory" src={officersPdf} /></section></main></>;
}
