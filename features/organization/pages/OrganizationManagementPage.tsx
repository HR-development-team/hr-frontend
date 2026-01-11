"use client";

import { Network } from "lucide-react";
import { usePageOrganization } from "../hooks/usePageOrganization";
import OrganizationNode from "../components/OrganizationNode";

export default function OrganizationManagementPage() {
  const {
    offices,
    hierarchyStructured,
    selectedOffice,
    isLoading,
    handleOfficeClick,
    handleBackToOffice,
  } = usePageOrganization();

  return (
    <div className="flex flex-column h-full overflow-hidden mt-4">
      {/* Title Section */}
      <div className="flex-none mb-4 flex align-items-center gap-3">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <Network className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 m-0">
            Struktur Organisasi
          </h1>
          <p className="text-sm md:text-base text-gray-500 m-0">
            Kelola struktur departemen dan hierarki perusahaan
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex-1 overflow-hidden min-h-0">
        <OrganizationNode
          offices={offices}
          hierarychyStructured={hierarchyStructured}
          selectedOffice={selectedOffice}
          isLoading={isLoading}
          onOfficeClick={handleOfficeClick}
          onBack={handleBackToOffice}
        />
      </div>
    </div>
  );
}
