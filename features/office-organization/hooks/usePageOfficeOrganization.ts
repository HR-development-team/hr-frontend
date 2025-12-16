"use client";

import { useCallback, useEffect } from "react";
import { useFetchOfficeOrganization } from "./useFetchOfficeOrganization";

export function usePageOfficeOrganization() {
  const { offices, positions, fetchOffices, isLoading } =
    useFetchOfficeOrganization();

  const refreshData = useCallback(
    (showToast: boolean = false) => {
      fetchOffices(showToast);
    },
    [fetchOffices]
  );

  // Initial Data Load
  useEffect(() => {
    refreshData(true);
  }, [refreshData]);

  return {
    offices,
    positions,
    isLoading,
  };
}
