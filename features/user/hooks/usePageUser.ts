"use client";

import { useEffect, useCallback, useRef } from "react";
import { useDialogUser } from "./useDialogUser";
import { useFilterUser } from "./useFilterUser";
import { useFetchUser } from "./useFetchUser";
import { useSaveUser } from "./useSaveUser";
import { useDeleteUser } from "./useDeleteUser";
import { UserFormData, User } from "../schemas/userSchema";

export function usePageUser() {
  const dialog = useDialogUser();
  const filter = useFilterUser();
  const isFirstLoad = useRef(true);

  const {
    users,
    user,
    userOptions,
    totalRecords,
    fetchUsers,
    fetchUserById,
    fetchUserOptions,
    isLoading,
  } = useFetchUser();

  const refreshData = useCallback(() => {
    fetchUsers(filter.apiParams, false);
  }, [fetchUsers, filter.apiParams]);

  const { saveUser, isSaving } = useSaveUser(() => {
    dialog.close();
    refreshData();
  });

  const deleteAction = useDeleteUser(() => {
    refreshData();
  });

  const handleSave = async (values: UserFormData) => {
    await saveUser(values, dialog.currentUser?.id);
  };

  const handleView = async (row: User) => {
    dialog.openView(row);
    await fetchUserById(row.id);
  };

  useEffect(() => {
    const showToast = isFirstLoad.current;
    fetchUsers(filter.apiParams, showToast);
    fetchUserOptions();
    isFirstLoad.current = false;
  }, [filter.apiParams, fetchUsers, fetchUserOptions]);

  return {
    // Data & Status
    users,
    user,
    userOptions,
    totalRecords,
    isLoading,
    isSaving,

    // Pagination (Directly pass to PrimeReact DataTable)
    lazyParams: filter.lazyParams,
    onPageChange: filter.onPageChange,

    // Logic Modules
    filter,
    dialog,
    deleteAction,

    // Handlers
    handleSave,
    handleView,
  };
}
