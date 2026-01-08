/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { useToastContext } from "@components/ToastProvider";
import { getOfficeList } from "@features/office/services/officeApi";
import {
  Attendance,
  AttendanceDetail,
  AttendanceParams,
} from "../schemas/attendanceSchema";
import {
  fetchAttendances,
  fetchAttendanceById,
} from "../services/attendanceApi";

export function useFetchAttendance() {
  const { showToast } = useToastContext();

  // Data states
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [attendance, setAttendance] = useState<AttendanceDetail | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Option States
  const [officeOptions, setOfficeOptions] = useState<
    { label: string; value: string }[]
  >([]);

  // Loading States
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Fetch Main Table Data
  const fetchAttendancesData = useCallback(
    async (
      params: AttendanceParams = {},
      showToastMessage: boolean = false
    ) => {
      try {
        setIsLoading(true);
        const response = await fetchAttendances(params);

        setAttendances(response.attendances);
        setTotalRecords(response.meta.total);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data Absensi berhasil dimuat");
        }
      } catch (err: any) {
        // Handle Axios errors or generic errors
        const message =
          err.response?.data?.message || err.message || "Gagal memuat data";
        showToast("error", "Gagal", message);
        setAttendances([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  // 2. Fetch Single Detail
  const fetchAttendanceDetail = useCallback(
    async (id: number) => {
      try {
        setIsLoading(true);
        const response = await fetchAttendanceById(id);
        // Note: Based on your API structure, detail is inside 'master_employees'
        setAttendance(response.master_employees);
      } catch (err: any) {
        console.error("Error fetching attendance details:", err);
        const message =
          err.response?.data?.message || "Gagal memuat detail absensi";
        showToast("error", "Gagal", message);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  // 3. Fetch Office Dropdown Options (For Filtering)
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

  // 4. Clear States
  const clearAttendance = useCallback(() => setAttendance(null), []);

  return {
    // States
    attendances,
    attendance,
    officeOptions,
    totalRecords,
    isLoading,

    // Actions
    fetchAttendancesData,
    fetchAttendanceDetail,
    fetchOfficeOptions,

    // Resetters
    clearAttendance,
  };
}
