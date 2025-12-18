import { z } from "zod";

export const departmentSchema = z.object({
  id: z.number(),
  department_code: z.string(),
  office_code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});

export const departmentDetailSchema = departmentSchema.extend({
  office_name: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const departmentFormSchema = z.object({
  office_code: z.string().nonempty("Kantor wajib dipilih"),
  name: z
    .string()
    .min(3, "Nama departemen minimal 3 karakter")
    .nonempty("Nama departemen wajib diisi"),
  description: z.string().nullable().optional(),
});

export type Department = z.infer<typeof departmentSchema>;
export type DepartmentDetail = z.infer<typeof departmentDetailSchema>;
export type DepartmentFormData = z.infer<typeof departmentFormSchema>;
