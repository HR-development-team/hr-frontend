import z from "zod";

export const userFormSchema = z.object({
	email: z.email().nonempty("Email user tidak boleh kosong"),
	employee_id: z.number().min(1, "Belum ditujukan ke karyawan mana"),
	role: z.enum(["admin", "employee"]),
});

export type UserFormData = z.infer<typeof userFormSchema>;
