/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { deleteUser } from "../services/userApi";
import { useToastContext } from "@components/ToastProvider";
import { User } from "../schemas/userSchema";

export function useDeleteUser(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const requestDelete = (user: User) => {
    setUserToDelete(user);
  };

  const cancelDelete = () => {
    if (!isDeleting) {
      setUserToDelete(null);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);

      await deleteUser(userToDelete.id);
      showToast("success", "Berhasil", "User berhasil dihapus");

      setUserToDelete(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("deleteUser error:", err);
      showToast("error", "Gagal", err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    userToDelete,
    isDeleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
