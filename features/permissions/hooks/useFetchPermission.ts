/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useMemo, useState } from "react";
import {
  FeaturePermission,
  RolePermissionsData,
} from "../schemas/permissionSchema";
import { getPermissionsByRoleCode } from "../services/permissionApi";
import { useToastContext } from "@/components/ToastProvider";

export function useFetchPermissions() {
  const { showToast } = useToastContext();

  const [roleData, setRoleData] = useState<RolePermissionsData | null>(null);
  const [originalPermissions, setOriginalPermissions] = useState<
    FeaturePermission[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Fetch permissions by Role Code
   */
  const fetchPermissions = useCallback(
    async (roleCode: string, showToastMessage: boolean = false) => {
      try {
        setIsLoading(true);
        const data = await getPermissionsByRoleCode(roleCode);

        if (data) {
          setRoleData(data);
          // Deep copy for reference to detect changes later
          setOriginalPermissions(JSON.parse(JSON.stringify(data.permissions)));

          if (showToastMessage) {
            showToast(
              "success",
              "Berhasil",
              "Data permissions berhasil dimuat"
            );
          }
        } else {
          // Handle case where data is null but no error threw
          setRoleData(null);
          setOriginalPermissions([]);
        }
      } catch (err: any) {
        if (showToastMessage) {
          showToast("error", "Gagal", err.message);
        }
        setRoleData(null);
        setOriginalPermissions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  /**
   * Update a specific permission field locally in the state.
   * This handles the checkbox toggles without hitting the API yet.
   */
  const updateLocalPermission = useCallback(
    (featureCode: string, field: keyof FeaturePermission, value: boolean) => {
      // Convert boolean back to 0 | 1 for the schema
      const numericValue = value ? 1 : 0;

      setRoleData((prev) => {
        if (!prev) return null;

        const updatedPermissions = prev.permissions.map((perm) => {
          if (perm.feature_code === featureCode) {
            return { ...perm, [field]: numericValue };
          }
          return perm;
        });

        return { ...prev, permissions: updatedPermissions };
      });
    },
    []
  );

  /**
   * Computed property to check if current state differs from original state.
   * Useful for enabling/disabling the "Save" button.
   */
  const hasChanges = useMemo(() => {
    if (!roleData) return false;
    return (
      JSON.stringify(roleData.permissions) !==
      JSON.stringify(originalPermissions)
    );
  }, [roleData, originalPermissions]);

  return {
    roleData,
    isLoading,
    fetchPermissions,
    updateLocalPermission,
    hasChanges,
  };
}
