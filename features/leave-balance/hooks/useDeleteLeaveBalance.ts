/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  deleteLeaveBalance,
  deleteBulkLeaveBalance,
} from "../services/leaveBalanceApi";
import { useToastContext } from "@components/ToastProvider";
import { LeaveBalance } from "../schemas/leaveBalanceSchema";

export function useDeleteLeaveBalance(onSuccess?: () => void) {
  const { showToast } = useToastContext();

  // State for Single Item Deletion (Row Action)
  const [leaveBalanceToDelete, setLeaveBalanceToDelete] =
    useState<LeaveBalance | null>(null);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // =========================================================================
  // 1. Single Item Delete Logic (Row Action)
  // =========================================================================

  const requestDelete = (item: LeaveBalance) => {
    setLeaveBalanceToDelete(item);
  };

  const cancelDelete = () => {
    if (!isDeleting) {
      setLeaveBalanceToDelete(null);
    }
  };

  const confirmDelete = async () => {
    if (!leaveBalanceToDelete) return;

    try {
      setIsDeleting(true);
      await deleteLeaveBalance(leaveBalanceToDelete.id);

      showToast("success", "Berhasil", "Saldo cuti berhasil dihapus");
      setLeaveBalanceToDelete(null);

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("deleteLeaveBalance error:", err);
      showToast("error", "Gagal", err.message || "Gagal menghapus saldo cuti");
    } finally {
      setIsDeleting(false);
    }
  };

  // =========================================================================
  // 2. Bulk Delete Logic (Form Action)
  // =========================================================================

  /**
   * Executes a bulk delete based on year and type code.
   * This is usually called when the user submits the "Bulk Delete" form.
   */
  const executeBulkDelete = async (year: number, type_code: string) => {
    try {
      setIsDeleting(true);
      await deleteBulkLeaveBalance(year, type_code);

      showToast("success", "Berhasil", "Saldo cuti massal berhasil dihapus");

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("bulkDelete error:", err);
      showToast(
        "error",
        "Gagal",
        err.message || "Gagal menghapus saldo cuti massal"
      );
      // Re-throw to let the form know it failed (so it doesn't close)
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    // State
    leaveBalanceToDelete,
    isDeleting,

    // Single Delete Actions
    requestDelete,
    cancelDelete,
    confirmDelete,

    // Bulk Delete Action
    executeBulkDelete,
  };
}
