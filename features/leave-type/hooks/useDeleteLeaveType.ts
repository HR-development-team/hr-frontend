/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { deleteLeaveType } from "../services/leaveTypeApi";
import { useToastContext } from "@components/ToastProvider";
import { LeaveType } from "../schemas/leaveTypeSchema";

export function useDeleteLeaveType(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [leaveTypeToDelete, setLeaveTypeToDelete] = useState<LeaveType | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  /**
   * Set the leave type that needs to be deleted
   */
  const requestDelete = (leaveType: LeaveType) => {
    setLeaveTypeToDelete(leaveType);
  };

  /**
   * Cancel the delete operation
   */
  const cancelDelete = () => {
    if (!isDeleting) {
      setLeaveTypeToDelete(null);
    }
  };

  /**
   * Confirm and execute the delete API call
   */
  const confirmDelete = async () => {
    if (!leaveTypeToDelete) return;

    try {
      setIsDeleting(true);

      await deleteLeaveType(leaveTypeToDelete.id);
      showToast("success", "Berhasil", "Tipe cuti berhasil dihapus");

      setLeaveTypeToDelete(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("deleteLeaveType error:", err);
      showToast("error", "Gagal", err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    leaveTypeToDelete,
    isDeleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
