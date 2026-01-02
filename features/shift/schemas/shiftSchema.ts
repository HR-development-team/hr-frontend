import { z } from "zod";

export const shiftSchema = z.object({
  id: z.number(),
  office_code: z.string(),
  office_name: z.string(),
  shift_code: z.string(),
  name: z.string().min(1, "Nama shift wajib diisi"),
  start_time: z.string(),
  end_time: z.string(),
  is_overnight: z.number(),
  late_tolerance_minutes: z.number().min(0),
  check_in_limit_minutes: z.number().min(30, "Minimal 30 menit"),
  check_out_limit_minutes: z.number().min(30, "Minimal 30 menit"),
  work_days: z.array(z.number()).min(1, "Pilih minimal satu hari kerja"),
});

export const shiftOptionSchema = z.object({
  shift_code: z.string(),
  name: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  office_code: z.string(),
});

export const shiftDetailSchema = shiftSchema.extend({
  created_at: z.string(),
  updated_at: z.string(),
});

export const shiftResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  datetime: z.string(),
  master_shifts: z.array(shiftSchema),
});

// The Schema for the API (Expects Strings "08:00")
export const shiftFormSchema = shiftSchema.omit({
  id: true,
  office_name: true,
  shift_code: true,
});

// The Schema for the UI Form (Expects Dates for Calendar component)
export const shiftUiFormSchema = shiftFormSchema.extend({
  start_time: z.date(),
  end_time: z.date(),
});

export type Shift = z.infer<typeof shiftSchema>;
export type ShiftOption = z.infer<typeof shiftOptionSchema>;
export type ShiftDetail = z.infer<typeof shiftDetailSchema>;
export type ShiftResponse = z.infer<typeof shiftResponseSchema>;
export type ShiftFormData = z.infer<typeof shiftFormSchema>;
export type ShiftUiFormData = z.infer<typeof shiftUiFormSchema>;
