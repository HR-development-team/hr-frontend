/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Position, PositionDetail } from "../schemas/positionSchema";
import {
  getAllPositions,
  getPositionById,
  getPositionList,
} from "../services/positionApi";
import { useToastContext } from "@components/ToastProvider";
import { getOfficeList } from "@features/office/services/officeApi";
import { getDepartmentList } from "@features/department/services/departmentApi";
import { getDivisionList } from "@features/division/services/divisionApi";

export function useFetchPosition() {
  const { showToast } = useToastContext();

  // Data states
  const [positions, setPositions] = useState<Position[]>([]);
  const [position, setPosition] = useState<PositionDetail | null>(null);
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

  // Loading States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOptionsDepartmentLoading, setIsOptionsDepartmentLoading] =
    useState<boolean>(false);
  const [isOptionsDivisionLoading, setIsOptionsDivisionLoading] =
    useState<boolean>(false);
  const [isOptionsPositionLoading, setIsOptionsPositionLoading] =
    useState<boolean>(false);

  const fetchPositions = useCallback(
    async (params: any = {}, showToastMessage: boolean = false) => {
      try {
        setIsLoading(true);
        const response = await getAllPositions(params);
        setPositions(response.master_positions);
        setTotalRecords(response.meta.total);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data Jabatan berhasil dimuat");
        }
      } catch (err: any) {
        showToast("error", "Gagal", err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const fetchPositionById = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      const data = await getPositionById(id);
      setPosition(data);
    } catch (err) {
      console.error("Error fetching position details:", err);
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
      console.log("office code:", office_code);
      console.log("department code:", department_code);
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

  const clearPosition = useCallback(() => setPosition(null), []);
  const clearDepartmentOptions = useCallback(() => {
    setDepartmentOptions([]);
  }, []);
  const clearDivisionOptions = useCallback(() => {
    setDivisionOptions([]);
  }, []);
  const clearPositionOptions = useCallback(() => {
    setPositionOptions([]);
  }, []);

  return {
    positions,
    position,
    officeOptions,
    departmentOptions,
    divisionOptions,
    positionOptions,
    totalRecords,

    isLoading,
    isOptionsDepartmentLoading,
    isOptionsDivisionLoading,
    isOptionsPositionLoading,

    fetchPositions,
    fetchPositionById,
    fetchOfficeOptions,
    fetchDepartmentOptions,
    fetchDivisionOptions,
    fetchPositionOptions,

    clearPosition,
    clearDepartmentOptions,
    clearDivisionOptions,
    clearPositionOptions,
  };
}
