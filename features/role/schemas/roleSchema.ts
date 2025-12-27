import { z } from "zod";

export const RoleBaseSchema = z.object({
  name: z.string().min(1, "Nama role wajib diisi"),
  description: z.string().nullable().optional(),
});

export const RoleSchema = z.object({
  id: z.number(),
  role_code: z.string(),
  ...RoleBaseSchema.shape,
});

export const roleOptionSchema = z.object({
  role_code: z.string(),
  name: z.string(),
});

export const RoleListSchema = z.array(RoleSchema);
export type Role = z.infer<typeof RoleSchema>;
export type RoleOption = z.infer<typeof roleOptionSchema>;
export type RoleFormData = z.infer<typeof RoleBaseSchema>;
