"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export interface InboxMessage {
  id: string;
  message: string;
  contact_hint: string | null;
  created_at: string;
}

interface MessageInboxProps {
  initialMessages: InboxMessage[];
}

export function MessageInbox({ initialMessages }: MessageInboxProps) {
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    const channel = createClient()
      .channel("admin-suggestions-inbox")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "suggestions" }, (payload) => {
        const incoming = payload.new as InboxMessage;
        setMessages((current) => current.some((message) => message.id === incoming.id) ? current : [incoming, ...current]);
      })
      .subscribe();

    return () => { void channel.unsubscribe(); };
  }, []);

  return <section className="surface-card p-6"><div className="flex items-start justify-between gap-4"><div><p className="section-kicker text-survey">Private inbox</p><h2 className="mt-2 text-xl font-bold text-forest">Live suggestions</h2></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Live</span></div><div className="mt-5 max-h-[31rem] space-y-3 overflow-y-auto pr-1" aria-live="polite">{messages.length ? messages.map((message) => <article className="rounded-xl border border-emerald-950/10 bg-emerald-50/45 p-4" key={message.id}><p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{message.message}</p><p className="mt-3 text-xs font-medium text-slate-500">{message.contact_hint || "Anonymous"} · {new Date(message.created_at).toLocaleString()}</p></article>) : <p className="rounded-xl border border-dashed border-emerald-950/20 p-5 text-sm text-slate-500">No suggestions yet. New secure submissions will appear here automatically.</p>}</div></section>;
}
