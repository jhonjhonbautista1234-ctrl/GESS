import { readdir } from "node:fs/promises";
import path from "node:path";

const publicRoot = path.join(process.cwd(), "public");
const supportedExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".pdf", ".png", ".webp"]);

export interface AdminAsset {
  name: string;
  publicPath: string;
  extension: string;
}

export interface AssetSection {
  title: string;
  eyebrow: string;
  description: string;
  assetDirectories: readonly string[];
  extensions?: readonly string[];
  publicHref: string;
  publicLabel: string;
}

export const assetSections: Record<string, AssetSection> = {
  events: {
    title: "Events library",
    eyebrow: "Content / Events",
    description: "Review the approved event photography currently available to the public event pages.",
    assetDirectories: ["assets/natgess", "assets/general_assembly"],
    publicHref: "/events",
    publicLabel: "Open events",
  },
  documents: {
    title: "Documents library",
    eyebrow: "Content / Documents",
    description: "The official PDF is served directly from the public asset library for reliable browser viewing.",
    assetDirectories: ["assets/officers"],
    extensions: [".pdf"],
    publicHref: "/documents",
    publicLabel: "Open documents",
  },
  achievements: {
    title: "Achievements library",
    eyebrow: "Content / Achievements",
    description: "Year-grouped achievement artwork used by the public archive, preserved without image cropping.",
    assetDirectories: ["assets/achievements"],
    publicHref: "/achievements",
    publicLabel: "Open achievements",
  },
  officers: {
    title: "Officers library",
    eyebrow: "People / Officers",
    description: "The officer carousel and reference PDF draw from this protected, deployment-safe media set.",
    assetDirectories: ["assets/officers/pictures"],
    publicHref: "/officers",
    publicLabel: "Open officers page",
  },
  merch: {
    title: "Merch library",
    eyebrow: "Commerce / Merch",
    description: "Uniform photography currently displayed in the public collection.",
    assetDirectories: ["assets/uniforms"],
    publicHref: "/merch",
    publicLabel: "Open merch page",
  },
};

function toPublicPath(relativePath: string): string {
  return `/${relativePath.split(path.sep).join("/")}`;
}

export async function readPublicAssets(directories: readonly string[], extensions?: readonly string[], limit = 30): Promise<AdminAsset[]> {
  const files: AdminAsset[] = [];
  const allowedExtensions = extensions ? new Set(extensions) : supportedExtensions;

  async function walk(currentDirectory: string): Promise<void> {
    if (files.length >= limit) return;
    const entries = await readdir(currentDirectory, { withFileTypes: true });
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name, undefined, { numeric: true }))) {
      if (files.length >= limit) return;
      const fullPath = path.join(currentDirectory, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      const extension = path.extname(entry.name).toLowerCase();
      if (!allowedExtensions.has(extension)) continue;
      files.push({
        name: entry.name,
        extension,
        publicPath: toPublicPath(path.relative(publicRoot, fullPath)),
      });
    }
  }

  try {
    for (const directory of directories) {
      if (files.length >= limit) break;
      await walk(path.join(publicRoot, directory));
    }
  } catch {
    return [];
  }
  return files;
}
