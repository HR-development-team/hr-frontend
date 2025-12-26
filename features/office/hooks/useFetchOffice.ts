/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Office, OfficeDetail } from "../schemas/officeSchema";
import {
  getAllOffices,
  getOfficeById,
  getOfficeList,
} from "../services/officeApi";
import { useToastContext } from "@components/ToastProvider";

export function useFetchOffice() {
  const { showToast } = useToastContext();
  const [offices, setOffices] = useState<Office[]>([]);
  const [office, setOffice] = useState<OfficeDetail | null>(null);
  const [officeOptions, setOfficeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchOffices = useCallback(
    async (params: any = {}, showToastMessage: boolean = false) => {
      try {
        setIsLoading(true);
        const response = await getAllOffices(params);
        setOffices(response.master_offices);
        setTotalRecords(response.meta.total);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data kantor berhasil dimuat");
        }
      } catch (err: any) {
        showToast("error", "Gagal", err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const fetchOfficeOptions = useCallback(async () => {
    try {
      const data = await getOfficeList();

      if (data) {
        const formattedOptions = data.map((item: any) => ({
          label: item.name,
          value: item.office_code,
        }));

        setOfficeOptions(formattedOptions);
      }
    } catch (err) {
      console.error("Failed to fetch office options", err);
    }
  }, []);

  const fetchOfficeById = useCallback(async (id: number) => {
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

  const clearOffice = useCallback(() => setOffice(null), []);

  return {
    offices,
    office,
    officeOptions,
    totalRecords,
    isLoading,
    fetchOffices,
    fetchOfficeById,
    fetchOfficeOptions,
    clearOffice,
  };
}
