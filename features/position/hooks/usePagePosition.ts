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
    fetchPositions,
    fetchPositionById,
    fetchOfficeOptions,
    fetchDepartmentOptions,
    fetchDivisionOptions,
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
    await savePosition(values, dialog.currentPosition?.id);
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
    positions,
    position,
    officeOptions,
    departmentOptions,
    divisionOptions,
    fetchOfficeOptions,
    fetchDepartmentOptions,
    fetchDivisionOptions,
    clearDepartmentOptions,
    clearDivisionOptions,
    totalRecords,

    // Loading state
    isLoading,
    isOptionsDepartmentLoading,
    isOptionsDivisionLoading,
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
