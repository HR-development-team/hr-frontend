/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { deletePosition } from "../services/positionApi";
import { useToastContext } from "@components/ToastProvider";
import { Position } from "../schemas/positionSchema";

export function useDeletePosition(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [positionToDelete, setPositionToDelete] = useState<Position | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  /**
   * Set the position that needs to be deleted
   */
  const requestDelete = (position: Position) => {
    setPositionToDelete(position);
  };

  /**
   * Cancel the delete operation
   */
  const cancelDelete = () => {
    if (!isDeleting) {
      setPositionToDelete(null);
    }
  };

  /**
   * Confirm and execute the delete API call
   */
  const confirmDelete = async () => {
    if (!positionToDelete) return;

    try {
      setIsDeleting(true);

      await deletePosition(positionToDelete.id);
      showToast("success", "Berhasil", "Jabatan berhasil dihapus");

      setPositionToDelete(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("deletePosition error:", err);
      showToast("error", "Gagal", err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    positionToDelete,
    isDeleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
