import z from "zod";

export const leaveTypeFormSchema = z.object({
  name: z.string().nonempty("Nama tipe cuti wajib diisi"),
  deduction: z.number().min(1, "Pengurangan gaji wajib diisi"),
  description: z.string().optional(),
});

export type LeaveTypeFormData = z.infer<typeof leaveTypeFormSchema>;
