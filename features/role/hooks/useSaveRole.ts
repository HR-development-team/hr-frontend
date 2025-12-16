/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { RoleFormData } from "../schemas/roleSchema";
import { createRole, updateRole } from "../services/roleApi";
import { useToastContext } from "@components/ToastProvider";

export function useSaveRole(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (values: RoleFormData, id?: number) => {
    try {
      setIsSaving(true);

      if (id) {
        // --- EDIT MODE ---
        await updateRole(id, values);
        showToast("success", "Berhasil", "Role berhasil diperbarui");
      } else {
        // --- ADD MODE ---
        await createRole(values);
        showToast("success", "Berhasil", "Role berhasil ditambahkan");
      }

      // Trigger the UI callback (close dialog, refresh table)
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("saveRole error:", err);
      showToast(
        "error",
        "Gagal",
        err.message || "Terjadi kesalahan saat menyimpan"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveRole: handleSave,
    isSaving,
  };
}
