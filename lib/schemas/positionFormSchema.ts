import z from "zod";

export const positionFormSchema = z.object({
	position_code: z
		.string()
		.nonempty("Kode divisi wajib diisi")
		.min(3, "Kode divisi minimal 3 karakter"),
	name: z
		.string()
		.nonempty("Nama divisi wajib diisi")
		.min(3, "Nama divisi minimal 3 karakter"),
	base_salary: z.coerce
		.number()
		.min(1, "Gaji pokok wajib diisi")
		.positive("Gaji pokok harus berupa angka positif"),

	// temporary
	department_id: z.number().min(0, "Harus memilih departemen"),
});

export type PositionFormData = z.infer<typeof positionFormSchema>;
