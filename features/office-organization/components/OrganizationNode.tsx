"use client";

import { mapDataToTreeNode } from "../utils/buildOrgChartTree";
import {
  OfficeNodeData,
  OfficeStructure,
  PositionNodeData,
  PositionStructure,
  SafeTreeNode,
} from "../schemas/officeOrganizationSchema";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { OrganizationChart } from "primereact/organizationchart";
import { TreeNode } from "primereact/treenode";
import { useMemo, useState } from "react";
import OfficeNodeCard from "./OfficeNodeCard";
import PositionNodeCard from "./PositionNodeCard";

interface OrganizationNodeProps {
  initialOfficeData: OfficeStructure[];
  initialPositionData: PositionStructure[];
  isOfficeLoading: boolean;
}

export default function OrganizationNode({
  initialOfficeData,
  initialPositionData,
  isOfficeLoading,
}: OrganizationNodeProps) {
  const [selection, setSelection] = useState<TreeNode | TreeNode[] | null>(
    null
  );
  const [employeeData, setEmployeeData] = useState<SafeTreeNode[]>([]);

  const [viewMode, setViewMode] = useState<"office" | "employee">("office");
  const [currentTitle, setCurrentTitle] = useState("Struktur Wilayah Kantor");

  const officeTree = useMemo(() => {
    if (!initialOfficeData || initialOfficeData.length === 0) {
      return [];
    }

    const result = mapDataToTreeNode<OfficeStructure, OfficeNodeData>(
      initialOfficeData,
      {
        getKey: (item) => item.office_code,
        getChildren: (item) => item.children,
        getData: (item) => ({
          office_code: item.office_code,
          name: item.name,
          address: item.address,
          description: item.description,
          type: "office",
        }),
        nodeType: "person",
      }
    );

    return result.filter(Boolean);
  }, [initialOfficeData]);

  const positionTree = useMemo(() => {
    if (!initialPositionData || initialPositionData.length === 0) {
      return [];
    }

    const result = mapDataToTreeNode<PositionStructure, PositionNodeData>(
      initialPositionData,
      {
        getKey: (item) => item.position_code,
        getChildren: (item) => item.children,
        getData: (item) => ({
          position_code: item.position_code,
          name: item.name,
          employee_code: item.employee_code,
          employee_name: item.employee_name,
          type: "employee",
          image: "https://via.placeholder.com/60",
        }),
      }
    );

    return result.filter(Boolean);
  }, [initialPositionData]);

  const handleNodeClick = (node: SafeTreeNode) => {
    if (node.data.type === "office" && viewMode === "office") {
      const officeName = node.data.name;

      setEmployeeData(positionTree);
      setCurrentTitle(`Struktur Organisasi: ${officeName}`);
      setViewMode("employee");
      setSelection(null);
    }
  };

  const handleBack = () => {
    setViewMode("office");
    setCurrentTitle("Struktur Wilayah Kantor");
    setEmployeeData([]);
  };

  const nodeTemplate = (node: TreeNode) => {
    if (!node.data) {
      return null;
    }

    const isOffice = node.data.type === "office";

    if (isOffice) {
      return (
        <OfficeNodeCard
          data={node.data as OfficeNodeData}
          onDetailClick={() => handleNodeClick(node as SafeTreeNode)}
        />
      );
    }

    return <PositionNodeCard data={node.data as PositionNodeData} />;
  };

  if (isOfficeLoading) {
    return (
      <Card>
        <div className="flex justify-content-center align-items-center p-5">
          <i className="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
          <span className="ml-2 text-800 font-semibold">
            Memuat Struktur Organisasi
          </span>
        </div>
      </Card>
    );
  }

  const activeData = viewMode === "office" ? officeTree : positionTree;

  if (!activeData || activeData.length === 0) {
    return (
      <Card className="h-full">
        <div
          className="flex flex-column justify-content-center align-items-center p-5 text-center"
          style={{ minHeight: "300px" }}
        >
          <i className="pi pi-sitemap text-5xl text-gray-300 mb-3"></i>
          <span className="text-gray-500 font-medium text-lg">
            Tidak ada data untuk ditampilkan
          </span>
          <p className="text-sm text-gray-400 mt-2">
            {viewMode === "office"
              ? "Belum ada data kantor yang tersedia."
              : "Tidak ada data posisi/karyawan di kantor ini."}
          </p>
          {viewMode === "employee" && (
            <Button
              label="Kembali"
              icon="pi pi-arrow-left"
              className="mt-3"
              size="small"
              outlined
              onClick={handleBack}
              pt={{
                icon: {
                  className: "mr-2",
                },
              }}
            />
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className=" overflow-y-auto">
      <div className="flex justify-content-between align-items-center mb-4 px-2">
        <h2 className="text-xl font-bold">{currentTitle}</h2>
        {viewMode === "employee" && (
          <Button
            label="Kembali Ke Peta Kantor"
            icon="pi pi-arrow-left"
            size="small"
            severity="secondary"
            onClick={handleBack}
            pt={{
              icon: {
                className: "mr-2",
              },
            }}
          />
        )}
      </div>
      <OrganizationChart
        value={activeData}
        nodeTemplate={nodeTemplate}
        selection={selection}
        onSelectionChange={(e) => setSelection(e.data as SafeTreeNode)}
        pt={{
          table: {
            className: "mx-auto",
          },
          lineRight: {
            className: "border-500",
          },
          lineLeft: {
            className: "border-500",
          },
          lineDown: {
            className: "bg-gray-500",
          },
          node: {
            className: "p-3 bg-transparent border-none",
          },
        }}
      />
    </Card>
  );
}
