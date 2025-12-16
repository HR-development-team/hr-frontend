/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { deleteEmployee } from "../services/employeeApi";
import { useToastContext } from "@components/ToastProvider";
import { Employee } from "../schemas/employeeSchema";

export function useDeleteEmployee(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  /**
   * Set the employee that needs to be deleted
   */
  const requestDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
  };

  /**
   * Cancel the delete operation
   */
  const cancelDelete = () => {
    if (!isDeleting) {
      setEmployeeToDelete(null);
    }
  };

  /**
   * Confirm and execute the delete API call
   */
  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      setIsDeleting(true);
      await deleteEmployee(employeeToDelete.id);
      showToast("success", "Berhasil", "Data karyawan berhasil dihapus");
      setEmployeeToDelete(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("deleteEmployee error:", err);
      showToast("error", "Gagal", err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    employeeToDelete,
    isDeleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
