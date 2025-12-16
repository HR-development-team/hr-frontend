/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import {
  getAllLeaveRequests,
  getLeaveRequestById,
} from "../services/leaveRequestApi";
import { LeaveRequest } from "../schemas/leaveRequestSchema";
import { useToastContext } from "@components/ToastProvider";

export function useFetchLeaveRequest() {
  const { showToast } = useToastContext();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Fetch all leave requests
   */
  const fetchLeaveRequests = useCallback(
    async (
      showToastMessage: boolean = false,
      params?: {
        search?: string;
      }
    ) => {
      try {
        setIsLoading(true);
        const data = await getAllLeaveRequests();
        setLeaveRequests(data);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data jatah cuti berhasil dimuat");
        }
      } catch (err: any) {
        if (showToastMessage) {
          showToast("error", "Gagal", err.message);
        }
        setLeaveRequests([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  /**
   * Fetch a single leave request detail by ID
   */
  const fetchLeaveRequestById = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      const data = await getLeaveRequestById(id);
      setLeaveRequest(data);
    } catch (err) {
      console.error("Error fetching department details:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset selected leave request
   */
  const clearLeaveRequest = useCallback(() => setLeaveRequest(null), []);

  return {
    leaveRequest,
    leaveRequests,
    isLoading,
    fetchLeaveRequests,
    fetchLeaveRequestById,
    clearLeaveRequest,
  };
}
