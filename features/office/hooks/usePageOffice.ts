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
    office,
    officeOptions,
    totalRecords,
    fetchOffices,
    fetchOfficeById,
    fetchOfficeOptions,
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
    fetchOfficeOptions();
    isFirstLoad.current = false;
  }, [filter.apiParams, fetchOffices, fetchOfficeOptions]);

  return {
    offices,
    office,
    officeOptions,
    totalRecords,
    isLoading,
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
