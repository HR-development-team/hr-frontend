/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { User, UserDetail } from "../schemas/userSchema";
import { getAllUsers, getUserById, getUserList } from "../services/userApi";
import { useToastContext } from "@components/ToastProvider";
import { getRoleList } from "@features/role/services/roleApi";

export function useFetchUser() {
  const { showToast } = useToastContext();

  // Data States
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Option States
  const [userOptions, setUserOptions] = useState<
    { label: string; value: string; role_name?: string }[]
  >([]);
  const [roleOptions, setRoleOptions] = useState<
    { label: string; value: string }[]
  >([]);

  // Loading States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOptionsUserLoading, setIsOptionsUserLoading] =
    useState<boolean>(false);
  const [isOptionsRoleLoading, setIsOptionsRoleLoading] =
    useState<boolean>(false);

  const fetchUsers = useCallback(
    async (params: any = {}, showToastMessage: boolean = false) => {
      try {
        setIsLoading(true);
        const response = await getAllUsers(params);

        setUsers(response.users || response.data || []);
        setTotalRecords(response.meta?.total || 0);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data user berhasil dimuat");
        }
      } catch (err: any) {
        setUsers([]);
        showToast("error", "Gagal", err.message || "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const fetchUserById = useCallback(
    async (id: number) => {
      try {
        setIsLoading(true);
        const data = await getUserById(id);
        setUser(data);
      } catch (err: any) {
        console.error("Error fetching user details:", err);
        showToast("error", "Gagal", "Gagal memuat detail user");
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const fetchUserOptions = useCallback(async (params: any = {}) => {
    try {
      setIsOptionsUserLoading(true);
      const data = await getUserList(params);

      if (data) {
        const formattedOptions = data.map((item: any) => ({
          label: item.email,
          value: item.user_code,
          role_name: item.role_name,
        }));

        setUserOptions(formattedOptions);
      }
    } catch (err) {
      console.error("Failed to fetch user options", err);
    } finally {
      setIsOptionsUserLoading(false);
    }
  }, []);

  const fetchRoleOptions = useCallback(async () => {
    try {
      setIsOptionsRoleLoading(true);
      const data = await getRoleList();

      if (data) {
        const formattedOptions = data.map((item: any) => ({
          label: item.name,
          value: item.role_code,
        }));

        setRoleOptions(formattedOptions);
      }
    } catch (err) {
      console.error("Failed to fetch role options", err);
    } finally {
      setIsOptionsRoleLoading(false);
    }
  }, []);

  const clearUser = useCallback(() => setUser(null), []);
  const clearUserOptions = useCallback(() => {
    setUserOptions([]);
  }, []);
  const clearRoleOptions = useCallback(() => {
    setRoleOptions([]);
  }, []);

  return {
    users,
    user,
    userOptions,
    roleOptions,
    totalRecords,

    isLoading,
    isOptionsUserLoading,
    isOptionsRoleLoading,

    fetchUsers,
    fetchUserById,
    fetchUserOptions,
    fetchRoleOptions,

    clearUser,
    clearUserOptions,
    clearRoleOptions,
  };
}
