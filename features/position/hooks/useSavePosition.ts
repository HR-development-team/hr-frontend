/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { PositionFormData } from "../schemas/positionSchema";
import { createPosition, updatePosition } from "../services/positionApi";
import { useToastContext } from "@components/ToastProvider";

export function useSavePosition(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (values: PositionFormData, id?: number) => {
    try {
      setIsSaving(true);

      if (id) {
        await updatePosition(id, values);
        showToast("success", "Berhasil", "Data jabatan berhasil diperbarui");
      } else {
        await createPosition(values);
        showToast("success", "Berhasil", "Jabatan baru berhasil ditambahkan");
      }

      onSuccess?.();
    } catch (err: any) {
      console.error("savePosition error:", err);
      showToast(
        "error",
        "Gagal",
        err.message || "Terjadi kesalahan saat menyimpan data jabatan"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    savePosition: handleSave,
    isSaving,
  };
}
