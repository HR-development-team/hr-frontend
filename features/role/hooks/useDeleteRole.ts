/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { deleteRole } from "../services/roleApi";
import { useToastContext } from "@/components/ToastProvider";
import { Role } from "../schemas/roleSchema";

export function useDeleteRole(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const requestDelete = (role: Role) => {
    setRoleToDelete(role);
  };

  const cancelDelete = () => {
    if (!isDeleting) {
      setRoleToDelete(null);
    }
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      setIsDeleting(true);

      await deleteRole(roleToDelete.id);
      showToast("success", "Berhasil", "Role berhasil dihapus");

      setRoleToDelete(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("deleteRole error:", err);
      showToast("error", "Gagal", err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    roleToDelete,
    isDeleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
