/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { OrganizationChart } from "primereact/organizationchart";
import { Skeleton } from "primereact/skeleton";
import {
  OfficeStructure,
  OfficeNodeData,
  PositionNodeData,
  SafeTreeNode,
} from "../schemas/organizationSchema";
import OfficeNodeCard from "./OfficeNodeCard";
import PositionNodeCard from "./PositionNodeCard";
import StructuredNodeCard from "./StructureNodeCard";
import { RotateCcw, ZoomIn, ZoomOut, Hand } from "lucide-react";

interface OrganizationNodeProps {
  offices: SafeTreeNode[];
  hierarychyStructured: SafeTreeNode[];
  selectedOffice: OfficeStructure | null;
  isLoading: boolean;
  onOfficeClick: (office: OfficeStructure) => void;
  onBack: () => void;
}

export default function OrganizationNode({
  offices,
  hierarychyStructured,
  selectedOffice,
  isLoading,
  onOfficeClick,
  onBack,
}: OrganizationNodeProps) {
  const [transform, setTransform] = useState({ scale: 0.7, x: 0, y: 0 });
  const [isGrabbing, setIsGrabbing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startX: 0, startY: 0, limitX: 0, limitY: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current || !contentRef.current) return;

    setIsGrabbing(true);
    const content = contentRef.current;

    const horizontalLimit = (content.offsetWidth * transform.scale) / 2;
    const verticalLimit = (content.offsetHeight * transform.scale) / 2;

    dragRef.current = {
      startX: e.clientX - transform.x,
      startY: e.clientY - transform.y,
      limitX: horizontalLimit,
      limitY: verticalLimit,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isGrabbing) return;
    e.preventDefault();

    let newX = e.clientX - dragRef.current.startX;
    let newY = e.clientY - dragRef.current.startY;

    const { limitX, limitY } = dragRef.current;
    newX = Math.max(-limitX, Math.min(limitX, newX));
    newY = Math.max(-limitY, Math.min(limitY, newY));

    setTransform((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => setIsGrabbing(false);
  const handleMouseLeave = () => setIsGrabbing(false);

  const handleZoomIn = () =>
    setTransform((p) => ({ ...p, scale: Math.min(p.scale + 0.1, 1.5) }));

  const handleZoomOut = () =>
    setTransform((p) => ({ ...p, scale: Math.max(p.scale - 0.1, 0.5) }));

  const handleReset = () => setTransform({ scale: 0.7, x: 0, y: 0 });

  useEffect(() => {
    handleReset();
  }, [isLoading, offices, hierarychyStructured]);

  const viewMode = selectedOffice ? "hierarchy" : "office";
  const activeData = viewMode === "office" ? offices : hierarychyStructured;
  const currentTitle = selectedOffice
    ? `Struktur Organisasi: ${selectedOffice.name}`
    : "Peta Wilayah Kantor";

  const nodeTemplate = (node: SafeTreeNode) => {
    if (!node.data) return null;
    const type = node.type;
    const data = node.data as any;

    const safeClick = (callback: () => void) => {
      if (!isGrabbing) callback();
    };

    let content = null;
    if (type === "office") {
      content = (
        <OfficeNodeCard
          data={data as OfficeNodeData}
          onDetailClick={
            !selectedOffice
              ? () =>
                  safeClick(() =>
                    onOfficeClick({
                      office_code: data.office_code || data.code,
                      name: data.name,
                      address: data.address || "",
                      children: [],
                    } as OfficeStructure)
                  )
              : undefined
          }
        />
      );
    } else if (type === "department" || type === "division") {
      content = (
        <StructuredNodeCard
          type={type}
          name={data.name}
          code={data.code || data.department_code || data.division_code}
          description={data.description}
          leader_name={data.leader_name}
          leader_position={data.leader_position}
        />
      );
    } else if (type === "position") {
      content = <PositionNodeCard data={data as PositionNodeData} />;
    }

    if (!content) return null;

    return (
      <div className="p-3" style={{ display: "inline-block" }}>
        {content}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="h-full shadow-1 border-none">
        <Skeleton width="100%" height="400px" />
      </Card>
    );
  }

  if (!activeData || activeData.length === 0) {
    return (
      <Card className="h-full shadow-1">
        <div className="text-center p-6">Data Belum Tersedia</div>
      </Card>
    );
  }

  return (
    <Card
      className="h-full shadow-1 border-none flex flex-column"
      pt={{
        body: { className: "flex flex-column h-full p-0" },
        content: { className: "flex flex-column h-full p-0" },
      }}
    >
      <div className="flex-none flex flex-column md:flex-row justify-content-between align-items-center p-4 border-bottom-1 border-gray-200 bg-white z-2 gap-3 shadow-2">
        <h2 className="text-xl font-bold m-0 text-gray-800 flex align-items-center gap-2">
          {viewMode === "hierarchy" && (
            <i className="pi pi-building text-blue-500"></i>
          )}
          {currentTitle}
        </h2>
        <div className="flex align-items-center gap-2">
          <div className="flex align-items-center bg-gray-50 border-1 border-gray-200 border-round-left-lg p-1 mr-2">
            <Button
              icon={<ZoomOut size={16} />}
              text
              severity="secondary"
              className="w-2rem h-2rem p-0"
              onClick={handleZoomOut}
            />
            <span className="text-xs font-mono font-medium text-gray-600 px-2 w-3rem text-center select-none">
              {Math.round(transform.scale * 100)}%
            </span>
            <Button
              icon={<ZoomIn size={16} />}
              text
              severity="secondary"
              className="w-2rem h-2rem"
              onClick={handleZoomIn}
            />
            <div className="w-1 h-1rem bg-gray-300 mx-1"></div>
            <Button
              icon={<RotateCcw size={16} />}
              text
              severity="secondary"
              className="w-2rem h-2rem p-0"
              onClick={handleReset}
            />
          </div>
          {viewMode === "hierarchy" && (
            <Button
              label="Kembali"
              icon="pi pi-arrow-left"
              className="gap-1"
              size="small"
              severity="secondary"
              outlined
              onClick={onBack}
            />
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-hidden bg-gray-50 relative select-none"
        style={{
          cursor: isGrabbing ? "grabbing" : "grab",
          touchAction: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "center center",
            transition: isGrabbing
              ? "none"
              : "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
            pointerEvents: "none",
          }}
        >
          <div
            ref={contentRef}
            style={{ pointerEvents: "auto", display: "inline-block" }}
          >
            <OrganizationChart
              value={activeData}
              nodeTemplate={nodeTemplate}
              selectionMode="single"
              className="w-auto"
              pt={{
                node: {
                  className:
                    "bg-transparent border-none p-0 inline-block w-auto",
                },
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
          </div>
        </div>
      </div>

      <div className="w-full p-2 bg-white-alpha-90 text-center text-xs text-gray-500 border-top-1 border-gray-200 pointer-events-none">
        <div className="flex align-items-center justify-content-center gap-2">
          <Hand size={14} />
          <span>Klik dan geser area kosong untuk menggerakkan peta</span>
        </div>
      </div>
    </Card>
  );
}
