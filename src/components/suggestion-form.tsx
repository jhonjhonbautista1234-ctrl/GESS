"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type SuggestionFormProps = { variant?: "light" | "dark" };

export function SuggestionForm({ variant = "light" }: SuggestionFormProps) {
  const [status, setStatus] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const isDark = variant === "dark";
  const detailed = variant === "dark";
  const inputClass = isDark
    ? "mt-2 h-11 w-full rounded-lg border border-topo/25 bg-white/[.06] px-3 text-white placeholder:text-emerald-50/40 focus:border-topo focus:outline-none focus:ring-2 focus:ring-topo/35"
    : "mt-2 h-11 w-full rounded-lg border p-3 focus:border-topo focus:outline-none focus:ring-2 focus:ring-topo/30";
  const textareaClass = isDark
    ? "mt-2 min-h-32 w-full rounded-lg border border-topo/25 bg-white/[.06] p-3 text-white placeholder:text-emerald-50/40 focus:border-topo focus:outline-none focus:ring-2 focus:ring-topo/35"
    : "mt-2 min-h-28 w-full rounded-lg border p-3 focus:border-topo focus:outline-none focus:ring-2 focus:ring-topo/30";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(undefined);
    const form = new FormData(event.currentTarget);
    const name = detailed ? String(form.get("name") ?? "").trim() : "";
    const email = String(form.get(detailed ? "email" : "contactHint") ?? "").trim();
    const subject = detailed ? String(form.get("subject") ?? "").trim() : "";
    const message = String(form.get("message") ?? "").trim();
    const submission = [subject ? `Subject: ${subject}` : "", name ? `From: ${name}` : "", message].filter(Boolean).join("\n\n");

    try {
      const { error } = await createClient().from("suggestions").insert({ message: submission, contact_hint: email || null });
      setStatus(error ? "Unable to send your message. Please try again." : "Thank you. Your message was sent.");
      if (!error) event.currentTarget.reset();
    } catch {
      setStatus("The request timed out. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const labelClass = isDark ? "block text-xs font-bold uppercase tracking-[.12em] text-topo/85" : "block text-sm font-medium text-slate-700";

  return <form onSubmit={submit} className={isDark ? "" : "surface-card p-6"}>
    {!isDark && <h2 className="text-xl font-bold text-forest">Suggestions & comments</h2>}
    {detailed ? <><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className={labelClass}>Your name<input autoComplete="name" maxLength={100} name="name" className={inputClass} /></label><label className={labelClass}>Email address<input autoComplete="email" maxLength={180} name="email" type="email" className={inputClass} /></label></div><label className={`mt-4 ${labelClass}`}>Subject<input maxLength={160} name="subject" className={inputClass} /></label></> : null}
    <label className={`mt-4 ${labelClass}`}>Message <span className={isDark ? "text-emerald-50/50" : "text-slate-500"}>required</span><textarea required minLength={3} maxLength={3000} name="message" className={textareaClass} /></label>
    {!detailed && <label className={`mt-4 ${labelClass}`}>Contact detail <span className="text-slate-500">optional</span><input maxLength={180} name="contactHint" className={inputClass} /></label>}
    <button className={`${isDark ? "mt-5 w-full rounded-lg bg-topo px-5 py-3 font-bold text-forest shadow-lg shadow-topo/10 transition hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-topo focus:ring-offset-2 focus:ring-offset-forest" : "button-primary mt-5"} disabled:cursor-not-allowed disabled:opacity-60`} disabled={submitting} type="submit">{submitting ? "Sending…" : "Send message"}</button>
    {status && <p aria-live="polite" className={`mt-3 text-sm ${isDark ? "text-emerald-50" : "text-slate-700"}`}>{status}</p>}
  </form>;
}
