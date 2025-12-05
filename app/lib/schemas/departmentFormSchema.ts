import z from "zod";

export const departmentFormSchema = z.object({
  // office_code: z.string("Kantor untuk memilih salah satu kantor"),
  name: z
    .string()
    .nonempty("Nama departemen wajib diisi")
    .min(3, "Nama departemen minimal 3 karakter"),
  description: z.string().optional().nullable(),
});

export type DepartementFormData = z.infer<typeof departmentFormSchema>;
