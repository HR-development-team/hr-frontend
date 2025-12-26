/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { PermissionItem, RolePermissionResponse } from "../types";
import { fetchCurrentUserPermissions } from "../services/authApi";
import { useAuth } from "../context/AuthProvider";

export function useAuthPermissions() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPermissions([]);
      setIsLoading(false);
      return;
    }

    const fetchPermissions = async () => {
      try {
        setIsLoading(true);

        const data: RolePermissionResponse | null =
          await fetchCurrentUserPermissions();

        setPermissions(data?.role_permissions?.permissions ?? []);
      } catch (error: any) {
        console.error("Failed to fetch permissions", error);

        setPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  const canRead = useCallback(
    (featureName?: string) => {
      if (!featureName) return true;
      if (!permissions?.length) return false;

      const perm = permissions.find((p) => p.feature_name === featureName);

      return perm?.can_read === 1;
    },
    [permissions]
  );

  return { permissions, isLoading, canRead };
}
