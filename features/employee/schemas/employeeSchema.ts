import { z } from "zod";

const numberRegex = /^\+?[0-9]+$/;

// Helper to handle empty strings or numbers becoming strings
const emptyStringOrNumberToNull = (val: unknown) => {
  if (typeof val === "number") return String(val);
  if (val === "") return null;
  return val;
};

export const employeeSchema = z.object({
  id: z.number(),
  employee_code: z.string().optional(),
  user_code: z.string().nullable().optional(),
  full_name: z.string(),
  position_code: z.string(),
  position_name: z.string(),
  division_code: z.string(),
  division_name: z.string(),
  department_code: z.string(),
  department_name: z.string(),
  office_code: z.string(),
  office_name: z.string(),
  employment_status_code: z.string(),
  employment_status: z.string(),
  join_date: z.string(),
  profile_picture: z.string().nullable().optional(),
});

export const employeeDetailSchema = employeeSchema.extend({
  contact_phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  ktp_number: z.string().nullable().optional(),
  birth_place: z.string().nullable().optional(),
  birth_date: z.string().nullable().optional(),
  gender: z.enum(["laki-laki", "perempuan"]).nullable().optional(),
  religion: z.string().nullable().optional(),
  maritial_status: z.enum(["Married", "Single"]).nullable().optional(),
  resign_date: z.string().nullable().optional(),
  education: z.string().nullable().optional(),
  blood_type: z.string().nullable().optional(),
  bpjs_ketenagakerjaan: z.string().nullable().optional(),
  bpjs_kesehatan: z.string().nullable().optional(),
  npwp: z.string().nullable().optional(),
  bank_account: z.string().nullable().optional(),
  position_name: z.string().nullable().optional(),
  department_name: z.string().nullable().optional(),
  office_name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const employeeFormSchema = z.object({
  full_name: z
    .string()
    .nonempty("Nama karyawan wajib diisi")
    .min(3, "Nama karyawan minimal 3 karakter"),

  join_date: z.date({
    error: "Tanggal bergabung wajib diisi",
  }),
  position_code: z.string().nonempty("Posisi wajib dipilih"),
  office_code: z.string().nonempty("Kantor wajib dipilih"),
  user_code: z.string().optional().nullable(),
  employment_status_code: z.string().default("tetap"),
  contact_phone: z.preprocess(
    emptyStringOrNumberToNull,
    z
      .string()
      .min(10, "Nomor kontak minimal 10 digit")
      .regex(numberRegex, "Format No. Kontak tidak valid (hanya angka)")
      .optional()
      .nullable()
  ),
  address: z.string().optional().nullable(),
  ktp_number: z.preprocess(
    emptyStringOrNumberToNull,
    z
      .string()
      .min(16, "Nomor KTP minimal 16 digit")
      .regex(numberRegex, "Format KTP tidak valid (hanya angka)")
      .optional()
      .nullable()
  ),
  birth_place: z.string().optional().nullable(),
  birth_date: z.date().optional().nullable(),
  gender: z.enum(["laki-laki", "perempuan"]).optional().nullable(),
  religion: z.string().optional().nullable(),
  maritial_status: z.enum(["Married", "Single"]).optional().nullable(),
  resign_date: z.date().optional().nullable(),
  education: z.string().optional().nullable(),
  blood_type: z.string().optional().nullable(),
  profile_picture: z.string().optional().nullable(),
  bpjs_ketenagakerjaan: z.preprocess(
    emptyStringOrNumberToNull,
    z
      .string()
      .min(11, "Nomor BPJS Ketenagakerjaan minimal 11 digit")
      .regex(numberRegex, "Format Nomor tidak valid (hanya angka)")
      .optional()
      .nullable()
  ),
  bpjs_kesehatan: z.preprocess(
    emptyStringOrNumberToNull,
    z
      .string()
      .min(13, "Nomor BPJS Kesehatan minimal 13 digit")
      .regex(numberRegex, "Format Nomor tidak valid (hanya angka)")
      .optional()
      .nullable()
  ),
  npwp: z.string().optional().nullable(),
  bank_account: z.string().optional().nullable(),
});

export type Employee = z.infer<typeof employeeSchema>;
export type EmployeeDetail = z.infer<typeof employeeDetailSchema>;
export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
