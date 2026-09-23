import type { AnnouncementDesign } from "./design";

export interface PublishedAnnouncement {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  excerpt: string | null;
  isPinned: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  design: AnnouncementDesign;
}
