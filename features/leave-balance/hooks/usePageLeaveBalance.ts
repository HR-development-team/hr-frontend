/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

// Hooks
import { useFetchLeaveBalance } from "./useFetchLeaveBalance";
import { useDeleteLeaveBalance } from "./useDeleteLeaveBalance";
import { useSaveLeaveBalance } from "./useSaveLeaveBalance";
import { useDialogLeaveBalance } from "./useDialogLeaveBalance";
import { useFetchEmployee } from "@features/employee/hooks/useFetchEmployee";

// Types
import { LeaveBalanceFormData } from "../schemas/leaveBalanceSchema";

export function usePageLeaveBalance() {
  // =========================================================================
  // 1. Local State
  // =========================================================================
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);

  // =========================================================================
  // 2. Sub-Hooks (Data & Logic)
  // =========================================================================

  // A. Data Fetching (Balances)
  const {
    leaveBalances,
    isLoading: isTableLoading,
    fetchLeaveBalances,
    yearOptions,
    typeOptions,
  } = useFetchLeaveBalance();

  // B. Data Fetching (Employees - Only needed for Single Add/Edit)
  const {
    employees,
    isLoading: isEmployeeLoading,
    fetchEmployees,
  } = useFetchEmployee();

  // C. Dialog Management (The Main Form)
  const dialog = useDialogLeaveBalance();

  // =========================================================================
  // 3. Callback Actions (Refreshes & Success Handlers)
  // =========================================================================

  const refreshData = useCallback(() => {
    fetchLeaveBalances(filterYear, filterType);
  }, [fetchLeaveBalances, filterYear, filterType]);

  // D. Save Logic (Create/Update)
  const { saveLeaveBalance, isSaving } = useSaveLeaveBalance(() => {
    dialog.close();
    refreshData();
  });

  // E. Delete Logic (Single & Bulk)
  const deleteAction = useDeleteLeaveBalance(() => {
    // This runs on successful Single Delete
    refreshData();
  });

  // =========================================================================
  // 4. Handlers & Interactions
  // =========================================================================

  // -- Filter Handlers --
  const handleFilterYearChange = (val: number | null) => setFilterYear(val);
  const handleFilterTypeChange = (val: string | null) => setFilterType(val);

  // -- Option Dialog Handlers --
  const openOptionDialog = () => setIsOptionDialogOpen(true);
  const closeOptionDialog = () => setIsOptionDialogOpen(false);

  // -- Menu Selections (Transitions from Option Dialog to Form) --
  const handleSelectBulkAdd = () => {
    closeOptionDialog();
    setTimeout(() => dialog.openBulkAdd(), 150); // Small delay for smooth transition
  };

  const handleSelectSingleAdd = () => {
    closeOptionDialog();
    fetchEmployees(); // Fetch employees now, only when needed
    setTimeout(() => dialog.openSingleAdd(), 150);
  };

  const handleSelectBulkDelete = () => {
    closeOptionDialog();
    setTimeout(() => dialog.openBulkDelete(), 150);
  };

  // -- Row Actions --
  const handleEdit = (row: any) => {
    fetchEmployees(); // Need employees for the dropdown
    dialog.openEdit(row);
  };

  // -- Form Submission Router --
  const handleSubmit = async (values: LeaveBalanceFormData) => {
    // Special Case: Bulk Delete logic is separated in the delete hook
    if (dialog.mode === "bulkDelete") {
      try {
        await deleteAction.executeBulkDelete(values.year, values.type_code);
        dialog.close();
        refreshData();
      } catch (error) {
        console.error("Bulk Delete failed:", error);
        // Error handling is done inside executeBulkDelete (toast)
        // We catch here to prevent closing the dialog if failed
      }
    } else {
      // Handle Bulk Add, Single Add, and Edit via the Save Hook
      await saveLeaveBalance(
        dialog.mode,
        values,
        dialog.currentLeaveBalance?.id
      );
    }
  };

  // =========================================================================
  // 5. Effects
  // =========================================================================

  // React to filter changes
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Combined Loading State
  const isLoading = useMemo(
    () => isTableLoading || isEmployeeLoading,
    [isTableLoading, isEmployeeLoading]
  );

  // Map Employees for Dropdown (value/label format)
  const employeeOptions = useMemo(() => {
    return employees.map((emp) => ({
      label: `${emp.full_name} - ${emp.employee_code}`,
      value: emp.employee_code,
    }));
  }, [employees]);

  return {
    // Data
    leaveBalances,
    yearOptions,
    typeOptions,
    employeeOptions, // Formatted for Dropdown

    // Status
    isLoading,
    isSaving,
    isDeleting: deleteAction.isDeleting,

    // Filter State
    filterYear,
    filterType,
    setFilterYear: handleFilterYearChange,
    setFilterType: handleFilterTypeChange,

    // Dialog & UI State
    isOptionDialogOpen,
    dialog, // Form Dialog State
    deleteAction, // Delete Dialog State (Single Item)

    // Actions
    openOptionDialog,
    closeOptionDialog,
    handleSelectBulkAdd,
    handleSelectSingleAdd,
    handleSelectBulkDelete,
    handleEdit,
    handleSubmit, // The main form submit handler
    refreshData,
  };
}
