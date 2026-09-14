import { z } from "zod";
import { CATEGORIES } from "./categories";
import { PLATFORMS } from "./platforms";

export const bidSchema = z.object({
  name: z.string().trim().min(2).max(80),
  platform: z.enum(PLATFORMS.map((p) => p.slug) as [string, ...string[]]),
  url: z.string().trim().url().max(300),
  description: z.string().trim().min(1).max(150),
  category: z.enum(CATEGORIES.map((c) => c.slug) as [string, ...string[]]),
  imageUrl: z.union([z.string().trim().url().max(500), z.literal("")]).optional(),
  email: z.string().trim().email().max(200),
  vatNumber: z.string().trim().max(30).optional(),
  bidKr: z.coerce.number().int().positive(),
  withdrawalConsent: z.literal(true),
  termsConsent: z.literal(true),
  slug: z.string().trim().max(80).optional(),
  locale: z.literal("sv"),
});

export type BidInput = z.infer<typeof bidSchema>;
