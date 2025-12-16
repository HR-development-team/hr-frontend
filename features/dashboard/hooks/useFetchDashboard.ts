/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { DashboardStat } from "../schemas/dashboardSchema";
import { getDashboardMetrics } from "../services/dashboardApi";
import { useToastContext } from "@components/ToastProvider";

const metricDefaultValues: DashboardStat = {
  totalEmployee: 0,
  totalLeaveRequest: 0,
  totalAttendance: 0,
  totalLeaveBalance: 0,
};

export function useFetchDashboard() {
  const { showToast } = useToastContext();
  const [metrics, setMetrics] = useState<DashboardStat>(metricDefaultValues);
  // Start loading as true for dashboard to prevent flash of zero values
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getDashboardMetrics();
      setMetrics(data);
    } catch (err: any) {
      console.error("fetchMetrics error:", err);
      showToast("error", "Gagal", "Gagal memuat data statistik dashboard");
      setMetrics(metricDefaultValues);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  return {
    metrics,
    isLoading,
    fetchMetrics,
  };
}
