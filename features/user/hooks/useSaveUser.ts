/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { UserFormData } from "../schemas/userSchema";
import { createUser, updateUser } from "../services/userApi";
import { useToastContext } from "@/components/ToastProvider";

export function useSaveUser(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (values: UserFormData, id?: number) => {
    try {
      setIsSaving(true);

      if (id) {
        // --- EDIT MODE ---
        await updateUser(id, values);
        showToast("success", "Berhasil", "User berhasil diperbarui");
      } else {
        // --- ADD MODE ---
        await createUser(values);
        showToast("success", "Berhasil", "User berhasil ditambahkan");
      }

      // Trigger the UI callback (close dialog, refresh table)
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("saveUser error:", err);
      showToast(
        "error",
        "Gagal",
        err.message || "Terjadi kesalahan saat menyimpan user"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveUser: handleSave,
    isSaving,
  };
}
