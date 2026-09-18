"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import {
  parseAnnouncementForm,
  parseAnnouncementLifecycle,
  validationError,
} from "@/features/announcements/schema";
import type { AnnouncementActionState } from "@/features/announcements/admin-types";

function databaseError(message: string): AnnouncementActionState {
  return {
    status: "error",
    message,
  };
}

function invalidateAnnouncements(): void {
  // Next.js 14/15 uses the one-argument revalidateTag API.
  revalidateTag("announcements");
  revalidatePath("/announcements");
  revalidatePath("/admin/dashboard/announcements");
  revalidatePath("/admin/dashboard");
}

export async function saveAnnouncement(
  _previousState: AnnouncementActionState,
  formData: FormData,
): Promise<AnnouncementActionState> {
  const parsed = parseAnnouncementForm(formData);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await requireAdmin();
  const isPublished = parsed.data.intent === "publish";
  const timestamp = new Date().toISOString();
  const values = {
    title: parsed.data.title,
    body: parsed.data.body,
    excerpt: parsed.data.excerpt ?? null,
    is_pinned: parsed.data.isPinned,
    status: isPublished ? "published" : "draft",
    published_at: isPublished ? timestamp : null,
    updated_by: user.id,
    design: parsed.data.design,
  };

  try {
    if (parsed.data.id) {
      const { data, error } = await supabase
        .from("announcements")
        .update(values)
        .eq("id", parsed.data.id)
        .is("deleted_at", null)
        .select("id")
        .maybeSingle();

      if (error || !data) {
        return databaseError("This announcement could not be saved. It may have been removed; refresh the page and try again.");
      }
    } else {
      const { data, error } = await supabase
        .from("announcements")
        .insert({ ...values, created_by: user.id })
        .select("id")
        .maybeSingle();

      if (error || !data) {
        return databaseError("The announcement could not be created. Nothing was published.");
      }
    }
  } catch {
    return databaseError("The announcement could not be saved because the service did not respond. Please try again.");
  }

  invalidateAnnouncements();

  return {
    status: "success",
    message: isPublished
      ? "Announcement published. The public announcements page has been refreshed."
      : "Draft saved. It is visible only in this administrator workspace.",
  };
}

export async function changeAnnouncementState(
  _previousState: AnnouncementActionState,
  formData: FormData,
): Promise<AnnouncementActionState> {
  const parsed = parseAnnouncementLifecycle(formData);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { supabase, user } = await requireAdmin();
  const timestamp = new Date().toISOString();
  const values = (() => {
    switch (parsed.data.intent) {
      case "archive":
        return { status: "archived", updated_by: user.id };
      case "delete":
        return {
          status: "archived",
          deleted_at: timestamp,
          deleted_by: user.id,
          updated_by: user.id,
        };
      case "restore":
        return {
          status: "draft",
          deleted_at: null,
          deleted_by: null,
          updated_by: user.id,
        };
    }
  })();

  try {
    const { data, error } = await supabase
      .from("announcements")
      .update(values)
      .eq("id", parsed.data.id)
      .select("id")
      .maybeSingle();

    if (error || !data) {
      return databaseError("This change could not be saved. Refresh the page and try again.");
    }
  } catch {
    return databaseError("This change could not be saved because the service did not respond. Please try again.");
  }

  invalidateAnnouncements();

  const messages = {
    archive: "Announcement archived. It is no longer public.",
    delete: "Announcement removed from the public site. You can restore it as a draft.",
    restore: "Announcement restored as a draft. Review and publish it when ready.",
  } as const;

  return {
    status: "success",
    message: messages[parsed.data.intent],
  };
}
