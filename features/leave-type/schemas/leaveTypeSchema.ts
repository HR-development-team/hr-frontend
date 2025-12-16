import { z } from "zod";

export const leaveTypeSchema = z.object({
  id: z.number(),
  type_code: z.string().optional(),
  name: z.string(),
  deduction: z.union([z.string(), z.number()]),
  description: z.string().nullable().optional(),
});

export const leaveTypeDetailSchema = leaveTypeSchema.extend({
  created_at: z.string(),
  updated_at: z.string(),
});

export const leaveTypeFormSchema = z.object({
  name: z
    .string()
    .min(3, "Nama tipe cuti minimal 3 karakter")
    .nonempty("Nama tipe cuti wajib diisi"),
  deduction: z.coerce.number().min(1, "Nilai pengurangan minimal 1"),
  description: z.string().optional().nullable(),
});

export type LeaveType = z.infer<typeof leaveTypeSchema>;
export type LeaveTypeDetail = z.infer<typeof leaveTypeDetailSchema>;
export type LeaveTypeFormData = z.infer<typeof leaveTypeFormSchema>;
