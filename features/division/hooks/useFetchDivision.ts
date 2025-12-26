/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Division, DivisionDetail } from "../schemas/divisionSchema";
import { getAllDivisions, getDivisionById } from "../services/divisionApi";
import { useToastContext } from "@components/ToastProvider";
import { getOfficeList } from "@features/office/services/officeApi";
import { getDepartmentList } from "@features/department/services/departmentApi";

export function useFetchDivision() {
  const { showToast } = useToastContext();

  // Data States
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [division, setDivision] = useState<DivisionDetail | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Option States
  const [officeOptions, setOfficeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [departmentOptions, setDepartmentOptions] = useState<
    { label: string; value: string }[]
  >([]);

  // Loading States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOptionsLoading, setIsOptionsLoading] = useState<boolean>(false);

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

  const fetchDepartmentOptions = useCallback(async (office_code?: string) => {
    try {
      setIsOptionsLoading(true);
      const data = await getDepartmentList(office_code);

      if (data) {
        const formatted = data.map((item: any) => ({
          label: item.name,
          value: item.department_code,
          office_code: item.office_code,
        }));
        setDepartmentOptions(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch department options", err);
      setDepartmentOptions([]);
    } finally {
      setIsOptionsLoading(false);
    }
  }, []);

  const clearDivision = useCallback(() => setDivision(null), []);

  const clearDepartmentOptions = useCallback(() => {
    setDepartmentOptions([]);
  }, []);

  return {
    divisions,
    division,
    officeOptions,
    departmentOptions,
    clearDepartmentOptions,
    totalRecords,
    isLoading,
    isOptionsLoading,
    fetchDivisions,
    fetchDivisionById,
    fetchOfficeOptions,
    fetchDepartmentOptions,
    clearDivision,
  };
}
