import z from "zod";

const currentYear = new Date().getFullYear();

export const baseSchema = z.object({
  type_code: z.string().nonempty("Wajib memilih tipe cuti"),
  balance: z
    .number()
    .min(1, "Saldo cuti minimal adalah 1")
    .positive("Saldo cuti harus lebih dari nol"),
  year: z
    .number()
    .int()
    .min(currentYear, {
      message: `Tahun minimal adalah ${currentYear}`,
    }),
});

const addOneAndEditSchemaExtension = z.object({
  employee_code: z.string().nonempty("Wajib memilih karyawan"),
});

const bulkDeleteSchema = z.object({
  type_code: z.string().nonempty("Wajib memilih tipe cuti"),
  year: z
    .number()
    .int()
    .min(currentYear, {
      message: `Tahun minimal adalah ${currentYear}`,
    }),
});

export const getLeaveBalanceFormSchema = (
  mode: "bulkAdd" | "bulkDelete" | "singleAdd" | "edit" | null
) => {
  if (mode === "edit" || mode === "singleAdd") {
    return baseSchema.merge(addOneAndEditSchemaExtension);
  }

  if (mode === "bulkDelete") {
    return bulkDeleteSchema;
  }

  return baseSchema;
};

export type LeaveBalanceFormData = z.infer<typeof baseSchema> & {
  employee_code?: string;
};
