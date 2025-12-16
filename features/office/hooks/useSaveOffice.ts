/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { OfficeFormData } from "../schemas/officeSchema";
import { createOffice, updateOffice } from "../services/officeApi";
import { useToastContext } from "@components/ToastProvider";

export function useSaveOffice(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (values: OfficeFormData, id?: number) => {
    try {
      setIsSaving(true);

      if (id) {
        // --- EDIT MODE ---
        await updateOffice(id, values);
        showToast("success", "Berhasil", "Data kantor berhasil diperbarui");
      } else {
        // --- ADD MODE ---
        await createOffice(values);
        showToast("success", "Berhasil", "Kantor baru berhasil ditambahkan");
      }

      // Trigger the UI callback (close dialog, refresh table)
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("saveOffice error:", err);
      showToast(
        "error",
        "Gagal",
        err.message || "Terjadi kesalahan saat menyimpan data kantor"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveOffice: handleSave,
    isSaving,
  };
}
