import { z } from "zod";

export const employmentSchema = z.object({
  id: z.number(),
  status_code: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

export type Employement = z.infer<typeof employmentSchema>;
