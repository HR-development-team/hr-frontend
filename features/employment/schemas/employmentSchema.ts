import { z } from "zod";

export const employmentSchema = z.object({
  id: z.number(),
  status_code: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

export const employmentOptionSchema = z.object({
  status_code: z.string(),
  name: z.string(),
});

export type Employement = z.infer<typeof employmentSchema>;
export type EmploymentOption = z.infer<typeof employmentOptionSchema>;
