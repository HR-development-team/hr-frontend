/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { PermissionItem, RolePermissionResponse } from "../types";
import { fetchCurrentUserPermissions } from "../services/authApi";
import { useAuth } from "../context/AuthProvider"; // Import useAuth

export function useAuthPermissions() {
  const { logout } = useAuth(); // Get logout function
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setIsLoading(true);
        const data: RolePermissionResponse | null =
          await fetchCurrentUserPermissions();

        const permissionArray = data?.role_permissions?.permissions || [];
        setPermissions(permissionArray);
      } catch (error: any) {
        console.error("Failed to fetch permissions", error);

        // Now 'error.status' exists and will be 401
        if (error.status === 401) {
          await logout();
        }
        setPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [logout]); // Add logout to dependency

  const canRead = useCallback(
    (featureName?: string) => {
      if (!featureName) return true;
      if (!Array.isArray(permissions)) return false;
      const perm = permissions.find((p) => p.feature_name === featureName);
      return perm ? perm.can_read === 1 : false;
    },
    [permissions]
  );

  return { permissions, isLoading, canRead };
}
