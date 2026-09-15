"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function RegisterAdminPage() {
  const [status, setStatus] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(undefined);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password"), inviteSecret: form.get("inviteSecret") }) });
      setStatus(response.ok ? "Administrator created. You can now sign in." : "Unable to create an administrator. Check the details and secret key.");
      if (response.ok) event.currentTarget.reset();
    } catch { setStatus("The request could not be completed. Please try again."); }
    finally { setSubmitting(false); }
  }

  return <main className="topo-surface grid min-h-dvh place-items-center p-6"><form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-white/15 bg-white p-7 shadow-2xl sm:p-9"><p className="section-kicker text-survey">Restricted setup</p><h1 className="mt-3 text-3xl font-bold text-forest">Create an administrator</h1><p className="mt-3 text-sm leading-6 text-slate-600">This route requires the organization&apos;s administrator invite secret.</p><label className="mt-6 block text-sm font-semibold text-slate-700">Email<input autoComplete="email" className="mt-2 h-11 w-full rounded-lg border px-3" name="email" required type="email" /></label><label className="mt-4 block text-sm font-semibold text-slate-700">Password<input autoComplete="new-password" className="mt-2 h-11 w-full rounded-lg border px-3" minLength={12} name="password" required type="password" /></label><label className="mt-4 block text-sm font-semibold text-slate-700">Invite secret<input autoComplete="off" className="mt-2 h-11 w-full rounded-lg border px-3" name="inviteSecret" required type="password" /></label><button className="button-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting} type="submit">{submitting ? "Creating administrator…" : "Create administrator"}</button>{status && <p aria-live="polite" className="mt-4 text-sm text-slate-700">{status}</p>}<Link className="mt-5 inline-block text-sm font-bold text-survey underline decoration-topo decoration-2 underline-offset-4" href="/admin/login">Back to sign in</Link></form></main>;
}
