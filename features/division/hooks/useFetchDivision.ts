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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Fetch all divisions
   */
  const fetchDivisions = useCallback(
    async (
      showToastMessage: boolean = false,
      params?: {
        search?: string;
      }
    ) => {
      try {
        setIsLoading(true);
        const data = await getAllDivisions();
        setDivisions(data);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data divisi berhasil dimuat");
        }
      } catch (err: any) {
        if (showToastMessage) {
          showToast("error", "Gagal", err.message);
        }
        setDivisions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  /**
   * Fetch a single division detail by ID
   */
  const fetchDivisionByIdHandler = useCallback(async (id: number) => {
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

  /**
   * Reset selected division
   */
  const clearDivision = useCallback(() => setDivision(null), []);

  return {
    divisions,
    division,
    isLoading,
    fetchDivisions,
    fetchDivisionById: fetchDivisionByIdHandler,
    clearDivision,
  };
}
