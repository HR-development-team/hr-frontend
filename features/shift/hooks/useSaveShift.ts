/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ShiftFormData } from "../schemas/shiftSchema";
import { createShift, updateShift } from "../services/shiftApi";
import { useToastContext } from "@components/ToastProvider";

export function useSaveShift(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (values: ShiftFormData, id?: number) => {
    try {
      setIsSaving(true);

      if (id) {
        await updateShift(id, values);
        showToast("success", "Berhasil", "Data shift berhasil diperbarui");
      } else {
        await createShift(values);
        showToast("success", "Berhasil", "Shift baru berhasil ditambahkan");
      }

      onSuccess?.();
    } catch (err: any) {
      console.error("saveShift error:", err);
      const errorData = err.response?.data;
      const validationErrors = errorData?.errors;

      let displayMessage = "Terjadi kesalahan saat menyimpan data shift";
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        displayMessage = validationErrors.map((e: any) => e.message).join(", ");
      } else if (errorData?.message) {
        displayMessage = errorData.message;
      }

      showToast("error", "Gagal", displayMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveShift: handleSave,
    isSaving,
  };
}
