/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { User, UserDetail } from "../schemas/userSchema";
import { getAllUsers, getUserById } from "../services/userApi";
import { useToastContext } from "@components/ToastProvider";

export function useFetchUser() {
  const { showToast } = useToastContext();
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Fetch all users
   */
  const fetchUsers = useCallback(
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
        const data = await getAllUsers();
        setUsers(data);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data user berhasil dimuat");
        }
      } catch (err: any) {
        if (showToastMessage) {
          showToast("error", "Gagal", err.message);
        }
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  /**
   * Fetch a single user detail by ID
   */
  const fetchUserByIdHandler = useCallback(async (id: number) => {
    setIsLoading(true);
    const data = await getUserById(id);
    setUser(data);
    setIsLoading(false);
  }, []);

  /**
   * Reset selected user
   */
  const clearUser = useCallback(() => setUser(null), []);

  return {
    users,
    user,
    isLoading,
    fetchUsers,
    fetchUserById: fetchUserByIdHandler,
    clearUser,
  };
}
