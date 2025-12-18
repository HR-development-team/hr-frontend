import { z } from "zod";

export const positionSchema = z.object({
  id: z.number(),
  position_code: z.string().optional(),
  name: z.string(),
  base_salary: z.union([z.string(), z.number()]),
  sort_order: z.number().optional(),
  description: z.string().nullable().optional(),
  parent_position_code: z.string().nullable().optional(),
  parent_position_name: z.string().nullable().optional(),
  division_code: z.string(),
  division_name: z.string(),
  department_code: z.string(),
  department_name: z.string(),
  office_code: z.string(),
  office_name: z.string(),
});

export const positionDetailSchema = positionSchema.extend({
  created_at: z.string(),
  updated_at: z.string(),
});

export const positionFormSchema = z.object({
  parent_position_code: z.string().nullable().optional(),
  name: z
    .string()
    .min(3, "Nama jabatan minimal 3 karakter")
    .nonempty("Nama jabatan wajib diisi"),
  base_salary: z.coerce
    .number()
    .min(1000000, "Gaji pokok minimal 1.000.000")
    .positive("Gaji pokok harus berupa angka positif"),
  division_code: z.string().nonempty("Divisi wajib dipilih"),
  description: z.string().nullable().optional(),
});

export type Position = z.infer<typeof positionSchema>;
export type PositionDetail = z.infer<typeof positionDetailSchema>;
export type PositionFormData = z.infer<typeof positionFormSchema>;
