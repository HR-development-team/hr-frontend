"use client";

import { useEffect, useCallback, useRef } from "react";

import { useDialogDivision } from "./useDialogDivision";
import { useFilterDivision } from "./useFilterDivision";
import { useFetchDivision } from "./useFetchDivision";
import { useSaveDivision } from "./useSaveDivision";
import { useDeleteDivision } from "./useDeleteDivision";
import { DivisionFormData, Division } from "../schemas/divisionSchema";

export function usePageDivision() {
  const dialog = useDialogDivision();
  const filter = useFilterDivision();
  const isFirstLoad = useRef(true);

  const {
    divisions,
    division,
    totalRecords,
    fetchDivisions,
    fetchDivisionById,
    isLoading,
  } = useFetchDivision();

  const refreshData = useCallback(() => {
    fetchDivisions(filter.apiParams, false);
  }, [fetchDivisions, filter.apiParams]);

  const { saveDivision, isSaving } = useSaveDivision(() => {
    dialog.close();
    refreshData();
  });

  const deleteAction = useDeleteDivision(() => {
    refreshData();
  });

  const handleSave = async (values: DivisionFormData) => {
    await saveDivision(values, dialog.currentDivision?.id);
  };

  const handleView = async (row: Division) => {
    dialog.openView(row);
    await fetchDivisionById(row.id);
  };

  useEffect(() => {
    const showToast = isFirstLoad.current;
    fetchDivisions(filter.apiParams, showToast);
    isFirstLoad.current = false;
  }, [filter.apiParams, fetchDivisions]);

  return {
    divisions,
    division,
    totalRecords,
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
