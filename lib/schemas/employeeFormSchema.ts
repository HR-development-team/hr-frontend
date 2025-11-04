import z from "zod";
import { issue } from "zod/v4/core/util.cjs";

const phoneRegex = /^\+?[0-9]+$/;

export const employeeFormSchema = z.object({
	first_name: z
		.string()
		.nonempty("Nama depan wajib diisi")
		.min(3, "Nama depan minimal 3 karakter"),
	last_name: z
		.string()
		.nonempty("Nama belakang wajib diisi")
		.min(3, "Nama belakang minimal 3 karakter"),
	contact_phone: z.preprocess(
		(val) => {
			if (typeof val === "number") return String(val);

			if (val === "") return undefined;

			return val;
		},

		z.coerce
			.string()
			.min(10, "Nomor kontak minimal 10 digit")
			.regex(phoneRegex, "Format No. Kontak tidak valid (hanya angka)")
			.optional()
	),
	address: z.string().optional(),
	join_date: z.date({
		error: (issue) =>
			issue.input === undefined
				? "Tanggal bergabung wajib diisi"
				: "Format tanggal tidak valid",
	}),
	position_id: z.number().min(1, "Posisi wajib dipilih"), // temporary purpose
	status: z.enum(["Aktif", "Non-Aktif"], "Status wajib diisi"),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
