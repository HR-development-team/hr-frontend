/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import { Employement } from "../schemas/employmentSchema";
import { getAllEmploymentStatus } from "../services/employmentApi";
import { useToastContext } from "@components/ToastProvider";

export function useFetchEmployment() {
  const { showToast } = useToastContext();
  const [employmentStatus, setEmploymentStatus] = useState<Employement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchEmploymentStatus = useCallback(
    async (showToastMessage: boolean = false) => {
      try {
        setIsLoading(true);
        const data = await getAllEmploymentStatus();
        setEmploymentStatus(data);

        if (showToastMessage) {
          showToast(
            "success",
            "Berhasil",
            "Data status karyawan berhasil dimuat"
          );
        }
      } catch (err: any) {
        if (showToastMessage) {
          showToast("error", "Gagal", err.message);
        }
        setEmploymentStatus([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  return {
    employmentStatus,
    fetchEmploymentStatus,
    isLoading,
  };
}
