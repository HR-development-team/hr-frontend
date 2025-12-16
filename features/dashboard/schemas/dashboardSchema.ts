import { z } from "zod";

export const dashboardStatSchema = z.object({
  totalEmployee: z.coerce.number().default(0),
  totalLeaveRequest: z.coerce.number().default(0),
  totalAttendance: z.coerce.number().default(0),
  totalLeaveBalance: z.coerce.number().default(0),
});

export type DashboardStat = z.infer<typeof dashboardStatSchema>;
