"use client";

import { useEffect, useCallback, useRef } from "react";
import { useDialogOffice } from "./useDialogOffice";
import { useFilterOffice } from "./useFilterOffice";
import { useFetchOffice } from "./useFetchOffice";
import { useSaveOffice } from "./useSaveOffice";
import { useDeleteOffice } from "./useDeleteOffice";
import { OfficeFormData, Office } from "../schemas/officeSchema";

export function usePageOffice() {
  const dialog = useDialogOffice();
  const filter = useFilterOffice();
  const isFirstLoad = useRef(true);

  const {
    offices,
    totalRecords,
    office,
    fetchOffices,
    fetchOfficeById,
    isLoading,
  } = useFetchOffice();

  const refreshData = useCallback(() => {
    fetchOffices(filter.apiParams, false);
  }, [fetchOffices, filter.apiParams]);

  const { saveOffice, isSaving } = useSaveOffice(() => {
    dialog.close();
    refreshData();
  });

  const deleteAction = useDeleteOffice(() => {
    refreshData();
  });

  const handleSave = async (values: OfficeFormData) => {
    await saveOffice(values, dialog.currentOffice?.id);
  };

  const handleView = async (row: Office) => {
    dialog.openView(row);
    await fetchOfficeById(row.id);
  };

  useEffect(() => {
    const showToast = isFirstLoad.current;
    fetchOffices(filter.apiParams, showToast);
    isFirstLoad.current = false;
  }, [filter.apiParams, fetchOffices]);

  return {
    offices,
    totalRecords,
    isLoading,
    office,
    isSaving,
    lazyParams: filter.lazyParams,
    onPageChange: filter.onPageChange,
    filter,
    dialog,
    deleteAction,
    handleSave,
    handleView,
  };
}
