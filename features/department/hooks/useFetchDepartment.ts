/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Department, DepartmentDetail } from "../schemas/departmentSchema";
import {
  getAllDepartments,
  getDepartmentById,
} from "../services/departmentApi";
import { useToastContext } from "@components/ToastProvider";

export function useFetchDepartment() {
  const { showToast } = useToastContext();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [department, setDepartment] = useState<DepartmentDetail | null>(null);
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

  const clearDepartment = useCallback(() => setDepartment(null), []);

  return {
    departments,
    department,
    totalRecords,
    isLoading,
    fetchDepartments,
    fetchDepartmentById,
    clearDepartment,
  };
}
