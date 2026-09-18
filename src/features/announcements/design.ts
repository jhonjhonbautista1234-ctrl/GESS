import { z } from "zod";
export const announcementDesignSchema = z.object({
  color: z.string().regex(/^#[0-9a-f]{6}$/i).default("#0f2d18"),
  aspect: z.enum(["1 / 1", "16 / 9", "4 / 5"]).default("16 / 9"),
  weight: z.enum(["400", "600", "700"]).default("700"),
  tracking: z.number().min(-0.06).max(0.06).default(-0.03),
  radius: z.number().int().min(0).max(40).default(20),
  shadow: z.number().int().min(0).max(60).default(30),
  overlay: z.boolean().default(true),
});
export type AnnouncementDesign = z.infer<typeof announcementDesignSchema>;
export const defaultAnnouncementDesign = announcementDesignSchema.parse({});
export function readAnnouncementDesign(value: unknown): AnnouncementDesign {
  const result = announcementDesignSchema.safeParse(value);
  return result.success ? result.data : defaultAnnouncementDesign;
}
