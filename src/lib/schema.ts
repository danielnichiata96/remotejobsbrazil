import { z } from "zod";
import { normalizeTags } from "./jobs";

const RawJobInputSchema = z.object({
  title: z.string().min(3).max(140),
  company: z.string().min(2).max(100),
  applyUrl: z.string().url(),
  location: z.string().max(100).optional(),
  type: z.string().max(40).optional(),
  salary: z.string().max(140).optional(),
  description: z.string().max(8000).optional(),
  logoUrl: z.string().url().optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
});

export const JobInputSchema = RawJobInputSchema.transform((v) => ({
  ...v,
  location: v.location?.trim() || undefined,
  type: v.type?.trim() || undefined,
  salary: v.salary?.trim() || undefined,
  description: v.description?.trim() || undefined,
  tags: normalizeTags(v.tags),
}));

export type JobInput = z.infer<typeof JobInputSchema>;
