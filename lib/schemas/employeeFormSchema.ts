import z from "zod";
import { issue } from "zod/v4/core/util.cjs";

export const employeeFormSchema = z.object({
	first_name: z.string().min(3, "Nama depan wajib diisi"),
	last_name: z.string().min(3, "Nama belakang wajib diisi"),
	contact_phone: z.string().min(10, "Nomor kontak minimal 10 digit"),
	address: z.string().min(1, "Alamat wajib diisi"),
	join_date: z.date({
		error: (issue) =>
			issue.input === undefined
				? "Tanggal bergabung wajib diisi"
				: "Format tanggal tidak valid",
	}),
	position_id: z.number().min(1, "Posisi wajib dipilih"), // temporary purpose
	status: z.enum(["Aktif", "Non-Aktif"]),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
