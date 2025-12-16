"use client";

import { useEffect, useCallback } from "react";

import { useDialogOffice } from "./useDialogOffice";
import { useFilterOffice } from "./useFilterOffice";
import { useFetchOffice } from "./useFetchOffice";
import { useSaveOffice } from "./useSaveOffice";
import { useDeleteOffice } from "./useDeleteOffice";
import { OfficeFormData, Office } from "../schemas/officeSchema";

export function usePageOffice() {
  const dialog = useDialogOffice();
  const filter = useFilterOffice();

  const { offices, office, fetchOffices, fetchOfficeById, isLoading } =
    useFetchOffice();

  const refreshData = useCallback(
    (showToast: boolean = false) => {
      fetchOffices(showToast, filter.queryParams);
    },
    [fetchOffices, filter.queryParams]
  );

  const { saveOffice, isSaving } = useSaveOffice(() => {
    dialog.close();
    refreshData(false);
  });

  const deleteAction = useDeleteOffice(() => {
    refreshData(false);
  });

  const handleSave = async (values: OfficeFormData) => {
    await saveOffice(values, dialog.currentOffice?.id);
  };

  const handleView = async (row: Office) => {
    dialog.openView(row);
    await fetchOfficeById(row.id);
  };

  useEffect(() => {
    refreshData(true);
  }, [refreshData]);
  return {
    // Data & Status
    offices,
    office,
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
