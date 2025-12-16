import { z } from "zod";

export const LeaveStatusEnum = z.enum(["Approved", "Rejected", "Pending"]);
export type LeaveStatus = z.infer<typeof LeaveStatusEnum>;

export const leaveRequestSchema = z.object({
  id: z.number(),
  request_code: z.string(),
  employee_code: z.string(),
  type_code: z.string(),

  // API returns ISO date strings
  start_date: z.string(),
  end_date: z.string(),

  // Handle string "3" or number 3 -> number 3
  total_days: z.coerce.number(),

  reason: z.string(),
  status: LeaveStatusEnum,

  // Approval Details (Nullable)
  approved_by_code: z.string().nullable().optional(),
  approval_date: z.string().nullable().optional(),

  // Joined Fields (Optional as they depend on the query)
  employee_name: z.string().optional(),
  type_name: z.string().optional(),
  approved_by_name: z.string().nullable().optional(), // Corrected spelling from 'aproved'

  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Schema for Creating/Editing a Request
export const leaveRequestFormSchema = z
  .object({
    employee_code: z.string().nonempty("Wajib memilih karyawan"),
    type_code: z.string().nonempty("Wajib memilih tipe cuti"),

    // Date Pickers usually return Date objects, so we validate Date here
    start_date: z.date(),
    end_date: z.date(),

    reason: z.string().min(5, "Alasan harus diisi minimal 5 karakter"),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai",
    path: ["end_date"],
  });

// Schema for Approving/Rejecting a Request
export const leaveRequestApprovalSchema = z.object({
  status: z.enum(["Approved", "Rejected"]),
});

export type LeaveRequest = z.infer<typeof leaveRequestSchema>;
export type LeaveRequestFormData = z.infer<typeof leaveRequestFormSchema>;
export type LeaveRequestApprovalData = z.infer<
  typeof leaveRequestApprovalSchema
>;
