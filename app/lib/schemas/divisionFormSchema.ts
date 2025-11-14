import z from "zod";

export const divisionFormSchema = z.object({
	// required
	name: z.string().min(3, "Nama Divisi minimal 3 karakter"),
	department_code: z.string(),

	// optional
	description: z.string().optional().nullable(),
});

export type DivisionFormData = z.infer<typeof divisionFormSchema>;
