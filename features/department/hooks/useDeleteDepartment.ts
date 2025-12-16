/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { deleteDepartment } from "../services/departmentApi";
import { useToastContext } from "@components/ToastProvider";
import { Department } from "../schemas/departmentSchema";

export function useDeleteDepartment(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [departmentToDelete, setDepartmentToDelete] =
    useState<Department | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  /**
   * Set the department that needs to be deleted
   */
  const requestDelete = (department: Department) => {
    setDepartmentToDelete(department);
  };

  /**
   * Cancel the delete operation
   */
  const cancelDelete = () => {
    if (!isDeleting) {
      setDepartmentToDelete(null);
    }
  };

  /**
   * Confirm and execute the delete API call
   */
  const confirmDelete = async () => {
    if (!departmentToDelete) return;

    try {
      setIsDeleting(true);

      await deleteDepartment(departmentToDelete.id);
      showToast("success", "Berhasil", "Departemen berhasil dihapus");

      setDepartmentToDelete(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("deleteDepartment error:", err);
      showToast("error", "Gagal", err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    departmentToDelete,
    isDeleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
