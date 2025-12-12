"use client";

import { useEffect, useCallback } from "react";
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

  const { roles, fetchRoles, isLoading } = useFetchRoles();

  const refreshData = useCallback(() => {
    fetchRoles(false, filter.queryParams);
  }, [fetchRoles, filter.queryParams]);

  const { saveRole, isSaving } = useSaveRole(() => {
    dialog.close();
    refreshData();
  });

  const deleteAction = useDeleteRole(() => {
    refreshData();
  });

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSave = async (values: RoleFormData) => {
    await saveRole(values, dialog.currentRole?.id);
  };

  const handleSetting = (role: Role) => {
    router.push(`/admin/management/roles/${role.role_code}`);
  };

  return {
    // Data & Status
    roles,
    isLoading,
    isSaving,

    // Sub-Controllers (exposed for UI binding)
    dialog,
    filter,
    deleteAction,

    // Handlers
    handleSave,
    handleSetting,
  };
}
