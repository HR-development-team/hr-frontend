"use client";

import { useEffect, useCallback } from "react";

import { useDialogUser } from "./useDialogUser";
import { useFilterUser } from "./useFilterUser";
import { useFetchUser } from "./useFetchUser";
import { useSaveUser } from "./useSaveUser";
import { useDeleteUser } from "./useDeleteUser";
import { UserFormData, User } from "../schemas/userSchema";

export function usePageUser() {
  const dialog = useDialogUser();
  const filter = useFilterUser();

  const { users, user, fetchUsers, fetchUserById, isLoading } = useFetchUser();

  const refreshData = useCallback(() => {
    fetchUsers(false, filter.queryParams);
  }, [fetchUsers, filter.queryParams]);

  const { saveUser, isSaving } = useSaveUser(() => {
    dialog.close();
    refreshData();
  });

  const deleteAction = useDeleteUser(() => {
    refreshData();
  });

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSave = async (values: UserFormData) => {
    await saveUser(values, dialog.currentUser?.id);
  };

  const handleView = async (row: User) => {
    dialog.openView(row);
    await fetchUserById(row.id);
  };

  return {
    // Data & Status
    users,
    user,
    isLoading,
    isSaving,

    dialog,
    filter,
    deleteAction,

    // Handlers
    handleSave,
    handleView,
  };
}
