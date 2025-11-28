import z from "zod";

const numberRegex = /^\+?[0-9]+$/;

export const employeeFormSchema = z.object({
  // required
  full_name: z
    .string()
    .nonempty("Nama karyawan wajib diisi")
    .min(3, "Nama karyawan minimal 3 karakter"),
  join_date: z.date({
    error: (issue) =>
      issue.input === undefined
        ? "Tanggal bergabung wajib diisi"
        : "Format tanggal tidak valid",
  }),
  position_code: z.string("Posisi wajib dipilih"),
  user_code: z.string("User wajib dipilih"),
  employment_status: z
    .enum(["aktif", "inaktif"], "Status wajib diisi")
    .default("aktif"),

  office_code: z.string("Kantor wajib dipilih"),

  // optional
  contact_phone: z.preprocess(
    (val) => {
      if (typeof val === "number") return String(val);

      if (val === "") return null;

      return val;
    },

    z
      .string()
      .min(10, "Nomor kontak minimal 10 digit")
      .regex(numberRegex, "Format No. Kontak tidak valid (hanya angka)")
      .optional()
      .nullable()
  ),
  address: z.string().optional().nullable(),
  ktp_number: z.preprocess(
    (val) => {
      if (typeof val === "number") return String(val);

      if (val === "") return null;

      return val;
    },

    z
      .string()
      .min(16, "Nomor KTP minimal 16 digit")
      .regex(numberRegex, "Format No. Kontak tidak valid (hanya angka)")
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
    (val) => {
      if (typeof val === "number") return String(val);

      if (val === "") return null;

      return val;
    },

    z
      .string()
      .min(11, "Nomor BPJS Ketenagakerjaan minimal 11 digit")
      .regex(numberRegex, "Format Nomor tidak valid (hanya angka)")
      .optional()
      .nullable()
  ),

  bpjs_kesehatan: z.preprocess(
    (val) => {
      if (typeof val === "number") return String(val);

      if (val === "") return null;

      return val;
    },

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

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
