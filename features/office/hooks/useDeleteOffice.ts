/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { deleteOffice } from "../services/officeApi";
import { useToastContext } from "@components/ToastProvider";
import { Office } from "../schemas/officeSchema";

export function useDeleteOffice(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [officeToDelete, setOfficeToDelete] = useState<Office | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  /**
   * Set the office that needs to be deleted
   */
  const requestDelete = (office: Office) => {
    setOfficeToDelete(office);
  };

  /**
   * Cancel the delete operation
   */
  const cancelDelete = () => {
    if (!isDeleting) {
      setOfficeToDelete(null);
    }
  };

  /**
   * Confirm and execute the delete API call
   */
  const confirmDelete = async () => {
    if (!officeToDelete) return;

    try {
      setIsDeleting(true);

      await deleteOffice(officeToDelete.id);
      showToast("success", "Berhasil", "Kantor berhasil dihapus");

      setOfficeToDelete(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("deleteOffice error:", err);
      showToast("error", "Gagal", err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    officeToDelete,
    isDeleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
