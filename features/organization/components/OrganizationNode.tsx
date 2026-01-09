/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { OrganizationChart } from "primereact/organizationchart";
import { Skeleton } from "primereact/skeleton";
import {
  OfficeStructure,
  PositionStructure,
  OfficeNodeData,
  PositionNodeData,
  SafeTreeNode,
  HierarchyResponse, // Ensure this is imported
} from "../schemas/organizationSchema";
import OfficeNodeCard from "./OfficeNodeCard";
import PositionNodeCard from "./PositionNodeCard";
import StructuredNodeCard from "./StructureNodeCard";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface OrganizationNodeProps {
  offices: OfficeStructure[];
  hierarychyStructured: HierarchyResponse[];
  positionHierarchy: PositionStructure[];
  selectedOffice: OfficeStructure | null;
  isLoading: boolean;
  onOfficeClick: (office: OfficeStructure) => void;
  onBack: () => void;
}

export default function OrganizationNode({
  offices,
  hierarychyStructured,
  // positionHierarchy,
  selectedOffice,
  isLoading,
  onOfficeClick,
  onBack,
}: OrganizationNodeProps) {
  // ZOOM STATE
  const [scale, setScale] = useState(0.7);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- HANDLERS ZOOM ---
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 1.5));
  };
  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
    centerContent();
  };

  // Fungsi logika untuk scroll ke tengah
  const centerContent = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollPosition =
        (container.scrollWidth - container.clientWidth) / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    centerContent();
  }, [isLoading]);

  // --- 1. Mode VIEW: OFFICE LIST (Level 1) ---
  const officeTree = useMemo(() => {
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
      children: node.children ? node.children.map(mapOfficeNode) : [],
    });

    return offices.map(mapOfficeNode);
  }, [offices]);

  // --- 2. Mode VIEW: HIERARCHY DETAILS (Level 2 - Recursive) ---
  // Fungsi ini memproses JSON baru (Dept -> Div -> Pos)
  const hierarchyTree = useMemo(() => {
    const mapHierarchyNode = (node: any): SafeTreeNode => {
      // 1. Ekstrak data mentah
      const rawData = node.data || {};

      // // 2. Normalisasi 'Code' agar mudah dibaca oleh component Card
      let code = "";

      switch (node.type) {
        case "department":
          code = rawData.department_code;
          break;
        case "division":
          code = rawData.division_code; // Pastikan mengambil division_code
          break;
        case "position":
          code = rawData.position_code;
          break;
        case "office":
          code = rawData.office_code;
          break;
        default:
          // Fallback jika menggunakan field lain atau logic ||
          code =
            rawData.department_code ||
            rawData.division_code ||
            rawData.position_code;
      }

      // 3. Construct Data Object untuk Tree Node
      const nodeData = {
        ...rawData,
        code: code, // Field standard untuk UI
        type: node.type, // 'department', 'division', 'position', 'office'
      };

      // 4. Return SafeTreeNode
      return {
        key: node.key, // Gunakan key unik dari JSON (misal: "dept-DPT...")
        type: node.type,
        expanded: true, // Default terbuka semua
        data: nodeData,
        children: node.children ? node.children.map(mapHierarchyNode) : [],
      };
    };

    // Mapping array root dari response JSON
    return hierarychyStructured.map(mapHierarchyNode);
  }, [hierarychyStructured]);

  // --- 3. View Switcher Logic ---
  const viewMode = selectedOffice ? "hierarchy" : "office";
  const activeData = viewMode === "office" ? officeTree : hierarchyTree;

  const currentTitle = selectedOffice
    ? `Struktur Organisasi: ${selectedOffice.name}`
    : "Peta Wilayah Kantor";

  // --- 4. Node Template (Render Visual) ---
  const nodeTemplate = (node: SafeTreeNode) => {
    if (!node.data) return null;

    const type = node.type;
    const data = node.data as any;

    // A. Tampilan Kantor (Level 1)
    if (type === "office") {
      const showDetailButton = !selectedOffice;

      return (
        <OfficeNodeCard
          data={data as OfficeNodeData}
          onDetailClick={
            showDetailButton
              ? () => {
                  onOfficeClick({
                    office_code: data.office_code,
                    name: data.name,
                    address: data.address || "",
                    children: [],
                  } as OfficeStructure);
                }
              : undefined
          }
        />
      );
    }

    // B. Tampilan Struktur (Department & Division)
    if (type === "department" || type === "division") {
      return (
        <StructuredNodeCard
          type={type}
          name={data.name}
          code={data.code}
          description={data.description}
        />
      );
    }

    // C. Tampilan Karyawan/Posisi (Position)
    if (type === "position") {
      return <PositionNodeCard data={data as PositionNodeData} />;
    }

    return null;
  };

  // --- 5. Loading State ---
  if (isLoading) {
    return (
      <Card>
        <div className="flex flex-column gap-4 p-4">
          <div className="flex justify-content-between">
            <Skeleton width="200px" height="2rem" />
            <Skeleton width="100px" height="2rem" />
          </div>
          <div className="flex justify-content-center gap-4 mt-5">
            {/* Simulasi Tree Loading */}
            <div className="flex flex-column align-items-center gap-3">
              <Skeleton width="150px" height="60px" borderRadius="10px" />
              <div className="flex gap-4">
                <Skeleton width="150px" height="100px" borderRadius="10px" />
                <Skeleton width="150px" height="100px" borderRadius="10px" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // --- 6. Empty State ---
  if (!activeData || activeData.length === 0) {
    return (
      <Card className="h-full shadow-1">
        <div
          className="flex flex-column justify-content-center align-items-center p-6 text-center"
          style={{ minHeight: "400px" }}
        >
          <div className="bg-gray-50 border-circle p-4 mb-4">
            <i className="pi pi-sitemap text-5xl text-gray-400"></i>
          </div>
          <h3 className="text-gray-700 font-bold mb-2">Data Belum Tersedia</h3>
          <span className="text-gray-500 mb-4 max-w-sm">
            {viewMode === "office"
              ? "Belum ada data kantor yang terdaftar dalam sistem."
              : "Struktur organisasi untuk kantor ini belum diatur."}
          </span>

          {viewMode === "hierarchy" && (
            <Button
              label="Kembali ke Daftar Kantor"
              icon="pi pi-arrow-left"
              severity="secondary"
              className="mt-2"
              onClick={onBack}
            />
          )}
        </div>
      </Card>
    );
  }

  // --- 7. Main Render ---
  return (
    <Card className="overflow-hidden shadow-1 border-none">
      {/* Header */}
      <div className="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center mb-5 px-2 gap-3">
        <div>
          <h2 className="text-xl font-bold m-0 text-gray-800 flex align-items-center gap-2">
            {viewMode === "hierarchy" && (
              <i className="pi pi-building text-blue-500"></i>
            )}
            {currentTitle}
          </h2>
          {viewMode === "hierarchy" && (
            <p className="text-sm text-gray-500 m-0 mt-1">
              Menampilkan struktur departemen, divisi, dan posisi.
            </p>
          )}
        </div>

        <div className="flex align-items-center gap-2">
          <div className="flex align-items-center bg-gray-50 border-1 border-gray-200 border-round-left-lg p-1 mr-2">
            <Button
              icon={<ZoomOut size={16} />}
              text
              severity="secondary"
              className="w-2rem h-2rem p-0"
              onClick={handleZoomOut}
              tooltip="Zoom Out"
              tooltipOptions={{ position: "bottom" }}
            />
            <span className="text-xs font-mono font-medium text-gray-600 px-2 w-3rem text-center select-none">
              {Math.round(scale * 100)}%
            </span>

            <Button
              icon={<ZoomIn size={16} />}
              text
              severity="secondary"
              className="w-2rem h-2rem"
              onClick={handleZoomIn}
              tooltip="Zoom In"
              tooltipOptions={{ position: "bottom" }}
            />
            <div className="w-1 h-1rem bg-gray-300 mx-1"></div>
            <Button
              icon={<RotateCcw size={16} />}
              text
              severity="secondary"
              className="w-2rem h-2rem p-0"
              onClick={handleResetZoom}
              tooltip="Reset Zoom"
              tooltipOptions={{ position: "bottom" }}
            />
          </div>
        </div>

        {viewMode === "hierarchy" && (
          <Button
            label="Kembali"
            icon="pi pi-arrow-left"
            size="small"
            severity="secondary"
            outlined
            className="gap-2"
            onClick={onBack}
          />
        )}
      </div>

      <div
        ref={containerRef}
        className="overflow-auto pb-4 custom-org-chart scroll-smooth"
        style={{ minHeight: "400px" }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            transition: "transform 0.3 ease-in-out",
            width: "fit-content",
            margin: "0 auto",
          }}
        >
          {/* Chart Area */}
          {/* <div className="overflow-auto pb-4 custom-org-chart"> */}
          <OrganizationChart
            value={activeData}
            nodeTemplate={nodeTemplate}
            selectionMode="single"
            className="w-full"
            pt={{
              node: { className: "bg-transparent border-none p-3" },
              // Styling garis penghubung agar lebih elegan
              lineDown: {
                className: "bg-gray-300",
                style: { height: "20px" },
              },
              lineLeft: {
                className: "border-gray-300",
                style: { borderRadius: "0" },
              },
              lineRight: {
                className: "border-gray-300",
                style: { borderRadius: "0" },
              },
            }}
          />
          {/* </div> */}
        </div>
      </div>
    </Card>
  );
}
