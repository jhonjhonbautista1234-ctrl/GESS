"use client";

import { Archive, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { useActionState } from "react";
import { changeAnnouncementState } from "@/app/admin/dashboard/announcements/actions";
import { initialAnnouncementActionState, type AdminAnnouncement, type AnnouncementActionState } from "@/features/announcements/admin-types";

export function ActionFeedback({ state }: { state: AnnouncementActionState }) {
  if (state.status === "idle") return null;
  return <p role={state.status === "error" ? "alert" : "status"} className={`studio-alert ${state.status === "error" ? "is-error" : ""}`}>{state.message}</p>;
}

export default function AnnouncementRow({ announcement, onEdit }: { announcement: AdminAnnouncement; onEdit: () => void }) {
  const [state, action, pending] = useActionState(changeAnnouncementState, initialAnnouncementActionState);
  const date = new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeZone: "Asia/Manila" }).format(new Date(announcement.updatedAt));
  return <article className="studio-list-row">
    <div className="min-w-0 flex-1">
      <span className="studio-badge">{announcement.deletedAt ? "Removed" : announcement.status}</span>
      {announcement.isPinned && <span className="studio-badge ml-2">Pinned</span>}
      <h3>{announcement.title}</h3>
      <p className="studio-muted">Updated {date}</p>
    </div>
    <div>
      {!announcement.deletedAt && <button className="studio-button mb-2" onClick={onEdit} type="button"><Pencil size={14} />Edit announcement</button>}
      <form action={action}>
        <input type="hidden" name="id" value={announcement.id} />
        <div className="flex flex-wrap gap-2">
          {announcement.deletedAt ? <button className="studio-button" disabled={pending} name="intent" value="restore"><RotateCcw size={14} />Restore as draft</button> : <>
            <button className="studio-button" disabled={pending || announcement.status === "archived"} name="intent" value="archive"><Archive size={14} />Archive</button>
            <button className="studio-button is-danger" disabled={pending} name="intent" value="delete" onClick={(event) => { if (!window.confirm("Remove this announcement from the public site? You can restore it later as a draft.")) event.preventDefault(); }}><Trash2 size={14} />Remove</button>
          </>}
        </div>
        <ActionFeedback state={state} />
      </form>
    </div>
  </article>;
}
