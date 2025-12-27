/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Role } from "../schemas/roleSchema";
import { getAllRoles, getRoleById } from "../services/roleApi";
import { useToastContext } from "@components/ToastProvider";

export function useFetchRoles() {
  const { showToast } = useToastContext();

  // Data States
  const [roles, setRoles] = useState<Role[]>([]);
  const [role, setRole] = useState<Role | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Loading States
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchRoles = useCallback(
    async (params: any = {}, showToastMessage: boolean = false) => {
      try {
        setIsLoading(true);
        const response = await getAllRoles(params);

        setRoles(response.roles || response.data || []);
        setTotalRecords(response.meta?.total || 0);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data role berhasil dimuat");
        }
      } catch (err: any) {
        setRoles([]);
        showToast("error", "Gagal", err.message || "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const fetchRoleById = useCallback(
    async (id: number) => {
      try {
        setIsLoading(true);
        const data = await getRoleById(id);
        setRole(data);
      } catch (err: any) {
        console.error("Error fetching role details:", err);
        showToast("error", "Gagal", "Gagal memuat detail role");
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const clearRole = useCallback(() => setRole(null), []);

  return {
    roles,
    role,
    totalRecords,
    isLoading,
    fetchRoles,
    fetchRoleById,
    clearRole,
  };
}
