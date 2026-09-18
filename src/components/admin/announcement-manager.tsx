"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";
import type { AdminAnnouncement } from "@/features/announcements/admin-types";
import AnnouncementEditor from "./announcement-editor";
import AnnouncementRow from "./announcement-row";

export function AnnouncementManager({ announcements }: { announcements: AdminAnnouncement[] }) {
  const [editing, setEditing] = useState<AdminAnnouncement | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [newKey, setNewKey] = useState(0);
  const filtered = announcements.filter((item) => {
    const textMatches = item.title.toLowerCase().includes(query.toLowerCase());
    const statusMatches = filter === "removed"
      ? Boolean(item.deletedAt)
      : !item.deletedAt && (filter === "all" || item.status === filter);
    return textMatches && statusMatches;
  });

  function createNew() {
    setEditing(null);
    setNewKey((current) => current + 1);
  }

  return (
    <>
      <header className="studio-page-head">
        <div>
          <p className="studio-eyebrow">Creator / Announcements</p>
          <h1 className="studio-heading">Craft your announcements.</h1>
          <p className="studio-muted">Compose on canvas, review the details, and publish to your website.</p>
        </div>
        <button className="studio-button" onClick={createNew} type="button"><Plus size={16} />New announcement</button>
      </header>

      <AnnouncementEditor
        announcement={editing}
        key={editing ? `${editing.id}:${editing.updatedAt}` : `new:${newKey}`}
        onCancel={createNew}
      />

      <section className="studio-library" aria-labelledby="library-title">
        <div className="studio-page-head">
          <div>
            <p className="studio-eyebrow">Content library</p>
            <h2 id="library-title" className="text-xl font-bold">Your announcements</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2">
              <Search aria-hidden="true" size={16} />
              <input className="studio-input !mt-0" aria-label="Search announcements" placeholder="Search announcements…" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <select className="studio-input !mt-0 !w-auto" aria-label="Filter by status" value={filter} onChange={(event) => setFilter(event.target.value)}>
              {["all", "published", "draft", "archived", "removed"].map((value) => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div className="studio-list">
          {filtered.map((item) => <AnnouncementRow key={item.id} announcement={item} onEdit={() => { setEditing(item); document.getElementById("studio-content")?.scrollIntoView({ block: "start" }); }} />)}
          {!filtered.length && <div className="studio-card studio-muted">No announcements in this view. Create an update above or change the filter.</div>}
        </div>
        <p className="studio-muted mt-3">Showing up to 100 recently updated announcements.</p>
      </section>
    </>
  );
}
