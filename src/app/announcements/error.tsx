"use client";

import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header";

export default function AnnouncementsError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error("Failed to render public announcements.", error);
  }, [error]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[55vh] max-w-5xl items-center px-6 py-16 sm:py-24">
        <section className="surface-card w-full p-8 sm:p-12" aria-labelledby="announcement-error-title">
          <p className="section-kicker">Temporarily unavailable</p>
          <h1 className="mt-4 text-3xl font-bold text-forest sm:text-4xl" id="announcement-error-title">
            Announcements could not be loaded.
          </h1>
          <p className="mt-4 max-w-xl leading-7 text-slate-600">
            Please try again in a moment. The rest of the GESS website remains available.
          </p>
          <button className="button-primary mt-7" onClick={reset} type="button">
            Try again
          </button>
        </section>
      </main>
    </>
  );
}
