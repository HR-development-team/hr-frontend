"use client";

import { useEffect, useCallback } from "react";
import { useFetchLeaveRequest } from "./useFetchLeaveRequest";
import { useSaveLeaveRequest } from "./useSaveLeaveRequest";
import { useDialogLeaveRequest } from "./useDialogLeaveRequest";
import { LeaveRequest, LeaveStatus } from "../schemas/leaveRequestSchema";
import { useFilterLeaveRequest } from "./useFilterLeaveRequest";
import { useDeleteLeaveRequest } from "./useDeleteLeaveRequest";

export function usePageLeaveRequest() {
  const dialog = useDialogLeaveRequest();
  const filter = useFilterLeaveRequest();

  const {
    leaveRequest,
    leaveRequests,
    fetchLeaveRequests,
    fetchLeaveRequestById,
    isLoading,
  } = useFetchLeaveRequest();

  const refreshData = useCallback(
    (showToast: boolean = false) => {
      fetchLeaveRequests(showToast, filter.queryParams);
    },
    [fetchLeaveRequests, filter.queryParams]
  );

  const { updateStatus, isSaving } = useSaveLeaveRequest(() => {
    dialog.close();
    refreshData();
  });

  const deleteAction = useDeleteLeaveRequest(() => {
    refreshData(false);
  });

  const handleUpdateStatus = async (id: number, status: LeaveStatus) => {
    await updateStatus(id, status);
  };

  const handleView = async (row: LeaveRequest) => {
    dialog.openView(row);
    await fetchLeaveRequestById(row.id);
  };

  // Initial Data Load
  useEffect(() => {
    refreshData(true);
  }, [refreshData]);

  return {
    // Data & Status
    leaveRequests,
    leaveRequest,
    isLoading,
    isSaving,

    dialog,
    filter,
    deleteAction,

    // Handlers
    handleUpdateStatus,
    handleView,
  };
}
