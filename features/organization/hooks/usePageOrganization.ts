"use client";

import { useCallback, useEffect } from "react";
import { useFetchOfficeOrganization } from "./useFetchOrganization";

export function usePageOrganization() {
  const {
    offices,
    fetchOffices,
    isLoading,

    // New props
    selectedOffice,
    hierarchyStructured,
    handleOfficeClick,
    handleBackToOffice,
  } = useFetchOfficeOrganization();

  const refreshData = useCallback(
    (showToast: boolean = false) => {
      fetchOffices(showToast);
    },
    [fetchOffices]
  );

  useEffect(() => {
    refreshData(false);
  }, [refreshData]);

  return {
    offices,
    isLoading,
    selectedOffice,
    hierarchyStructured,
    handleOfficeClick,
    handleBackToOffice,
  };
}
