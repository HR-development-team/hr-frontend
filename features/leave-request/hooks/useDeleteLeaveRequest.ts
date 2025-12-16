/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { deleteLeaveRequest } from "../services/leaveRequestApi";
import { useToastContext } from "@components/ToastProvider";
import { LeaveRequest } from "../schemas/leaveRequestSchema";

export function useDeleteLeaveRequest(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [leaveRequestToDelete, setLeaveRequestToDelete] =
    useState<LeaveRequest | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  /**
   * Set the leaveRequest that needs to be deleted
   */
  const requestDelete = (leaveRequest: LeaveRequest) => {
    setLeaveRequestToDelete(leaveRequest);
  };

  /**
   * Cancel the delete operation
   */
  const cancelDelete = () => {
    if (!isDeleting) {
      setLeaveRequestToDelete(null);
    }
  };

  /**
   * Confirm and execute the delete API call
   */
  const confirmDelete = async () => {
    if (!leaveRequestToDelete) return;

    try {
      setIsDeleting(true);

      await deleteLeaveRequest(leaveRequestToDelete.id);
      showToast("success", "Berhasil", "Departemen berhasil dihapus");

      setLeaveRequestToDelete(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("deleteLeaveRequest error:", err);
      showToast("error", "Gagal", err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    leaveRequestToDelete,
    isDeleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
