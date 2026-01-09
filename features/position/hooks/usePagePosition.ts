"use client";

import { useEffect, useCallback, useRef } from "react";
import { useDialogPosition } from "./useDialogPosition";
import { useFilterPosition } from "./useFilterPosition";
import { useFetchPosition } from "./useFetchPosition";
import { useSavePosition } from "./useSavePosition";
import { useDeletePosition } from "./useDeletePosition";
import { PositionFormData, Position } from "../schemas/positionSchema";

export function usePagePosition() {
  const dialog = useDialogPosition();
  const filter = useFilterPosition();
  const isFirstLoad = useRef(true);

  const {
    positions,
    position,
    officeOptions,
    departmentOptions,
    divisionOptions,
    clearDepartmentOptions,
    clearDivisionOptions,
    totalRecords,

    // Actions
    fetchPositions,
    fetchPositionById,
    fetchOfficeOptions,
    fetchDepartmentOptions,
    fetchDivisionOptions,

    // Loading States
    isLoading,
    isOptionsDepartmentLoading,
    isOptionsDivisionLoading,
  } = useFetchPosition();

  const refreshData = useCallback(() => {
    fetchPositions(filter.apiParams, false);
  }, [fetchPositions, filter.apiParams]);

  const { savePosition, isSaving } = useSavePosition(() => {
    dialog.close();
    refreshData();
  });

  const deleteAction = useDeletePosition(() => {
    refreshData();
  });

  const handleSave = async (values: PositionFormData) => {
    const currentId =
      dialog.currentPosition && "id" in dialog.currentPosition
        ? dialog.currentPosition.id
        : undefined;

    await savePosition(values, currentId, dialog.positionType);
  };

  const handleView = async (row: Position) => {
    dialog.openView(row);
    await fetchPositionById(row.id);
  };

  useEffect(() => {
    const showToast = isFirstLoad.current;
    fetchPositions(filter.apiParams, showToast);
    fetchOfficeOptions();

    isFirstLoad.current = false;
  }, [filter.apiParams, fetchPositions, fetchOfficeOptions]);

  return {
    // Data
    positions,
    position,
    totalRecords,

    // Options
    officeOptions,
    departmentOptions,
    divisionOptions,

    // Option Fetchers (for the Filter Dialog)
    fetchDepartmentOptions,
    fetchDivisionOptions,
    clearDepartmentOptions,
    clearDivisionOptions,
    fetchOfficeOptions,

    // Loading State
    isLoading,
    isOptionsDepartmentLoading,
    isOptionsDivisionLoading,
    isSaving,

    // Pagination
    lazyParams: filter.lazyParams,
    onPageChange: filter.onPageChange,

    // Sub-Hooks
    filter,
    dialog,
    deleteAction,

    // Main Actions
    handleSave,
    handleView,
  };
}
