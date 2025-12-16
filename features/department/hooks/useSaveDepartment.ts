/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { DepartmentFormData } from "../schemas/departmentSchema";
import { createDepartment, updateDepartment } from "../services/departmentApi";
import { useToastContext } from "@components/ToastProvider";

export function useSaveDepartment(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (values: DepartmentFormData, id?: number) => {
    try {
      setIsSaving(true);

      if (id) {
        // --- EDIT MODE ---
        await updateDepartment(id, values);
        showToast("success", "Berhasil", "Data departemen berhasil diperbarui");
      } else {
        // --- ADD MODE ---
        await createDepartment(values);
        showToast(
          "success",
          "Berhasil",
          "Departemen baru berhasil ditambahkan"
        );
      }

      // Trigger the UI callback (close dialog, refresh table)
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("saveDepartment error:", err);
      showToast(
        "error",
        "Gagal",
        err.message || "Terjadi kesalahan saat menyimpan data departemen"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveDepartment: handleSave,
    isSaving,
  };
}
