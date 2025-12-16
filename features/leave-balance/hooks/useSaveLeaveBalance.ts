/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  LeaveBalanceFormData,
  LeaveBalanceFormMode,
} from "../schemas/leaveBalanceSchema";
import {
  createLeaveBalance,
  createBulkLeaveBalance,
  updateLeaveBalance,
} from "../services/leaveBalanceApi";
import { useToastContext } from "@components/ToastProvider";

export function useSaveLeaveBalance(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  /**
   * Handles creating or updating leave balances based on the mode.
   */
  const handleSave = async (
    mode: LeaveBalanceFormMode,
    values: LeaveBalanceFormData,
    id?: number
  ) => {
    // Safety check: Delete operations should use the useDeleteLeaveBalance hook
    if (mode === "bulkDelete" || mode === null) return;

    try {
      setIsSaving(true);

      if (mode === "edit") {
        if (!id) throw new Error("ID diperlukan untuk edit data");

        await updateLeaveBalance(id, values);
        showToast("success", "Berhasil", "Saldo cuti berhasil diperbarui");
      } else if (mode === "bulkAdd") {
        await createBulkLeaveBalance(values);
        showToast(
          "success",
          "Berhasil",
          "Saldo cuti massal berhasil ditambahkan ke semua karyawan aktif"
        );
      } else if (mode === "singleAdd") {
        await createLeaveBalance(values);
        showToast("success", "Berhasil", "Saldo cuti berhasil ditambahkan");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("saveLeaveBalance error:", err);
      showToast(
        "error",
        "Gagal",
        err.message || "Terjadi kesalahan saat menyimpan data saldo cuti"
      );
      // Re-throw error so the form component knows the operation failed (e.g., to stop it from closing)
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveLeaveBalance: handleSave,
    isSaving,
  };
}
