import { DashboardStat } from "../schemas/dashboardSchema";

const BASE_URL = "/api/admin/dashboard/metric";

/**
 * Fetch dashboard statistics
 */
export async function getDashboardMetrics(): Promise<DashboardStat> {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch dashboard metrics");
    }

    const data = await res.json();

    return data.metrics || data.master_employees || data;
  } catch (error) {
    console.error("getDashboardMetrics error:", error);
    return {
      totalEmployee: 0,
      totalLeaveRequest: 0,
      totalAttendance: 0,
      totalLeaveBalance: 0,
    };
  }
}
