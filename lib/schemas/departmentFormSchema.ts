import z from "zod";
import { issue } from "zod/v4/core/util.cjs";
import { id } from "zod/v4/locales";

export const departmentFormSchema = z.object({
	name: z
		.string()
		.nonempty("Nama departemen wajib diisi")
		.min(3, "Nama departemen minimal 3 karakter"),
	department_code: z
		.string()
		.nonempty("Kode departemen wajib diisi")
		.min(3, "Kode departemen minimal 3 karakter"),
});

export type DepartementFormData = z.infer<typeof departmentFormSchema>;
