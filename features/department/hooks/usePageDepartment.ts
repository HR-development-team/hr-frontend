"use client";

import { useEffect, useCallback, useRef } from "react";
import { useDialogDepartment } from "./useDialogDepartment";
import { useFilterDepartment } from "./useFilterDepartment";
import { useFetchDepartment } from "./useFetchDepartment";
import { useSaveDepartment } from "./useSaveDepartment";
import { useDeleteDepartment } from "./useDeleteDepartment";
import { DepartmentFormData, Department } from "../schemas/departmentSchema";

export function usePageDepartment() {
  const dialog = useDialogDepartment();
  const filter = useFilterDepartment();
  const isFirstLoad = useRef(true);

  const {
    departments,
    department,
    officeOptions,
    totalRecords,
    isLoading,
    fetchDepartments,
    fetchDepartmentById,
    fetchOfficeOptions,
  } = useFetchDepartment();

  const refreshData = useCallback(() => {
    fetchDepartments(filter.apiParams, false);
  }, [fetchDepartments, filter.apiParams]);

  const { saveDepartment, isSaving } = useSaveDepartment(() => {
    dialog.close();
    refreshData();
  });

  const deleteAction = useDeleteDepartment(() => {
    refreshData();
  });

  const handleSave = async (values: DepartmentFormData) => {
    await saveDepartment(values, dialog.currentDepartment?.id);
  };

  const handleView = async (row: Department) => {
    dialog.openView(row);
    await fetchDepartmentById(row.id);
  };

  useEffect(() => {
    const showToast = isFirstLoad.current;
    fetchDepartments(filter.apiParams, showToast);
    fetchOfficeOptions();
    isFirstLoad.current = false;
  }, [filter.apiParams, fetchDepartments, fetchOfficeOptions]);

  return {
    departments,
    department,
    officeOptions,
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
