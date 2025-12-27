"use client";

import { useEffect, useCallback, useRef } from "react";
import { useDialogEmployee } from "./useDialogEmployee";
import { useFilterEmployee } from "./useFilterEmployee";
import { useFetchEmployee } from "../hooks/useFetchEmployee";
import { useSaveEmployee } from "../hooks/useSaveEmployee";
import { useDeleteEmployee } from "../hooks/useDeleteEmployee";
import { EmployeeFormData, Employee } from "../schemas/employeeSchema";

export function usePageEmployee() {
  const dialog = useDialogEmployee();
  const filter = useFilterEmployee();
  const isFirstLoad = useRef(true);

  // 1. Centralized Data & Options from useFetchEmployee
  const {
    // Main Data
    employees,
    employee,
    totalRecords,
    isLoading,

    // Options (Standardized)
    officeOptions,
    departmentOptions,
    divisionOptions,
    positionOptions,

    // Loading States for Options
    isOptionsDepartmentLoading,
    isOptionsDivisionLoading,
    isOptionsPositionLoading,

    fetchEmployees,
    fetchEmployeeById,
    fetchOfficeOptions,
    fetchDepartmentOptions,
    fetchDivisionOptions,
    fetchPositionOptions,

    // Clear Actions (for cascading resets)
    clearDepartmentOptions,
    clearDivisionOptions,
    clearPositionOptions,
  } = useFetchEmployee();

  const refreshData = useCallback(() => {
    fetchEmployees(filter.apiParams, false);
  }, [fetchEmployees, filter.apiParams]);

  const { saveEmployee, isSaving } = useSaveEmployee(() => {
    dialog.close();
    refreshData();
  });

  const deleteAction = useDeleteEmployee(() => {
    refreshData();
  });

  const handleSave = async (values: EmployeeFormData) => {
    await saveEmployee(values, dialog.currentEmployee?.id);
  };

  const handleView = async (row: Employee) => {
    dialog.openView(row);
    await fetchEmployeeById(row.id);
  };

  useEffect(() => {
    const showToast = isFirstLoad.current;
    fetchEmployees(filter.apiParams, showToast);
    fetchOfficeOptions();
    isFirstLoad.current = false;
  }, [filter.apiParams, fetchEmployees, fetchOfficeOptions]);

  return {
    // Data
    employees,
    employee,
    totalRecords,

    // Options
    officeOptions,
    departmentOptions,
    divisionOptions,
    positionOptions,

    // Fetchers (Exposed for UI cascading)
    fetchOfficeOptions,
    fetchDepartmentOptions,
    fetchDivisionOptions,
    fetchPositionOptions,

    // Clearers
    clearDepartmentOptions,
    clearDivisionOptions,
    clearPositionOptions,

    // Loading States
    isLoading,
    isOptionsDepartmentLoading,
    isOptionsDivisionLoading,
    isOptionsPositionLoading,
    isSaving,

    // Pagination & Filter
    lazyParams: filter.lazyParams,
    onPageChange: filter.onPageChange,
    filter,

    // Actions
    dialog,
    deleteAction,
    handleSave,
    handleView,
  };
}
