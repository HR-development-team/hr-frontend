"use client";

import { useEffect, useCallback } from "react";

import { useDialogDivision } from "./useDialogDivision";
import { useFilterDivision } from "./useFilterDivision";
import { useFetchDivision } from "./useFetchDivision";
import { useSaveDivision } from "./useSaveDivision";
import { useDeleteDivision } from "./useDeleteDivision";
import { DivisionFormData, Division } from "../schemas/divisionSchema";

export function usePageDivision() {
  const dialog = useDialogDivision();
  const filter = useFilterDivision();

  const { divisions, division, fetchDivisions, fetchDivisionById, isLoading } =
    useFetchDivision();

  const refreshData = useCallback(
    (showToast: boolean = false) => {
      fetchDivisions(showToast, filter.queryParams);
    },
    [fetchDivisions, filter.queryParams]
  );

  const { saveDivision, isSaving } = useSaveDivision(() => {
    dialog.close();
    refreshData(false);
  });

  const deleteAction = useDeleteDivision(() => {
    refreshData(false);
  });

  const handleSave = async (values: DivisionFormData) => {
    await saveDivision(values, dialog.currentDivision?.id);
  };

  const handleView = async (row: Division) => {
    dialog.openView(row);
    await fetchDivisionById(row.id);
  };

  // Initial Data Load
  useEffect(() => {
    refreshData(true);
  }, [refreshData]);

  return {
    // Data & Status
    divisions,
    division,
    isLoading,
    isSaving,

    dialog,
    filter,
    deleteAction,

    // Handlers
    handleSave,
    handleView,
  };
}
