"use client";

import { useMemo, useState } from "react";

interface ThemeValues { accent: string; canvas: string; surface: string; }

const initialTheme: ThemeValues = { accent: "#7bc635", canvas: "#041007", surface: "#0d1a10" };

export function ThemePreview() {
  const [theme, setTheme] = useState<ThemeValues>(initialTheme);
  const previewStyle = useMemo(() => ({ background: theme.canvas, borderColor: `${theme.accent}66` }), [theme]);
  return <>
    <header className="studio-page-head"><div><p className="studio-eyebrow">Design / Theme engine</p><h1 className="studio-heading">Design system preview.</h1><p className="studio-muted max-w-2xl">Explore the established forest, lime, and surface tokens without altering the live public theme.</p></div><button className="studio-button" type="button" onClick={() => setTheme(initialTheme)}>Reset preview</button></header>
    <section className="studio-theme-layout"><form className="studio-card"><p className="studio-label">Preview tokens</p><div className="mt-5 grid gap-4">{(["accent", "canvas", "surface"] as const).map((key) => <label className="studio-field" key={key}>{key}<input type="color" value={theme[key]} onChange={(event) => setTheme((current) => ({ ...current, [key]: event.target.value }))} /><small>{theme[key].toUpperCase()}</small></label>)}</div><p className="studio-muted mt-4">This is a safe local preview. Production colors remain version-controlled in the global stylesheet.</p></form>
      <div className="studio-theme-preview" style={previewStyle}><span style={{ color: theme.accent }} className="studio-badge">GESS / Content Studio</span><h2>Precision in every decision.</h2><p>Clean hierarchy, focused actions, and a calm publishing environment.</p><div><button type="button" style={{ background: theme.accent, color: theme.canvas }}>Primary action</button><button type="button" style={{ borderColor: `${theme.accent}99`, color: theme.accent }}>Secondary action</button></div><article style={{ background: theme.surface }}><strong>Content status</strong><span style={{ color: theme.accent }}>Ready to publish</span></article></div>
    </section>
  </>;
}
