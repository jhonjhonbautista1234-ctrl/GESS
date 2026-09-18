import type { AnnouncementDesign } from "@/features/announcements/design";
export default function AnnouncementArtwork({ title, excerpt, design, grid = false }: {
  title: string; excerpt: string | null; design: AnnouncementDesign; grid?: boolean;
}) {
  return <div className={`studio-canvas ${grid ? "is-grid" : ""}`} style={{ position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden", padding: "8%", minHeight: 220, aspectRatio: design.aspect, backgroundColor: design.color, backgroundImage: design.overlay ? "linear-gradient(130deg,rgba(4,14,7,.82),rgba(4,14,7,.3) 60%,rgba(123,198,53,.18))" : undefined, borderRadius: design.radius, boxShadow: `0 ${design.shadow / 2}px ${design.shadow}px #0004`, color: "white" }}>
    <div className="studio-canvas-copy" style={{ position: "relative", zIndex: 1, overflowWrap: "anywhere", maxWidth: "100%" }}>
      <span className="mb-3 inline-block rounded-full border border-white/30 bg-black/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em]">GESS / Announcements</span>
      <h2 style={{ fontWeight: Number(design.weight), letterSpacing: `${design.tracking}em` }} className="text-3xl leading-tight sm:text-4xl">{title || "Your announcement headline"}</h2>
      {excerpt && <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{excerpt}</p>}
    </div>
  </div>;
}
