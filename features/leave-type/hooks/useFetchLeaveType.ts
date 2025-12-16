/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { LeaveType, LeaveTypeDetail } from "../schemas/leaveTypeSchema";
import { getAllLeaveTypes, getLeaveTypeById } from "../services/leaveTypeApi";
import { useToastContext } from "@components/ToastProvider";

export function useFetchLeaveType() {
  const { showToast } = useToastContext();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveType, setLeaveType] = useState<LeaveTypeDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Fetch all leave types
   */
  const fetchLeaveTypes = useCallback(
    async (
      showToastMessage: boolean = false,
      params?: {
        search?: string;
      }
    ) => {
      try {
        setIsLoading(true);
        // Pass params if your API supports filtering, otherwise just fetch all
        const data = await getAllLeaveTypes();
        setLeaveTypes(data);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data tipe cuti berhasil dimuat");
        }
      } catch (err: any) {
        if (showToastMessage) {
          showToast("error", "Gagal", err.message);
        }
        setLeaveTypes([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  /**
   * Fetch a single leave type detail by ID
   */
  const fetchLeaveTypeByIdHandler = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      const data = await getLeaveTypeById(id);
      setLeaveType(data);
    } catch (err) {
      console.error("Error fetching leave type details:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset selected leave type
   */
  const clearLeaveType = useCallback(() => setLeaveType(null), []);

  return {
    leaveTypes,
    leaveType,
    isLoading,
    fetchLeaveTypes,
    fetchLeaveTypeById: fetchLeaveTypeByIdHandler,
    clearLeaveType,
  };
}
