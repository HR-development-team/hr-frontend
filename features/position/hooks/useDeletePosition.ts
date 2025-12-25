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

  const requestDelete = (position: Position) => {
    setPositionToDelete(position);
  };

  const cancelDelete = () => {
    if (!isDeleting) {
      setPositionToDelete(null);
    }
  };

  const confirmDelete = async () => {
    if (!positionToDelete) return;

    try {
      setIsDeleting(true);
      await deletePosition(positionToDelete.id);
      showToast("success", "Berhasil", "Jabatan berhasil dihapus");

      setPositionToDelete(null);
      onSuccess?.();
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
