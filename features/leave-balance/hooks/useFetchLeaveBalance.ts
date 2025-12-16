/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useMemo, useState } from "react";
import { getAllLeaveBalances } from "../services/leaveBalanceApi";
import { LeaveBalance } from "../schemas/leaveBalanceSchema";
import { useToastContext } from "@components/ToastProvider";

export function useFetchLeaveBalance() {
  const { showToast } = useToastContext();
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Fetch Data from API
   */
  const fetchLeaveBalances = useCallback(
    async (year?: number | null, type_code?: string | null) => {
      try {
        setIsLoading(true);
        const data = await getAllLeaveBalances(year, type_code);
        setLeaveBalances(data);
      } catch (err: any) {
        setLeaveBalances([]);
        showToast(
          "error",
          "Gagal",
          err.message || "Gagal memuat data saldo cuti"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  /**
   * Derived State: Unique Years for Filter Dropdown
   */
  const yearOptions = useMemo(() => {
    const years = leaveBalances.map((item) => item.year);
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => a - b);

    return uniqueYears.map((year) => ({
      label: String(year),
      value: year,
    }));
  }, [leaveBalances]);

  /**
   * Derived State: Unique Leave Types for Filter Dropdown
   */
  const typeOptions = useMemo(() => {
    const uniqueMap = new Map<string, string>();

    leaveBalances.forEach((item) => {
      if (item.leave_type_name && !uniqueMap.has(item.type_code)) {
        uniqueMap.set(item.type_code, item.leave_type_name);
      }
    });

    return Array.from(uniqueMap.entries()).map(([code, name]) => ({
      label: name,
      value: code,
    }));
  }, [leaveBalances]);

  return {
    leaveBalances,
    isLoading,
    fetchLeaveBalances,
    // Return derived options to simplify the Page component
    yearOptions,
    typeOptions,
  };
}
