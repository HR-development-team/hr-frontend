/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Role } from "../schemas/roleSchema";
import { getAllRoles, getRoleById } from "../services/roleApi";
import { useToastContext } from "@/components/ToastProvider";

export function useFetchRoles() {
  const { showToast } = useToastContext();
  const [roles, setRoles] = useState<Role[]>([]);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Fetch all roles
   */
  const fetchRoles = useCallback(
    async (
      showToastMessage: boolean = true,
      params?: {
        search?: string;
        startDate?: Date | null;
        endDate?: Date | null;
      }
    ) => {
      try {
        setIsLoading(true);
        const data = await getAllRoles();
        setRoles(data);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data role berhasil dimuat");
        }
      } catch (err: any) {
        if (showToastMessage) {
          showToast("error", "Gagal", err.message);
        }
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  /**
   * Fetch a single role detail by ID
   */
  const fetchRoleByIdHandler = useCallback(async (id: number) => {
    setIsLoading(true);
    const data = await getRoleById(id);
    setRole(data);
    setIsLoading(false);
  }, []);

  /**
   * Reset selected role
   */
  const clearRole = useCallback(() => setRole(null), []);

  return {
    roles,
    role,
    isLoading,
    fetchRoles,
    fetchRoleById: fetchRoleByIdHandler,
    clearRole,
  };
}
