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

  return <section className="studio-card"><div className="flex items-start justify-between gap-4"><div><p className="studio-eyebrow">Private inbox</p><h2 className="text-xl font-bold text-white">Live suggestions</h2></div><span className="studio-badge">Live</span></div><div className="mt-5 max-h-[31rem] space-y-3 overflow-y-auto pr-1" aria-live="polite">{messages.length ? messages.map((message) => <article className="rounded-xl border border-white/10 bg-white/[.025] p-4" key={message.id}><p className="whitespace-pre-wrap text-sm leading-6 text-emerald-50">{message.message}</p><p className="studio-muted mt-3">{message.contact_hint || "Anonymous"} · {new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(message.created_at))}</p></article>) : <p className="rounded-xl border border-dashed border-white/20 p-5 text-sm text-emerald-50/65">No suggestions yet. New submissions will appear here automatically.</p>}</div></section>;
}
