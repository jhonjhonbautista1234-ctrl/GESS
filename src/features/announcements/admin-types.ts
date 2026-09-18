import { readAnnouncementDesign, type AnnouncementDesign } from "./design";
export type AnnouncementStatus = "draft" | "published" | "archived";

export interface AdminAnnouncement {
  id: string;
  title: string;
  body: string;
  excerpt: string | null;
  status: AnnouncementStatus;
  isPinned: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  design: AnnouncementDesign;
}

export interface AnnouncementFieldErrors {
  id?: string[];
  title?: string[];
  body?: string[];
  excerpt?: string[];
  intent?: string[];
}

export interface AnnouncementActionState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: AnnouncementFieldErrors;
}

export const initialAnnouncementActionState: AnnouncementActionState = {
  status: "idle",
  message: "",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getRequiredString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function getNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function getAnnouncementStatus(value: unknown): AnnouncementStatus | null {
  return value === "draft" || value === "published" || value === "archived" ? value : null;
}

/**
 * Converts an untyped Supabase row into the serializable model the editor uses.
 * Invalid rows are intentionally omitted instead of being rendered with an
 * incorrect lifecycle state.
 */
export function toAdminAnnouncement(value: unknown): AdminAnnouncement | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = getRequiredString(value.id);
  const title = getRequiredString(value.title);
  const body = getRequiredString(value.body);
  const status = getAnnouncementStatus(value.status);
  const createdAt = getRequiredString(value.created_at);
  const updatedAt = getRequiredString(value.updated_at);

  if (!id || !title || !body || !status || !createdAt || !updatedAt) {
    return null;
  }

  return {
    id,
    title,
    body,
    excerpt: getNullableString(value.excerpt),
    status,
    isPinned: value.is_pinned === true,
    publishedAt: getNullableString(value.published_at),
    createdAt,
    updatedAt,
    deletedAt: getNullableString(value.deleted_at),
    design: readAnnouncementDesign(value.design),
  };
}
