import z from "zod";

const currentYear: number = new Date().getFullYear();

export const leaveTypeFormSchema = z.object({
	name: z.string().nonempty("Nama tipe cuti wajib diisi"),
	description: z.string().optional(),
});

export type LeaveTypeFormData = z.infer<typeof leaveTypeFormSchema>;
