import { z } from "zod";

// Allow null values in the schema so the form can start empty.
// Use superRefine to enforce required fields and ordering only when validating/submitting.
export const attendanceSessionFormSchema = z
  .object({
    date: z.date().nullable(),
    open_time: z.date().nullable(),
    cutoff_time: z.date().nullable(),
    close_time: z.date().nullable(),
  })
  .superRefine((data, ctx) => {
    // required checks
    if (!data.date) {
      ctx.addIssue({
        path: ["date"],
        code: z.ZodIssueCode.custom,
        message: "Tanggal sesi absensi wajib diisi",
      });
    }

    if (!data.open_time) {
      ctx.addIssue({
        path: ["open_time"],
        code: z.ZodIssueCode.custom,
        message: "Waktu mulai wajib diisi",
      });
    }

    if (!data.cutoff_time) {
      ctx.addIssue({
        path: ["cutoff_time"],
        code: z.ZodIssueCode.custom,
        message: "Waktu batas wajib diisi",
      });
    }

    if (!data.close_time) {
      ctx.addIssue({
        path: ["close_time"],
        code: z.ZodIssueCode.custom,
        message: "Waktu tutup wajib diisi",
      });
    }

    // ordering checks (only when both values exist)
    if (data.open_time && data.cutoff_time) {
      if (!(data.cutoff_time > data.open_time)) {
        ctx.addIssue({
          path: ["cutoff_time"],
          code: z.ZodIssueCode.custom,
          message: "Waktu batas (cutoff) harus setelah waktu mulai (open).",
        });
      }
    }

    if (data.cutoff_time && data.close_time) {
      if (!(data.close_time > data.cutoff_time)) {
        ctx.addIssue({
          path: ["close_time"],
          code: z.ZodIssueCode.custom,
          message: "Waktu tutup (close) harus setelah waktu batas (cutoff).",
        });
      }
    }
  });

export type AttendanceSessionFormData = z.infer<
  typeof attendanceSessionFormSchema
>;
