/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { deleteShift } from "../services/shiftApi";
import { useToastContext } from "@components/ToastProvider";
import { Shift } from "../schemas/shiftSchema";

export function useDeleteShift(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [shiftToDelete, setShiftToDelete] = useState<Shift | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const requestDelete = (shift: Shift) => {
    setShiftToDelete(shift);
  };

  const cancelDelete = () => {
    if (!isDeleting) {
      setShiftToDelete(null);
    }
  };

  const confirmDelete = async () => {
    if (!shiftToDelete) return;

    try {
      setIsDeleting(true);
      await deleteShift(shiftToDelete.id);
      showToast("success", "Berhasil", "Shift berhasil dihapus");

      setShiftToDelete(null);
      onSuccess?.();
    } catch (err: any) {
      console.error("deleteShift error:", err);
      showToast("error", "Gagal", err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    shiftToDelete,
    isDeleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
