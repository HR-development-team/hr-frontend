/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { LeaveStatus } from "../schemas/leaveRequestSchema";
import { updateLeaveRequestStatus } from "../services/leaveRequestApi";
import { useToastContext } from "@components/ToastProvider";

export function useSaveLeaveRequest(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  /**
   * Updates the status of a specific leave request (Approve/Reject)
   */
  const updateStatus = async (id: number, status: LeaveStatus) => {
    try {
      setIsSaving(true);
      await updateLeaveRequestStatus(id, status);

      const actionText = status === "Approved" ? "disetujui" : "ditolak";
      showToast("success", "Sukses", `Permintaan cuti berhasil ${actionText}`);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("updateStatus error:", err);
      showToast(
        "error",
        "Gagal",
        err.message || "Gagal memperbarui status permintaan cuti"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    updateStatus,
    isSaving,
  };
}
