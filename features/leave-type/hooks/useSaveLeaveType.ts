/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { LeaveTypeFormData } from "../schemas/leaveTypeSchema";
import { createLeaveType, updateLeaveType } from "../services/leaveTypeApi";
import { useToastContext } from "@components/ToastProvider";

export function useSaveLeaveType(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (values: LeaveTypeFormData, id?: number) => {
    try {
      setIsSaving(true);

      if (id) {
        await updateLeaveType(id, values);
        showToast("success", "Berhasil", "Tipe cuti berhasil diperbarui");
      } else {
        await createLeaveType(values);
        showToast("success", "Berhasil", "Tipe cuti baru berhasil ditambahkan");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("saveLeaveType error:", err);
      showToast(
        "error",
        "Gagal",
        err.message || "Terjadi kesalahan saat menyimpan data tipe cuti"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveLeaveType: handleSave,
    isSaving,
  };
}
