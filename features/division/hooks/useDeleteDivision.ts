/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { deleteDivision } from "../services/divisionApi";
import { useToastContext } from "@components/ToastProvider";
import { Division } from "../schemas/divisionSchema";

export function useDeleteDivision(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [divisionToDelete, setDivisionToDelete] = useState<Division | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  /**
   * Set the division that needs to be deleted
   */
  const requestDelete = (division: Division) => {
    setDivisionToDelete(division);
  };

  /**
   * Cancel the delete operation
   */
  const cancelDelete = () => {
    if (!isDeleting) {
      setDivisionToDelete(null);
    }
  };

  /**
   * Confirm and execute the delete API call
   */
  const confirmDelete = async () => {
    if (!divisionToDelete) return;

    try {
      setIsDeleting(true);
      await deleteDivision(divisionToDelete.id);
      showToast("success", "Berhasil", "Divisi berhasil dihapus");
      setDivisionToDelete(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("deleteDivision error:", err);
      showToast("error", "Gagal", err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    divisionToDelete,
    isDeleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
