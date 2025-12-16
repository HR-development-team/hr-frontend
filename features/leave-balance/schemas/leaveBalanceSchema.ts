import { z } from "zod";

const currentYear = new Date().getFullYear();

export const leaveBalanceSchema = z.object({
  id: z.number(),
  employee_code: z.string(),
  employee_name: z.string().optional(),
  type_code: z.string(),
  leave_type_name: z.string().optional(),
  balance: z.number(),
  year: z.number(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

const baseFormSchema = z.object({
  type_code: z.string().nonempty("Wajib memilih tipe cuti"),
  balance: z.coerce
    .number()
    .min(1, "Saldo cuti minimal adalah 1")
    .nonnegative("Saldo cuti harus positif"),
  year: z.coerce
    .number()
    .int()
    .min(currentYear, {
      message: `Tahun minimal adalah ${currentYear}`,
    }),
});

// Extension: Used for Single Add & Edit (Requires specific Employee)
const employeeExtension = z.object({
  employee_code: z.string().nonempty("Wajib memilih karyawan"),
});

// Bulk Delete: Only needs Type and Year to wipe data
const bulkDeleteSchema = z.object({
  type_code: z.string().nonempty("Wajib memilih tipe cuti"),
  year: z.coerce
    .number()
    .int()
    .min(currentYear, {
      message: `Tahun minimal adalah ${currentYear}`,
    }),
});

export type LeaveBalanceFormMode =
  | "bulkAdd"
  | "bulkDelete"
  | "singleAdd"
  | "edit"
  | null;

export const getLeaveBalanceFormSchema = (mode: LeaveBalanceFormMode) => {
  if (mode === "edit" || mode === "singleAdd") {
    return baseFormSchema.merge(employeeExtension);
  }
  if (mode === "bulkDelete") {
    return bulkDeleteSchema;
  }
  return baseFormSchema;
};

export type LeaveBalance = z.infer<typeof leaveBalanceSchema>;
export type LeaveBalanceFormData = z.infer<typeof baseFormSchema> & {
  employee_code?: string;
};
