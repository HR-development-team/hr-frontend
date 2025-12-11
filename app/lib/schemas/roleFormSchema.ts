import z from "zod";

export const roleFormSchema = z.object({
  name: z
    .string()
    .nonempty("Nama role wajib diisi")
    .min(3, "Nama role minimal 3 karakter"),
  description: z.string().optional().nullable(),
});

export type RoleFormData = z.infer<typeof roleFormSchema>;
