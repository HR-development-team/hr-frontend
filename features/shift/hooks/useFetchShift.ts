/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Shift, ShiftDetail } from "../schemas/shiftSchema";
import { getAllShifts, getShiftById, getShiftList } from "../services/shiftApi";
import { useToastContext } from "@components/ToastProvider";
import { getOfficeList } from "@features/office/services/officeApi";

export function useFetchShift() {
  const { showToast } = useToastContext();

  // Data states
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shift, setShift] = useState<ShiftDetail | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Option States
  const [officeOptions, setOfficeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [shiftOptions, setShiftOptions] = useState<
    { label: string; value: string }[]
  >([]);

  // Loading States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOptionsShiftLoading, setIsOptionsShiftLoading] =
    useState<boolean>(false);

  // 1. Fetch Main Table Data
  const fetchShifts = useCallback(
    async (params: any = {}, showToastMessage: boolean = false) => {
      try {
        setIsLoading(true);
        const response = await getAllShifts(params);
        setShifts(response.master_shifts);
        setTotalRecords(response.meta.total);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data Shift berhasil dimuat");
        }
      } catch (err: any) {
        showToast("error", "Gagal", err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  // 2. Fetch Single Detail
  const fetchShiftById = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      const data = await getShiftById(id);
      setShift(data);
    } catch (err) {
      console.error("Error fetching shift details:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. Fetch Office Dropdown Options
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

  // 4. Fetch Shift Dropdown Options
  const fetchShiftOptions = useCallback(async (office_code?: string) => {
    try {
      setIsOptionsShiftLoading(true);
      const data = await getShiftList(office_code);

      if (data) {
        const formatted = data.map((item: any) => ({
          label: item.name,
          value: item.shift_code,
        }));
        setShiftOptions(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch shift options", err);
      setShiftOptions([]);
    } finally {
      setIsOptionsShiftLoading(false);
    }
  }, []);

  // 5. Clear States
  const clearShift = useCallback(() => setShift(null), []);
  const clearShiftOptions = useCallback(() => {
    setShiftOptions([]);
  }, []);

  return {
    shifts,
    shift,
    officeOptions,
    shiftOptions,
    totalRecords,

    isLoading,
    isOptionsShiftLoading,

    fetchShifts,
    fetchShiftById,
    fetchOfficeOptions,
    fetchShiftOptions,

    clearShift,
    clearShiftOptions,
  };
}
