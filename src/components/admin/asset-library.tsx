import Link from "next/link";
import { ArrowUpRight, FileText, Image as ImageIcon } from "lucide-react";
import type { AdminAsset, AssetSection } from "@/lib/admin-assets";

interface AssetLibraryProps {
  section: AssetSection;
  assets: AdminAsset[];
}

function isImage(asset: AdminAsset): boolean {
  return asset.extension !== ".pdf";
}

export function AssetLibrary({ section, assets }: AssetLibraryProps) {
  return <>
    <header className="studio-page-head">
      <div><p className="studio-eyebrow">{section.eyebrow}</p><h1 className="studio-heading">{section.title}</h1><p className="studio-muted max-w-2xl">{section.description}</p></div>
      <Link className="studio-button is-primary" href={section.publicHref} target="_blank" rel="noreferrer">{section.publicLabel}<ArrowUpRight size={15} /></Link>
    </header>
    <section className="studio-card">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="studio-label">Published media</p><h2 className="mt-2 text-xl font-bold text-white">{assets.length} deployed asset{assets.length === 1 ? "" : "s"}</h2></div><p className="studio-muted max-w-md">Media is read from the application’s public asset library, so this review always reflects what is deployed.</p></div>
      {assets.length ? <div className="studio-asset-grid">{assets.map((asset) => <a className="studio-asset-card" href={asset.publicPath} target="_blank" rel="noreferrer" key={asset.publicPath}>
        {isImage(asset) ? <img src={asset.publicPath} alt="" loading="lazy" /> : <span className="studio-file-preview"><FileText size={30} /><span>PDF</span></span>}
        <span className="studio-asset-name">{asset.name}</span><span className="studio-asset-open">Open <ArrowUpRight size={13} /></span>
      </a>)}</div> : <div className="studio-empty-state"><ImageIcon size={20} /><p>No compatible public assets were found in this library yet.</p></div>}
    </section>
  </>;
}
