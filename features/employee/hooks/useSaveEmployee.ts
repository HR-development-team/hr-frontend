/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { EmployeeFormData } from "../schemas/employeeSchema";
import { createEmployee, updateEmployee } from "../services/employeeApi";
import { useToastContext } from "@components/ToastProvider";

export function useSaveEmployee(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (values: EmployeeFormData, id?: number) => {
    try {
      setIsSaving(true);

      // Note: Date formatting logic (ISO vs YYYY-MM-DD) is often better handled
      // in the API service wrapper or here if the backend is very strict.
      // We are passing the object as is, assuming JSON.stringify in the service
      // handles the Date -> ISO String conversion.

      if (id) {
        await updateEmployee(id, values);
        showToast("success", "Berhasil", "Data karyawan berhasil diperbarui");
      } else {
        await createEmployee(values);
        showToast("success", "Berhasil", "Karyawan baru berhasil ditambahkan");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("saveEmployee error:", err);
      showToast(
        "error",
        "Gagal",
        err.message || "Terjadi kesalahan saat menyimpan data karyawan"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveEmployee: handleSave,
    isSaving,
  };
}
