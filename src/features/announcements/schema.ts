import { z } from "zod";
import { announcementDesignSchema } from "./design";
import type { AnnouncementActionState, AnnouncementFieldErrors } from "./admin-types";

const titleSchema = z
  .string()
  .trim()
  .min(3, "Use at least 3 characters for the headline.")
  .max(180, "Keep the headline to 180 characters or fewer.");

const bodySchema = z
  .string()
  .trim()
  .min(3, "Write at least 3 characters for the announcement.")
  .max(10_000, "Keep the announcement to 10,000 characters or fewer.");

const excerptSchema = z
  .string()
  .trim()
  .min(3, "Use at least 3 characters for the summary.")
  .max(500, "Keep the summary to 500 characters or fewer.")
  .optional();

export const announcementFormSchema = z.object({
  id: z.string().uuid("The announcement reference is invalid.").optional(),
  title: titleSchema,
  body: bodySchema,
  excerpt: excerptSchema,
  isPinned: z.boolean(),
  design: announcementDesignSchema,
  intent: z.enum(["save-draft", "publish"]),
});

export const announcementLifecycleSchema = z.object({
  id: z.string().uuid("The announcement reference is invalid."),
  intent: z.enum(["archive", "delete", "restore"]),
});

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;
export type AnnouncementLifecycleValues = z.infer<typeof announcementLifecycleSchema>;

function getFormString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function optionalValue(value: string): string | undefined {
  return value.trim().length > 0 ? value : undefined;
}

export function parseAnnouncementForm(formData: FormData) {
  let design: unknown = {};
  try { design = JSON.parse(getFormString(formData, "design") || "{}"); } catch { design = null; }
  return announcementFormSchema.safeParse({
    id: optionalValue(getFormString(formData, "id")),
    title: getFormString(formData, "title"),
    body: getFormString(formData, "body"),
    excerpt: optionalValue(getFormString(formData, "excerpt")),
    isPinned: formData.get("isPinned") === "true",
    design,
    intent: getFormString(formData, "intent"),
  });
}

export function parseAnnouncementLifecycle(formData: FormData) {
  return announcementLifecycleSchema.safeParse({
    id: getFormString(formData, "id"),
    intent: getFormString(formData, "intent"),
  });
}

function getFieldErrors(error: z.ZodError, field: keyof AnnouncementFieldErrors): string[] | undefined {
  return error.flatten().fieldErrors[field];
}

export function validationError(error: z.ZodError): AnnouncementActionState {
  const fieldErrors: AnnouncementFieldErrors = {
    id: getFieldErrors(error, "id"),
    title: getFieldErrors(error, "title"),
    body: getFieldErrors(error, "body"),
    excerpt: getFieldErrors(error, "excerpt"),
    intent: getFieldErrors(error, "intent"),
  };

  return {
    status: "error",
    message: "Review the highlighted fields, then try again.",
    fieldErrors,
  };
}
