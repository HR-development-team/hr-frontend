"use client";

import { Network } from "lucide-react";
import { usePageOrganization } from "../hooks/usePageOrganization";
import OrganizationNode from "../components/OrganizationNode";

export default function OrganizationManagementPage() {
  const {
    // Data
    offices,
    positionHierarchy,
    selectedOffice,
    isLoading,

    // Handlers
    handleOfficeClick,
    handleBackToOffice,
  } = usePageOrganization();

  return (
    <div>
      {/* Title Section */}
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <Network className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Struktur Organisasi
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola struktur departemen dan hierarki perusahaan
          </p>
        </div>
      </div>

      <OrganizationNode
        offices={offices}
        positionHierarchy={positionHierarchy}
        selectedOffice={selectedOffice}
        isLoading={isLoading}
        onOfficeClick={handleOfficeClick}
        onBack={handleBackToOffice}
      />
    </div>
  );
}
