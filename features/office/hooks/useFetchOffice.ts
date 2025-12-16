/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Office, OfficeDetail } from "../schemas/officeSchema";
import { getAllOffices, getOfficeById } from "../services/officeApi";
import { useToastContext } from "@components/ToastProvider";

export function useFetchOffice() {
  const { showToast } = useToastContext();
  const [offices, setOffices] = useState<Office[]>([]);
  const [office, setOffice] = useState<OfficeDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Fetch all offices
   */
  const fetchOffices = useCallback(
    async (
      showToastMessage: boolean = false,
      params?: {
        search?: string;
      }
    ) => {
      try {
        setIsLoading(true);
        const data = await getAllOffices();
        console.log("Fetched offices:", data);
        setOffices(data);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data kantor berhasil dimuat");
        }
      } catch (err: any) {
        if (showToastMessage) {
          showToast("error", "Gagal", err.message);
        }
        setOffices([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  /**
   * Fetch a single office detail by ID
   */
  const fetchOfficeByIdHandler = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      const data = await getOfficeById(id);
      setOffice(data);
    } catch (err) {
      console.error("Error fetching office details:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset selected office
   */
  const clearOffice = useCallback(() => setOffice(null), []);

  return {
    offices,
    office,
    isLoading,
    fetchOffices,
    fetchOfficeById: fetchOfficeByIdHandler,
    clearOffice,
  };
}
