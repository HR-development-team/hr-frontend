/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { OfficeStructure, SafeTreeNode } from "../schemas/organizationSchema";
import {
  getAllOfficeOrganizations,
  getOfficeHierarchyByOfficeCode,
} from "../services/organizationApi";
import { useToastContext } from "@components/ToastProvider";

export function useFetchOfficeOrganization() {
  const { showToast } = useToastContext();
  const [offices, setOffices] = useState<SafeTreeNode[]>([]);
  const [hierarchyStructured, setHierarchyStructured] = useState<
    SafeTreeNode[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOffice, setSelectedOffice] = useState<OfficeStructure | null>(
    null
  );

  /**
   * Fetch all office organizations
   */
  const fetchOffices = useCallback(
    async (showToastMessage: boolean = false) => {
      try {
        setIsLoading(true);
        const data = await getAllOfficeOrganizations();
        setOffices(data);
        setSelectedOffice(null);
        setHierarchyStructured([]);

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

  /**
   * 2. Handle Click on Office Card -> Fetch Hierarchy (Level 2)
   */
  const handleOfficeClick = async (office: OfficeStructure) => {
    try {
      setIsLoading(true);
      setSelectedOffice(office); // Set Active Office

      const data = await getOfficeHierarchyByOfficeCode(office.office_code);
      setHierarchyStructured(data);
      // setPositionHierarchy(data);
    } catch (err: any) {
      showToast("error", "Gagal Memuat Struktur", err.message);
      setSelectedOffice(null); // Revert if failed
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 3. Back Button Handler
   */
  const handleBackToOffice = () => {
    setSelectedOffice(null);
    setHierarchyStructured([]);
    // setPositionHierarchy([]);
  };

  return {
    offices,
    isLoading,
    fetchOffices,

    // New Exports
    selectedOffice,
    // positionHierarchy,
    hierarchyStructured,
    handleOfficeClick,
    handleBackToOffice,
  };
}
