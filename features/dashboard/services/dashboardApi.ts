import { Axios } from "@/utils/axios"; // Use custom Axios instance
import { DashboardStat } from "../schemas/dashboardSchema";

const BASE_URL = "/api/admin/dashboard/metric";

/**
 * Fetch dashboard statistics
 */
export async function getDashboardMetrics(): Promise<DashboardStat> {
  try {
    const { data } = await Axios.get(BASE_URL);

    // Return metrics with existing fallback logic
    return data.metrics || data.master_employees || data;
  } catch (error) {
    console.error("getDashboardMetrics error:", error);
    // Return safe fallback values
    return {
      totalEmployee: 0,
      totalLeaveRequest: 0,
      totalAttendance: 0,
      totalLeaveBalance: 0,
    };
  }
}
