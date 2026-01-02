"use client";

import { useEffect, useCallback, useRef } from "react";
import { useDialogShift } from "./useDialogShift";
import { useFilterShift } from "./useFilterShift";
import { useFetchShift } from "./useFetchShift";
import { useSaveShift } from "./useSaveShift";
import { useDeleteShift } from "./useDeleteShift";
import { ShiftFormData, Shift } from "../schemas/shiftSchema";

export function usePageShift() {
  const dialog = useDialogShift();
  const filter = useFilterShift();
  const isFirstLoad = useRef(true);

  const {
    shifts,
    shift,
    officeOptions,
    totalRecords,
    fetchShifts,
    fetchShiftById,
    fetchOfficeOptions,
    isLoading,
  } = useFetchShift();

  const refreshData = useCallback(() => {
    fetchShifts(filter.apiParams, false);
  }, [fetchShifts, filter.apiParams]);

  const { saveShift, isSaving } = useSaveShift(() => {
    dialog.close();
    refreshData();
  });

  const deleteAction = useDeleteShift(() => {
    refreshData();
  });

  const handleSave = async (values: ShiftFormData) => {
    await saveShift(values, dialog.currentShift?.id);
  };

  const handleView = async (row: Shift) => {
    dialog.openView(row);
    await fetchShiftById(row.id);
  };

  useEffect(() => {
    const showToast = isFirstLoad.current;
    fetchShifts(filter.apiParams, showToast);
    fetchOfficeOptions();
    isFirstLoad.current = false;
  }, [filter.apiParams, fetchShifts, fetchOfficeOptions]);

  return {
    shifts,
    shift,
    officeOptions,
    fetchOfficeOptions,
    totalRecords,

    // Loading state
    isLoading,
    isSaving,

    // Pagination & Filter
    lazyParams: filter.lazyParams,
    onPageChange: filter.onPageChange,
    filter,

    dialog,
    deleteAction,
    handleSave,
    handleView,
  };
}
