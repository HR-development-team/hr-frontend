import { useCallback, useEffect, useMemo } from "react";
import { useDialogEmployee } from "./useDialogEmployee";
import { useFilterEmployee } from "./useFilterEmployee";
import { useFetchEmployee } from "../hooks/useFetchEmployee";
import { useSaveEmployee } from "../hooks/useSaveEmployee";
import { useDeleteEmployee } from "../hooks/useDeleteEmployee";
import { Employee, EmployeeFormData } from "../schemas/employeeSchema";
import { useFetchOffice } from "@features/office/hooks/useFetchOffice";
import { useFetchPosition } from "@features/position/hooks/useFetchPosition";
import { useFetchUser } from "@features/user/hooks/useFetchUser";
import { useFetchDepartment } from "@features/department/hooks/useFetchDepartment";
import { useFetchDivision } from "@features/division/hooks/useFetchDivision";

export function usePageEmployee() {
  const dialog = useDialogEmployee();
  const filter = useFilterEmployee();

  // 1. Data Hooks
  const { employees, employee, fetchEmployees, fetchEmployeeById, isLoading } =
    useFetchEmployee();
  const { offices, fetchOffices } = useFetchOffice();
  const { positions, fetchPositions } = useFetchPosition();
  const { users, fetchUsers } = useFetchUser();

  // 2. NEW: Fetch Departments & Divisions for Cascading Dropdowns
  const { departments, fetchDepartments } = useFetchDepartment();
  const { divisions, fetchDivisions } = useFetchDivision();

  // 3. Fetch Dependencies
  const fetchDependencies = useCallback(async () => {
    // Run in parallel for speed
    await Promise.all([
      fetchOffices(),
      fetchDepartments(), // Add this
      fetchDivisions(), // Add this
      fetchPositions(),
      fetchUsers(false),
    ]);
  }, [
    fetchOffices,
    fetchDepartments,
    fetchDivisions,
    fetchPositions,
    fetchUsers,
  ]);

  const refreshData = useCallback(
    (showToast: boolean = false) => {
      fetchEmployees(showToast);
    },
    [fetchEmployees]
  );

  // 4. Transform Users into SelectOptions
  const userOptions = useMemo(() => {
    return users.map((user) => ({
      label: user.email,
      value: user.user_code || "",
    }));
  }, [users]);

  // Actions
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
    // Main Data
    employees,
    employee,
    isLoading,
    isSaving,

    // Raw Dependencies (Pass these raw to Dialog for cascading)
    offices,
    departments,
    divisions,
    positions,

    // Formatted Options
    userOptions,

    // Sub-Hooks
    dialog,
    filter,
    deleteAction,

    // Handlers
    handleSave,
    handleView,
  };
}
