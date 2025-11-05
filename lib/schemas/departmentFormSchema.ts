import z from "zod";

export const departmentFormSchema = z.object({
	code: z
		.string()
		.nonempty("Kode departemen wajib diisi")
		.min(3, "Kode departemen minimal 3 karakter"),
	name: z
		.string()
		.nonempty("Nama departemen wajib diisi")
		.min(3, "Nama departemen minimal 3 karakter"),
	created_at: z.date({
		error: (issue) =>
			issue.input === undefined
				? "Tanggal dibuat wajib diisi"
				: "Format tanggal tidak valid",
	}),
});

export type DepartementFormData = z.infer<typeof departmentFormSchema>;
