import z from "zod";

export const divisionFormSchema = z.object({
	code: z
		.string()
		.nonempty("Kode divisi wajib diisi")
		.min(3, "Kode divisi minimal 3 karakter"),
	name: z
		.string()
		.nonempty("Nama divisi wajib diisi")
		.min(3, "Nama divisi minimal 3 karakter"),

	// temporary
	department_id: z.number().min(1, "Ini sementara saja"),
});

export type DivisionFormData = z.infer<typeof divisionFormSchema>;
