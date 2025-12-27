/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Employee, EmployeeDetail } from "../schemas/employeeSchema";
import { getAllEmployees, getEmployeeById } from "../services/employeeApi";
import { useToastContext } from "@components/ToastProvider";
import { formatDateIDN } from "@/utils/dateFormat";
import { getOfficeList } from "@features/office/services/officeApi";
import { getDepartmentList } from "@features/department/services/departmentApi";
import { getDivisionList } from "@features/division/services/divisionApi";
import { getPositionList } from "@features/position/services/positionApi";
import { getUserList } from "@features/user/services/userApi";
import { getEmployementList } from "@features/employment/services/employmentApi";

export function useFetchEmployee() {
  const { showToast } = useToastContext();

  // Data States
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Option States
  const [officeOptions, setOfficeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [departmentOptions, setDepartmentOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [divisionOptions, setDivisionOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [positionOptions, setPositionOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [userOptions, setUserOptions] = useState<
    { label: string; value: string; tag: string }[]
  >([]);
  const [employementOptions, setEmployementOptions] = useState<
    { label: string; value: string }[]
  >([]);

  // Loading States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOptionsDepartmentLoading, setIsOptionsDepartmentLoading] =
    useState<boolean>(false);
  const [isOptionsDivisionLoading, setIsOptionsDivisionLoading] =
    useState<boolean>(false);
  const [isOptionsPositionLoading, setIsOptionsPositionLoading] =
    useState<boolean>(false);
  const [isOptionsUserLoading, setIsOptionsUserLoading] =
    useState<boolean>(false);
  const [isOptionsEmployementLoading, setIsOptionsEmployementLoading] =
    useState<boolean>(false);

  const fetchEmployees = useCallback(
    async (params: any = {}, showToastMessage: boolean = false) => {
      try {
        setIsLoading(true);
        const response = await getAllEmployees(params);
        const values = response.master_employees.map((employee: Employee) => {
          return {
            ...employee,
            join_date: formatDateIDN(employee.join_date),
          };
        });
        setEmployees(values);
        setTotalRecords(response.meta.total);

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

  const fetchEmployeeById = useCallback(async (id: number) => {
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
      setIsOptionsDepartmentLoading(true);
      const data = await getDepartmentList(office_code);

      if (data) {
        const formatted = data.map((item: any) => ({
          label: item.name,
          value: item.department_code,
        }));
        setDepartmentOptions(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch department options", err);
      setDepartmentOptions([]);
    } finally {
      setIsOptionsDepartmentLoading(false);
    }
  }, []);

  const fetchDivisionOptions = useCallback(
    async (office_code?: string, department_code?: string) => {
      try {
        setIsOptionsDivisionLoading(true);
        const data = await getDivisionList(office_code, department_code);

        if (data) {
          const formatted = data.map((item: any) => ({
            label: item.name,
            value: item.division_code,
          }));
          setDivisionOptions(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch department options", err);
        setDivisionOptions([]);
      } finally {
        setIsOptionsDivisionLoading(false);
      }
    },
    []
  );

  const fetchPositionOptions = useCallback(
    async (
      office_code?: string,
      department_code?: string,
      division_code?: string
    ) => {
      try {
        setIsOptionsPositionLoading(true);
        const data = await getPositionList(
          office_code,
          department_code,
          division_code
        );

        if (data) {
          const formatted = data.map((item: any) => ({
            label: item.name,
            value: item.position_code,
          }));
          setPositionOptions(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch position options", err);
        setPositionOptions([]);
      } finally {
        setIsOptionsPositionLoading(false);
      }
    },
    []
  );

  const fetchUserOptions = useCallback(async (role_code?: string) => {
    try {
      setIsOptionsUserLoading(true);
      const data = await getUserList(role_code);

      if (data) {
        const formatted = data.map((item: any) => ({
          label: item.email,
          value: item.user_code,
          tag: item.role_name,
        }));
        setUserOptions(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch user options", err);
      setUserOptions([]);
    } finally {
      setIsOptionsUserLoading(false);
    }
  }, []);

  const fetchEmployementOptions = useCallback(async () => {
    try {
      setIsOptionsEmployementLoading(true);
      const data = await getEmployementList();
      console.log("employment status data: ", data);

      if (data) {
        const formatted = data.map((item: any) => ({
          label: item.name,
          value: item.status_code,
        }));
        setEmployementOptions(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch employement options", err);
      setEmployementOptions([]);
    } finally {
      setIsOptionsEmployementLoading(false);
    }
  }, []);

  const clearEmployee = useCallback(() => setEmployee(null), []);
  const clearDepartmentOptions = useCallback(() => {
    setDepartmentOptions([]);
  }, []);
  const clearDivisionOptions = useCallback(() => {
    setDivisionOptions([]);
  }, []);
  const clearPositionOptions = useCallback(() => {
    setPositionOptions([]);
  }, []);
  const clearUserOptions = useCallback(() => {
    setUserOptions([]);
  }, []);
  const clearEmployementOptions = useCallback(() => {
    setEmployementOptions([]);
  }, []);

  return {
    employees,
    employee,
    officeOptions,
    departmentOptions,
    divisionOptions,
    positionOptions,
    userOptions,
    employementOptions,
    totalRecords,

    isLoading,
    isOptionsDepartmentLoading,
    isOptionsDivisionLoading,
    isOptionsPositionLoading,
    isOptionsUserLoading,
    isOptionsEmployementLoading,

    fetchEmployees,
    fetchEmployeeById,
    fetchOfficeOptions,
    fetchDepartmentOptions,
    fetchDivisionOptions,
    fetchPositionOptions,
    fetchUserOptions,
    fetchEmployementOptions,

    clearEmployee,
    clearDepartmentOptions,
    clearDivisionOptions,
    clearPositionOptions,
    clearUserOptions,
    clearEmployementOptions,
  };
}
