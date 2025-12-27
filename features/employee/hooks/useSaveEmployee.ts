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
      console.log(err);
      let title = "Gagal";
      let detail = "Terjadi kesalahan saat menyimpan data.";

      // 1. Check for your specific 'errors' array structure
      if (err?.errors && Array.isArray(err.errors)) {
        title = err.message || "Validasi Gagal";

        // Map through the array: [{field: "...", message: "..."}]
        detail = err.errors.map((e: any) => e.message).join(", ");
      }
      // 2. Fallback to top-level message (e.g. from the API generic 500)
      else if (err?.message) {
        detail = err.message;
      }
      // 3. Fallback to standard JS error (Network errors, etc.)
      else if (err.message) {
        detail = err.message;
      }

      showToast("error", title, detail);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveEmployee: handleSave,
    isSaving,
  };
}
