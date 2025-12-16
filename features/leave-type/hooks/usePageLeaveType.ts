"use client";

import { useEffect, useCallback } from "react";

import { useDialogLeaveType } from "./useDialogLeaveType";
import { useFilterLeaveType } from "./useFilterLeaveType";
import { useFetchLeaveType } from "./useFetchLeaveType";
import { useSaveLeaveType } from "./useSaveLeaveType";
import { useDeleteLeaveType } from "./useDeleteLeaveType";
import { LeaveTypeFormData, LeaveType } from "../schemas/leaveTypeSchema";

export function usePageLeaveType() {
  const dialog = useDialogLeaveType();
  const filter = useFilterLeaveType();

  const {
    leaveTypes,
    leaveType,
    fetchLeaveTypes,
    fetchLeaveTypeById,
    isLoading,
  } = useFetchLeaveType();

  const refreshData = useCallback(
    (showToast: boolean = false) => {
      fetchLeaveTypes(showToast, filter.queryParams);
    },
    [fetchLeaveTypes, filter.queryParams]
  );

  const { saveLeaveType, isSaving } = useSaveLeaveType(() => {
    dialog.close();
    refreshData(false);
  });

  const deleteAction = useDeleteLeaveType(() => {
    refreshData(false);
  });

  const handleSave = async (values: LeaveTypeFormData) => {
    await saveLeaveType(values, dialog.currentLeaveType?.id);
  };

  const handleView = async (row: LeaveType) => {
    dialog.openView(row);
    await fetchLeaveTypeById(row.id);
  };

  // Initial Data Load
  useEffect(() => {
    refreshData(true);
  }, [refreshData]);

  return {
    // Data & Status
    leaveTypes,
    leaveType,
    isLoading,
    isSaving,

    // Sub-Hooks
    dialog,
    filter,
    deleteAction,

    // Handlers
    handleSave,
    handleView,
  };
}
