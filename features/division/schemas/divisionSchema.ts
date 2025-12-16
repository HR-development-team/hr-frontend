import { z } from "zod";

export const divisionSchema = z.object({
  id: z.number(),
  division_code: z.string().optional(),
  department_code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
});

export const divisionDetailSchema = divisionSchema.extend({
  department_name: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const divisionFormSchema = z.object({
  department_code: z.string().nonempty("Departemen wajib dipilih"),
  name: z
    .string()
    .min(3, "Nama divisi minimal 3 karakter")
    .nonempty("Nama divisi wajib diisi"),
  description: z.string().nullable().optional(),
});

export type Division = z.infer<typeof divisionSchema>;
export type DivisionDetail = z.infer<typeof divisionDetailSchema>;
export type DivisionFormData = z.infer<typeof divisionFormSchema>;
