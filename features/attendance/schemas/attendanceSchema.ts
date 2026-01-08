import { z } from "zod";

export const attendanceSchema = z.object({
  id: z.number(),
  attendance_code: z.string(),
  employee_code: z.string(),
  employee_name: z.string(),
  date: z.string(),
  check_in_time: z.string(),
  check_out_time: z.union([z.string(), z.null()]),
  check_in_status: z.string().nullable().optional(),
  check_out_status: z.string().nullable().optional(),
  late_minutes: z.number(),
  overtime_minutes: z.number(),
});

export const attendanceParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  start_date: z.union([z.string(), z.date()]).optional(),
  end_date: z.union([z.string(), z.date()]).optional(),
  office_code: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
});

export const attendanceDetailSchema = attendanceSchema.extend({
  shift_code: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const attendanceResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  datetime: z.string(),
  attendances: z.array(attendanceSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    total_page: z.number(),
  }),
});

export const attendanceDetailResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  datetime: z.string(),
  master_employees: attendanceDetailSchema,
});

export type Attendance = z.infer<typeof attendanceSchema>;
export type AttendanceDetail = z.infer<typeof attendanceDetailSchema>;
export type AttendanceParams = z.infer<typeof attendanceParamsSchema>;
export type AttendanceResponse = z.infer<typeof attendanceResponseSchema>;
export type AttendanceDetailResponse = z.infer<
  typeof attendanceDetailResponseSchema
>;
