"use client";

import { useEffect, useCallback } from "react";

import { useDialogEmployee } from "./useDialogEmployee";
import { useFilterEmployee } from "./useFilterEmployee";
import { useFetchEmployee } from "./useFetchEmployee";
import { useSaveEmployee } from "./useSaveEmployee";
import { useDeleteEmployee } from "./useDeleteEmployee";
import { EmployeeFormData, Employee } from "../schemas/employeeSchema";

// Import dependency fetches
import { useFetchOffice } from "@features/office/hooks/useFetchOffice";
import { useFetchPosition } from "@features/position/hooks/useFetchPosition";
import { useFetchUser } from "@features/user/hooks/useFetchUser";

export function usePageEmployee() {
  const dialog = useDialogEmployee();
  const filter = useFilterEmployee();

  const { employees, employee, fetchEmployees, fetchEmployeeById, isLoading } =
    useFetchEmployee();
  const { offices, fetchOffices } = useFetchOffice();
  const { positions, fetchPositions } = useFetchPosition();
  const { users, fetchUsers } = useFetchUser();

  const fetchDependencies = useCallback(async () => {
    fetchOffices();
    fetchPositions();
    fetchUsers();
  }, [fetchOffices, fetchPositions, fetchUsers]);

  const refreshData = useCallback(
    (showToast: boolean = false) => {
      fetchEmployees(showToast);
    },
    [fetchEmployees]
  );

  const { saveEmployee, isSaving } = useSaveEmployee(() => {
    dialog.close();
    refreshData(false);
  });

  const deleteAction = useDeleteEmployee(() => {
    refreshData(false);
  });

  const handleSave = async (values: EmployeeFormData) => {
    await saveEmployee(values, dialog.currentEmployee?.id);
  };

  const handleView = async (row: Employee) => {
    dialog.openView(row);
    await fetchEmployeeById(row.id);
  };

  useEffect(() => {
    refreshData(true);
    fetchDependencies();
  }, [refreshData, fetchDependencies]);

  return {
    // Data
    employees,
    employee,
    isLoading,
    isSaving,

    // Dependencies
    offices,
    positions,
    users,

    // Sub-Hooks
    dialog,
    filter,
    deleteAction,

    // Handlers
    handleSave,
    handleView,
  };
}
