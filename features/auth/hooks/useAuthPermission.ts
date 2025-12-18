"use client";

import { useState, useEffect, useCallback } from "react";
import { PermissionItem, RolePermissionResponse } from "../types";
import { fetchCurrentUserPermissions } from "../services/authApi";

export function useAuthPermissions() {
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch the raw response (which is the wrapper object)
        const data: RolePermissionResponse | null =
          await fetchCurrentUserPermissions();

        console.log("Raw Permissions Response:", data); // Debugging

        // 2. CRITICAL FIX: Extract the array from the nested path
        // Check if data exists, then role_permissions, then permissions
        const permissionArray = data?.role_permissions?.permissions || [];

        // 3. Set the array to state
        setPermissions(permissionArray);
      } catch (error) {
        console.error("Failed to fetch permissions", error);
        setPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // 4. Wrapped in useCallback to prevent infinite loops in Sidebar
  const canRead = useCallback(
    (featureName?: string) => {
      // If no feature is required, it's open to everyone (e.g., Dashboard)
      if (!featureName) return true;

      // Safety check: Ensure permissions is actually an array
      if (!Array.isArray(permissions)) {
        console.warn("Permissions state is not an array:", permissions);
        return false;
      }

      const perm = permissions.find((p) => p.feature_name === featureName);

      // Debug specific features if needed
      // if (featureName === "Office Management") console.log("Checking Office:", perm);

      return perm ? perm.can_read === 1 : false;
    },
    [permissions]
  );

  return { permissions, isLoading, canRead };
}
