/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { DivisionFormData } from "../schemas/divisionSchema";
import { createDivision, updateDivision } from "../services/divisionApi";
import { useToastContext } from "@components/ToastProvider";

export function useSaveDivision(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (values: DivisionFormData, id?: number) => {
    try {
      setIsSaving(true);

      if (id) {
        // --- EDIT MODE ---
        await updateDivision(id, values);
        showToast("success", "Berhasil", "Data divisi berhasil diperbarui");
      } else {
        // --- ADD MODE ---
        await createDivision(values);
        showToast("success", "Berhasil", "Divisi baru berhasil ditambahkan");
      }

      // Trigger the UI callback (close dialog, refresh table)
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("saveDivision error:", err);
      showToast(
        "error",
        "Gagal",
        err.message || "Terjadi kesalahan saat menyimpan data divisi"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveDivision: handleSave,
    isSaving,
  };
}
