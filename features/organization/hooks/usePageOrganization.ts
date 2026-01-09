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
    // positionHierarchy,
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
    // Pass these to the component
    selectedOffice,
    // positionHierarchy,
    hierarchyStructured,
    handleOfficeClick,
    handleBackToOffice,
  };
}
