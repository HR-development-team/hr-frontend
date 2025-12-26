/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Department, DepartmentDetail } from "../schemas/departmentSchema";
import {
  getAllDepartments,
  getDepartmentById,
} from "../services/departmentApi";
import { getOfficeList } from "@features/office/services/officeApi";
import { useToastContext } from "@components/ToastProvider";

export function useFetchDepartment() {
  const { showToast } = useToastContext();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [department, setDepartment] = useState<DepartmentDetail | null>(null);
  const [officeOptions, setOfficeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchDepartments = useCallback(
    async (params: any = {}, showToastMessage: boolean = false) => {
      try {
        setIsLoading(true);
        const response = await getAllDepartments(params);

        // Handle response structure (meta + data)
        setDepartments(response.master_departments || []);
        setTotalRecords(response.meta?.total || 0);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data departemen berhasil dimuat");
        }
      } catch (err: any) {
        showToast("error", "Gagal", err.message);
        setDepartments([]);
        setTotalRecords(0);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const fetchDepartmentById = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      const data = await getDepartmentById(id);
      setDepartment(data);
    } catch (err) {
      console.error("Error fetching department details:", err);
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

  const clearDepartment = useCallback(() => setDepartment(null), []);

  return {
    departments,
    department,
    officeOptions,
    totalRecords,
    isLoading,
    fetchDepartments,
    fetchDepartmentById,
    fetchOfficeOptions,
    clearDepartment,
  };
}
