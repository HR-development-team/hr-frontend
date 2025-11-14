import z from "zod";

export const positionFormSchema = z.object({
  name: z
    .string()
    .nonempty("Nama divisi wajib diisi")
    .min(3, "Nama divisi minimal 3 karakter"),
  base_salary: z.coerce
    .number("Gaji Pokok wajib diisi")
    .min(1000000, "Gaji pokok minimal 1.000.000")
    .positive("Gaji pokok harus berupa angka positif"),
  division_code: z.string("Harus memilih divisi"),
  description: z.string().optional().nullable(),
});

export type PositionFormData = z.infer<typeof positionFormSchema>;
