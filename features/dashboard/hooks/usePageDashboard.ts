"use client";

import { useEffect, useState, useMemo } from "react";
import { useFetchDashboard } from "./useFetchDashboard";
import { useAuth } from "@features/auth/context/AuthProvider";

export function usePageDashboard() {
  const {
    metrics,
    isLoading: isMetricLoading,
    fetchMetrics,
  } = useFetchDashboard();

  const { user, isLoading: isAuthLoading } = useAuth();
  const [todayDate, setTodayDate] = useState<string>("...");

  // Combine loading states
  const isLoading = useMemo(
    () => isMetricLoading || isAuthLoading,
    [isMetricLoading, isAuthLoading]
  );

  // Calculate formatted date on mount (client-side only to avoid hydration mismatch)
  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    setTodayDate(date.toLocaleString("id-ID", options));
  }, []);

  // Initial Fetch
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    user,
    todayDate,
    isLoading,
    refreshMetrics: fetchMetrics,
  };
}
