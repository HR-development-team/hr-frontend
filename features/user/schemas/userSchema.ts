import { z } from "zod";

export const userRoleCodeSchema = z.string().min(1, "Role wajib dipilih");

export const userSchema = z.object({
  id: z.number(),
  user_code: z.string(),
  email: z.email("Format email tidak valid"),
  role_code: z.string(),
  role_name: z.string(),
  employee_name: z.string().nullable(),
});

export const userOptionSchema = z.object({
  user_code: z.string(),
  email: z.string(),
  role_name: z.string(),
});

export const userDetailSchema = userSchema.extend({
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const userFormSchema = z.object({
  email: z.email("Format email tidak valid").min(1, "Email wajib diisi"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .optional()
    .or(z.literal("")),
  role_code: userRoleCodeSchema,
});

export type User = z.infer<typeof userSchema>;
export type UserOption = z.infer<typeof userOptionSchema>;
export type UserDetail = z.infer<typeof userDetailSchema>;
export type UserFormData = z.infer<typeof userFormSchema>;
