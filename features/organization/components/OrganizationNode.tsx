/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { OrganizationChart } from "primereact/organizationchart";
import { Skeleton } from "primereact/skeleton";
import {
  OfficeStructure,
  PositionStructure,
  OfficeNodeData,
  PositionNodeData,
  SafeTreeNode, // Ensure this is imported
} from "../schemas/organizationSchema";
import OfficeNodeCard from "./OfficeNodeCard";
import PositionNodeCard from "./PositionNodeCard";

interface OrganizationNodeProps {
  offices: OfficeStructure[];
  positionHierarchy: PositionStructure[];
  selectedOffice: OfficeStructure | null;
  isLoading: boolean;
  onOfficeClick: (office: OfficeStructure) => void;
  onBack: () => void;
}

export default function OrganizationNode({
  offices,
  positionHierarchy,
  selectedOffice,
  isLoading,
  onOfficeClick,
  onBack,
}: OrganizationNodeProps) {
  // --- 1. Map Offices to TreeNodes (RECURSIVE FIX) ---
  const officeTree = useMemo(() => {
    // Recursive function to map offices and their children
    const mapOfficeNode = (node: OfficeStructure): SafeTreeNode => ({
      expanded: true,
      type: "office",
      data: {
        office_code: node.office_code,
        name: node.name,
        address: node.address,
        description: node.description,
        type: "office",
      } as OfficeNodeData,
      // FIX: Recursively map children if they exist
      children: node.children ? node.children.map(mapOfficeNode) : [],
    });

    return offices.map(mapOfficeNode);
  }, [offices]);

  // --- 2. Map Positions to TreeNodes (Recursive) ---
  const positionTree = useMemo(() => {
    const mapPositionNode = (node: PositionStructure): SafeTreeNode => ({
      expanded: true,
      type: "position",
      data: {
        position_code: node.position_code,
        name: node.name,
        employee_code: node.employee_code,
        employee_name: node.employee_name,
        type: "position",
        image: "",
      } as PositionNodeData,
      children: node.children ? node.children.map(mapPositionNode) : [],
    });

    return positionHierarchy.map(mapPositionNode);
  }, [positionHierarchy]);

  // --- 3. View Logic ---
  const viewMode = selectedOffice ? "position" : "office";
  const activeData = viewMode === "office" ? officeTree : positionTree;

  const currentTitle = selectedOffice
    ? `Struktur Jabatan: ${selectedOffice.name}`
    : "Struktur Wilayah Kantor";

  // --- 4. Node Template ---
  const nodeTemplate = (node: SafeTreeNode) => {
    if (!node.data) return null;

    if (node.type === "office") {
      // Find the full office object to pass back to the click handler
      // We need to search recursively or flatly.
      // Since 'offices' is nested, a simple .find() on top-level might fail for children.
      // But since we have the data in node.data, we can construct a partial object
      // OR better: use a recursive finder helper.

      const officeData = node.data as OfficeNodeData;

      return (
        <OfficeNodeCard
          data={officeData}
          onDetailClick={() => {
            // Reconstruct the structure needed for the handler
            // (Ideally, your handler just needs the ID/Code to fetch the next data)
            onOfficeClick({
              office_code: officeData.office_code,
              name: officeData.name,
              address: officeData.address || "",
              // We don't necessarily need children here for the next API call
              children: [],
            } as OfficeStructure);
          }}
        />
      );
    }

    if (node.type === "position") {
      return <PositionNodeCard data={node.data as PositionNodeData} />;
    }

    return null;
  };

  // --- 5. Loading ---
  if (isLoading) {
    return (
      <Card>
        <div className="flex flex-column gap-4 p-4">
          <div className="flex justify-content-between">
            <Skeleton width="200px" height="2rem" />
            <Skeleton width="100px" height="2rem" />
          </div>
          <div className="flex justify-content-center gap-4">
            <Skeleton width="250px" height="150px" borderRadius="12px" />
            <Skeleton width="250px" height="150px" borderRadius="12px" />
          </div>
        </div>
      </Card>
    );
  }

  // --- 6. Empty State ---
  if (!activeData || activeData.length === 0) {
    return (
      <Card className="h-full">
        <div
          className="flex flex-column justify-content-center align-items-center p-5 text-center"
          style={{ minHeight: "300px" }}
        >
          <i className="pi pi-sitemap text-5xl text-gray-300 mb-3"></i>
          <span className="text-gray-500 font-medium text-lg">
            {viewMode === "office"
              ? "Tidak ada data kantor."
              : "Tidak ada struktur posisi."}
          </span>
          {viewMode === "position" && (
            <Button
              label="Kembali"
              icon="pi pi-arrow-left"
              className="mt-3 gap-1"
              outlined
              onClick={onBack}
            />
          )}
        </div>
      </Card>
    );
  }

  // --- 7. Main Render ---
  return (
    <Card className="overflow-x-auto">
      <div className="flex justify-content-between align-items-center mb-5 px-2">
        <h2 className="text-xl font-bold m-0 text-gray-800">{currentTitle}</h2>
        {viewMode === "position" && (
          <Button
            label="Kembali ke Peta Kantor"
            className="gap-1"
            icon="pi pi-arrow-left"
            size="small"
            severity="secondary"
            outlined
            onClick={onBack}
          />
        )}
      </div>

      <div className="overflow-auto pb-4">
        <OrganizationChart
          value={activeData}
          nodeTemplate={nodeTemplate as any} // Cast to satisfy PrimeReact types if needed
          selectionMode="single"
          pt={{
            node: { className: "bg-transparent border-none p-3" },
            lineDown: { className: "bg-gray-300" },
            lineLeft: { className: "border-gray-300" },
            lineRight: { className: "border-gray-300" },
          }}
        />
      </div>
    </Card>
  );
}
