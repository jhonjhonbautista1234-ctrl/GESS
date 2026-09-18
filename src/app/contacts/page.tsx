import { Facebook, LockKeyhole, MessageSquareText } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SuggestionForm } from "@/components/suggestion-form";

const facebookUrl = "https://www.facebook.com/profile.php?id=61582013982147";

export default function ContactsPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-forest text-white">
        <section className="topo-surface border-b border-topo/15 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="section-kicker">Community connection</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">Stay connected with <span className="text-topo">GESS.</span></h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-50/80">Follow the conversation, share an idea, or send a private note to the GESS administrators.</p>
          </div>
        </section>

        <section className="topo-grid px-6 py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.95fr_1.05fr] lg:items-start">
            <div className="space-y-4">
              <ContactCard icon={<Facebook aria-hidden="true" className="h-5 w-5 text-topo" />} label="Public updates" title="GESS on Facebook" description="See organization news, community stories, and recent activity.">
                <a className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-topo/35 px-4 text-sm font-bold text-topo transition hover:border-topo hover:bg-topo hover:text-forest focus:outline-none focus:ring-2 focus:ring-topo focus:ring-offset-2 focus:ring-offset-forest" href={facebookUrl} rel="noreferrer" target="_blank">Visit Facebook</a>
              </ContactCard>
              <ContactCard icon={<LockKeyhole aria-hidden="true" className="h-5 w-5 text-topo" />} label="Private inbox" title="Message the administrators" description="Suggestions submitted here are available only to authorized GESS administrators." />
              <ContactCard icon={<MessageSquareText aria-hidden="true" className="h-5 w-5 text-topo" />} label="Share an idea" title="Help shape the community" description="Tell us about an opportunity, improvement, or topic that would benefit GESS members." />
            </div>

            <section id="suggestions" aria-labelledby="message-heading" className="rounded-2xl border border-topo/25 bg-white/[.055] p-5 shadow-2xl shadow-black/15 sm:p-7">
              <p className="section-kicker">Send a message</p>
              <h2 id="message-heading" className="mt-3 text-2xl font-bold">Start a conversation.</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/70">Use this form to send feedback or a question directly to the GESS team.</p>
              <div className="mt-6"><SuggestionForm variant="dark" /></div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

function ContactCard({ children, description, icon, label, title }: { children?: React.ReactNode; description: string; icon: React.ReactNode; label: string; title: string }) {
  return <article className="rounded-xl border border-topo/20 bg-white/[.035] p-5 transition duration-200 hover:border-topo/45 hover:bg-white/[.055]"><div className="flex items-start gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-topo/20 bg-topo/10">{icon}</span><div><p className="text-[11px] font-bold uppercase tracking-[.14em] text-topo/80">{label}</p><h2 className="mt-1 font-display text-lg font-bold text-white">{title}</h2><p className="mt-1.5 max-w-md text-sm leading-6 text-emerald-50/75">{description}</p>{children}</div></div></article>;
}
