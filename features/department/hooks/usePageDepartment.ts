"use client";

import { useEffect, useCallback } from "react";
import { useDialogDepartment } from "./useDialogDepartment";
import { useFilterDepartment } from "./useFilterDepartment";
import { useFetchDepartment } from "./useFetchDepartment";
import { useSaveDepartment } from "./useSaveDepartment";
import { useDeleteDepartment } from "./useDeleteDepartment";
import { DepartmentFormData, Department } from "../schemas/departmentSchema";

export function usePageDepartment() {
  const dialog = useDialogDepartment();
  const filter = useFilterDepartment();

  const {
    departments,
    department,
    fetchDepartments,
    fetchDepartmentById,
    isLoading,
  } = useFetchDepartment();

  const refreshData = useCallback(
    (showToast: boolean = false) => {
      fetchDepartments(showToast, filter.queryParams);
    },
    [fetchDepartments, filter.queryParams]
  );

  const { saveDepartment, isSaving } = useSaveDepartment(() => {
    dialog.close();
    refreshData(false);
  });

  const deleteAction = useDeleteDepartment(() => {
    refreshData(false);
  });

  const handleSave = async (values: DepartmentFormData) => {
    await saveDepartment(values, dialog.currentDepartment?.id);
  };

  const handleView = async (row: Department) => {
    dialog.openView(row);
    await fetchDepartmentById(row.id);
  };

  // Initial Data Load
  useEffect(() => {
    refreshData(true);
  }, [refreshData]);

  return {
    // Data & Status
    departments,
    department,
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
