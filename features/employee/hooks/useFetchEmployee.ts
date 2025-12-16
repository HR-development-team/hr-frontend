/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Employee, EmployeeDetail } from "../schemas/employeeSchema";
import { getAllEmployees, getEmployeeById } from "../services/employeeApi";
import { useToastContext } from "@components/ToastProvider";

export function useFetchEmployee() {
  const { showToast } = useToastContext();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchEmployees = useCallback(
    async (showToastMessage: boolean = false) => {
      try {
        setIsLoading(true);
        const data = await getAllEmployees();
        setEmployees(data);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data karyawan berhasil dimuat");
        }
      } catch (err: any) {
        if (showToastMessage) {
          showToast("error", "Gagal", err.message);
        }
        setEmployees([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const fetchEmployeeByIdHandler = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      const data = await getEmployeeById(id);
      setEmployee(data);
    } catch (err) {
      console.error("Error fetching employee details:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearEmployee = useCallback(() => setEmployee(null), []);

  return {
    employees,
    employee,
    isLoading,
    fetchEmployees,
    fetchEmployeeById: fetchEmployeeByIdHandler,
    clearEmployee,
  };
}
