"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDialogRole } from "./useDialogRole";
import { useFilterRole } from "./useFilterRole";
import { useFetchRoles } from "./useFetchRole";
import { useSaveRole } from "./useSaveRole";
import { useDeleteRole } from "./useDeleteRole";
import { Role, RoleFormData } from "../schemas/roleSchema";

export function usePageRole() {
  const router = useRouter();
  const dialog = useDialogRole();
  const filter = useFilterRole();
  const isFirstLoad = useRef(true);

  const { roles, role, totalRecords, fetchRoles, isLoading } = useFetchRoles();

  const refreshData = useCallback(() => {
    fetchRoles(filter.apiParams, false);
  }, [fetchRoles, filter.apiParams]);

  const { saveRole, isSaving } = useSaveRole(() => {
    dialog.close();
    refreshData();
  });

  const deleteAction = useDeleteRole(() => {
    refreshData();
  });

  const handleSave = async (values: RoleFormData) => {
    await saveRole(values, dialog.currentRole?.id);
  };

  const handleSetting = async (row: Role) => {
    router.push(`/admin/management/roles/${row.role_code}`);
  };

  useEffect(() => {
    const showToast = isFirstLoad.current;
    fetchRoles(filter.apiParams, showToast);
    isFirstLoad.current = false;
  }, [filter.apiParams, fetchRoles]);

  return {
    // Data & Status
    roles,
    role,
    totalRecords,
    isLoading,
    isSaving,

    // Pagination (Directly pass to PrimeReact DataTable)
    lazyParams: filter.lazyParams,
    onPageChange: filter.onPageChange,

    // Logic Modules
    filter,
    dialog,
    deleteAction,

    // Handlers
    handleSave,
    handleSetting,
  };
}
