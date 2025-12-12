"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useFetchPermissions } from "./useFetchPermission";
import { useSavePermissions } from "./useSavePermission";

export function usePagePermission() {
  const params = useParams();

  const roleCode = useMemo(() => {
    if (!params.roleCode) return "";
    return Array.isArray(params.roleCode)
      ? params.roleCode[0]
      : params.roleCode;
  }, [params.roleCode]);

  const {
    roleData,
    isLoading,
    fetchPermissions,
    updateLocalPermission,
    hasChanges,
  } = useFetchPermissions();

  const { savePermissions, isSaving } = useSavePermissions(() => {
    if (roleCode) fetchPermissions(roleCode, false);
  });

  useEffect(() => {
    if (roleCode) {
      fetchPermissions(roleCode);
    }
  }, [roleCode, fetchPermissions]);

  const handleSave = async () => {
    if (roleData && roleCode) {
      await savePermissions(roleCode, roleData.permissions);
    }
  };

  const roleName = roleData?.role_name || "Memuat...";
  const permissionsList = roleData?.permissions || [];

  return {
    // Data
    roleCode,
    roleName,
    permissionsList,

    // Status
    isLoading,
    isSaving,
    hasChanges,

    // Actions
    updateLocalPermission,
    handleSave,
  };
}
