"use client";

import { Grid2X2, Save, Send } from "lucide-react";
import { useActionState, useState } from "react";
import { saveAnnouncement } from "@/app/admin/dashboard/announcements/actions";
import AnnouncementArtwork from "@/components/announcement-artwork";
import { initialAnnouncementActionState, type AdminAnnouncement } from "@/features/announcements/admin-types";
import { defaultAnnouncementDesign, type AnnouncementDesign } from "@/features/announcements/design";
import { ActionFeedback } from "./announcement-row";

export default function AnnouncementEditor({ announcement, onCancel }: { announcement: AdminAnnouncement | null; onCancel: () => void }) {
  const [state, action, pending] = useActionState(saveAnnouncement, initialAnnouncementActionState);
  const [title, setTitle] = useState(announcement?.title ?? "");
  const [excerpt, setExcerpt] = useState(announcement?.excerpt ?? "");
  const [body, setBody] = useState(announcement?.body ?? "");
  const [pinned, setPinned] = useState(announcement?.isPinned ?? false);
  const [design, setDesign] = useState<AnnouncementDesign>(announcement?.design ?? defaultAnnouncementDesign);
  const [showGuides, setShowGuides] = useState(true);
  const updateDesign = <Key extends keyof AnnouncementDesign>(key: Key, value: AnnouncementDesign[Key]) => setDesign((current) => ({ ...current, [key]: value }));

  return <form action={action}>
    <input type="hidden" name="id" value={announcement?.id ?? ""} />
    <input type="hidden" name="design" value={JSON.stringify(design)} />
    <div className="studio-creator">
      <div>
        <div className="studio-toolbar">
          <div className="flex gap-1">
            {(["1 / 1", "16 / 9", "4 / 5"] as const).map((aspect) => <button className="studio-button" type="button" aria-pressed={design.aspect === aspect} onClick={() => updateDesign("aspect", aspect)} key={aspect}>{aspect.replace(" / ", ":")}</button>)}
          </div>
          <button className="studio-button" type="button" aria-pressed={showGuides} onClick={() => setShowGuides((current) => !current)}><Grid2X2 size={14} />Guides</button>
        </div>
        <div className="studio-canvas-wrap"><AnnouncementArtwork title={title} excerpt={excerpt} design={design} grid={showGuides} /></div>
        <p className="studio-muted mt-3">Live card preview. Guides are visible only while editing.</p>
        <div className="studio-card mt-5">
          <label className="studio-field">Full announcement
            <textarea name="body" rows={6} required minLength={3} maxLength={10_000} value={body} onChange={(event) => setBody(event.target.value)} aria-invalid={Boolean(state.fieldErrors?.body?.length)} />
            {state.fieldErrors?.body?.[0] && <span className="studio-field-error">{state.fieldErrors.body[0]}</span>}
            <small>The complete message appears below the card on the public page.</small>
          </label>
        </div>
      </div>
      <aside className="studio-card">
        <div className="mb-5 flex items-center justify-between border-b pb-4"><h2 className="studio-label">Design controls</h2><span className="studio-badge">{announcement ? "Editing" : "New"}</span></div>
        <label className="studio-field">Headline
          <input name="title" required minLength={3} maxLength={180} value={title} onChange={(event) => setTitle(event.target.value)} aria-invalid={Boolean(state.fieldErrors?.title?.length)} />
          {state.fieldErrors?.title?.[0] && <span className="studio-field-error">{state.fieldErrors.title[0]}</span>}
        </label>
        <label className="studio-field">Supporting copy
          <textarea name="excerpt" rows={4} maxLength={500} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} aria-invalid={Boolean(state.fieldErrors?.excerpt?.length)} />
          {state.fieldErrors?.excerpt?.[0] && <span className="studio-field-error">{state.fieldErrors.excerpt[0]}</span>}
          <small>Optional. Keep it short enough to read on the card.</small>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="studio-field">Palette<input type="color" value={design.color} onChange={(event) => updateDesign("color", event.target.value)} /></label>
          <label className="studio-field">Weight<select value={design.weight} onChange={(event) => updateDesign("weight", event.target.value as AnnouncementDesign["weight"])}><option value="400">Regular</option><option value="600">Semibold</option><option value="700">Bold</option></select></label>
        </div>
        <RangeControl label="Letter spacing" value={design.tracking} min={-0.06} max={0.06} step={0.01} onChange={(value) => updateDesign("tracking", value)} />
        <RangeControl label="Corner radius" value={design.radius} min={0} max={40} onChange={(value) => updateDesign("radius", value)} />
        <RangeControl label="Shadow depth" value={design.shadow} min={0} max={60} onChange={(value) => updateDesign("shadow", value)} />
        <label className="studio-toggle"><input type="checkbox" checked={design.overlay} onChange={(event) => updateDesign("overlay", event.target.checked)} />Overlay gradient</label>
        <label className="studio-toggle"><input type="checkbox" name="isPinned" value="true" checked={pinned} onChange={(event) => setPinned(event.target.checked)} />Pin to the top of announcements</label>
        <ActionFeedback state={state} />
        <div className="mt-5 grid gap-2 border-t pt-5">
          <button className="studio-button is-primary" name="intent" value="publish" disabled={pending}><Send size={14} />{pending ? "Saving…" : "Publish to website"}</button>
          <button className="studio-button" name="intent" value="save-draft" disabled={pending}><Save size={14} />Save draft</button>
          {announcement && <button className="studio-button" type="button" onClick={onCancel}>Finish editing</button>}
        </div>
      </aside>
    </div>
  </form>;
}

function RangeControl({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  return <label className="studio-field">{label}<span className="float-right">{value.toFixed(step < 1 ? 2 : 0)}</span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}
