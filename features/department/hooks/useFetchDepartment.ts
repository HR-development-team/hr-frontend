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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Fetch all departments
   */
  const fetchDepartments = useCallback(
    async (
      showToastMessage: boolean = false,
      params?: {
        search?: string;
      }
    ) => {
      try {
        setIsLoading(true);
        const data = await getAllDepartments();
        setDepartments(data);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data departemen berhasil dimuat");
        }
      } catch (err: any) {
        if (showToastMessage) {
          showToast("error", "Gagal", err.message);
        }
        setDepartments([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  /**
   * Fetch a single department detail by ID
   */
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

  /**
   * Reset selected department
   */
  const clearDepartment = useCallback(() => setDepartment(null), []);

  return {
    departments,
    department,
    isLoading,
    fetchDepartments,
    fetchDepartmentById,
    clearDepartment,
  };
}
