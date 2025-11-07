import z from "zod";

const passwordSchema = z
	.string()
	.min(8, "Password minimal harus 8 karakter")

	// must use lowercase
	.regex(/[a-z]/, "Password harus memiliki setidaknya satu huruf kecil")

	// must use uppercase
	.regex(/[A-Z]/, "Password harus memiliki setidaknya satu huruf besar")

	// must use number
	.regex(/[0-9]/, "Password harus memiliki setidaknya satu angka")

	// must use special character
	.regex(
		/[^a-zA-Z0-9]/,
		"Password harus memiliki setidaknya satu karakter spesial"
	);

export const userFormSchema = z.object({
	email: z.email().nonempty("Email user tidak boleh kosong"),
	password: passwordSchema,
	employee_id: z.number().min(1, "Belum memilih karyawan"),
	role: z.enum(["admin", "employee"]),
});

export type UserFormData = z.infer<typeof userFormSchema>;
