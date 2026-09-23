"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
 return <main className="mx-auto max-w-xl px-6 py-24"><h1 className="text-3xl font-bold text-forest">Content is temporarily unavailable.</h1><p className="mt-4 text-slate-600">Please try again shortly.</p><button onClick={reset} className="button-primary mt-6">Try again</button></main>;
}

