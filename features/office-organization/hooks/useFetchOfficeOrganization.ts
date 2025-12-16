/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import {
  OfficeStructure,
  PositionStructure,
} from "../schemas/officeOrganizationSchema";
import { getAllOfficeOrganizations } from "../services/officeOrganizationApi";
import { useToastContext } from "@components/ToastProvider";

export function useFetchOfficeOrganization() {
  const { showToast } = useToastContext();
  const [offices, setOffices] = useState<OfficeStructure[]>([]);
  const [positions, setPositions] = useState<PositionStructure[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Fetch all office organizations
   */
  const fetchOffices = useCallback(
    async (showToastMessage: boolean = false) => {
      try {
        setIsLoading(true);
        const data = await getAllOfficeOrganizations();
        setOffices(data);

        if (showToastMessage) {
          showToast(
            "success",
            "Berhasil",
            "Data organisasi kantor berhasil dimuat"
          );
        }
      } catch (err: any) {
        if (showToastMessage) {
          showToast("error", "Gagal", err.message);
        }
        setOffices([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  return {
    offices,
    positions,
    isLoading,
    fetchOffices,
  };
}
