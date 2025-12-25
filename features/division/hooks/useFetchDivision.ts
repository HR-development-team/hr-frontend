/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Division, DivisionDetail } from "../schemas/divisionSchema";
import { getAllDivisions, getDivisionById } from "../services/divisionApi";
import { useToastContext } from "@components/ToastProvider";

export function useFetchDivision() {
  const { showToast } = useToastContext();

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [division, setDivision] = useState<DivisionDetail | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchDivisions = useCallback(
    async (params: any = {}, showToastMessage: boolean = false) => {
      try {
        setIsLoading(true);
        const response = await getAllDivisions(params);

        // Handle response structure (meta + data)
        setDivisions(response.master_divisions || []);
        setTotalRecords(response.meta?.total || 0);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data divisi berhasil dimuat");
        }
      } catch (err: any) {
        showToast("error", "Gagal", err.message);
        setDivisions([]);
        setTotalRecords(0);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const fetchDivisionById = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      const data = await getDivisionById(id);
      setDivision(data);
    } catch (err) {
      console.error("Error fetching division details:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearDivision = useCallback(() => setDivision(null), []);

  return {
    divisions,
    division,
    totalRecords,
    isLoading,
    fetchDivisions,
    fetchDivisionById,
    clearDivision,
  };
}
