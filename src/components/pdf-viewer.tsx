"use client";

interface PdfViewerProps {
  src: string;
  title: string;
}

export function PdfViewer({ src, title }: PdfViewerProps) {
  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/10 bg-emerald-50/80 px-5 py-4 sm:px-6">
        <div>
          <p className="section-kicker text-survey">Official directory</p>
          <p className="mt-2 font-display text-lg font-bold text-forest">{title}</p>
        </div>
        <a href={src} target="_blank" rel="noreferrer" className="button-primary px-4 py-2 text-sm">Open PDF ↗</a>
      </div>
      <div className="bg-slate-100 p-2 sm:p-3">
        <iframe title={title} src={`${src}#view=FitH&toolbar=1`} className="h-[72dvh] min-h-[30rem] w-full rounded-xl border border-slate-200 bg-white shadow-inner" loading="lazy" />
      </div>
      <p className="border-t border-emerald-950/10 px-5 py-3 text-xs leading-5 text-slate-500 sm:px-6">If the embedded viewer is unavailable in your browser, use Open PDF to view or download the directory.</p>
    </section>
  );
}
