/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { PositionFormData } from "../schemas/positionSchema";
import {
  createPosition,
  updatePosition,
  createHeadOffice,
  createHeadDepartment,
  createHeadDivision,
} from "../services/positionApi";
import { useToastContext } from "@components/ToastProvider";
import { PositionType } from "../hooks/useDialogPosition";

export function useSavePosition(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (
    values: PositionFormData,
    id?: number,
    positionType: PositionType = "regular" // Default to regular for safety
  ) => {
    try {
      setIsSaving(true);

      if (id) {
        // Update Logic (Usually generic based on ID)
        await updatePosition(id, values);
        showToast("success", "Berhasil", "Data jabatan berhasil diperbarui");
      } else {
        // Create Logic - Route based on Position Type
        switch (positionType) {
          case "head_office":
            await createHeadOffice(values);
            break;
          case "head_department":
            await createHeadDepartment(values);
            break;
          case "head_division":
            await createHeadDivision(values);
            break;
          case "regular":
          default:
            await createPosition(values);
            break;
        }
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
