/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { Shift } from "../schemas/shiftSchema";

interface ShiftTableProps {
  data: any[];
  isLoading: boolean;
  totalRecords: number;
  lazyParams: any;
  onPageChange: (e: any) => void;
  onView: (data: any) => void;
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
}

const dayNameMap: { [key: number]: string } = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

export default function ShiftTable({
  data,
  isLoading,
  totalRecords,
  lazyParams,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: ShiftTableProps) {
  const [viewingId, setViewingId] = useState<number | null>(null);

  const handleViewClick = async (row: Shift) => {
    setViewingId(row.id);
    setTimeout(async () => {
      await onView(row);
      setViewingId(null);
    }, 0);
  };

  const workDaysBodyTemplate = (rowData: Shift) => {
    if (!rowData.work_days || rowData.work_days.length === 0) {
      return <span className="text-gray-500 italic">Tidak ada hari</span>;
    }

    const sortedDays = [...rowData.work_days].sort((a, b) => a - b);

    return (
      <div className="flex flex-wrap gap-1">
        {sortedDays.map((dayId, index) => (
          <Tag
            key={index}
            value={dayNameMap[dayId] || dayId}
            severity="info"
            className="text-xs px-2 py-1"
            style={{ fontWeight: "normal" }}
          />
        ))}
      </div>
    );
  };

  // 2. Template for Time Formatting (Optional, makes it look nicer)
  const timeBodyTemplate = (time: string) => {
    // Remove seconds if present (e.g., 08:00:00 -> 08:00)
    return time?.substring(0, 5) || "-";
  };

  return (
    <DataTable
      value={data}
      loading={isLoading}
      lazy={true}
      paginator
      first={lazyParams.first}
      rows={lazyParams.rows}
      totalRecords={totalRecords}
      onPage={onPageChange}
      rowsPerPageOptions={[5, 10, 25, 50]}
      className="border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden"
      emptyMessage="Tidak ada data shift"
    >
      <Column
        field="name"
        header="Nama Shift"
        sortable
        style={{ width: "20%" }}
      />

      <Column
        field="start_time"
        header="Jam Masuk"
        body={(row) => timeBodyTemplate(row.start_time)}
        sortable
        style={{ width: "15%" }}
      />

      <Column
        field="end_time"
        header="Jam Pulang"
        body={(row) => timeBodyTemplate(row.end_time)}
        sortable
        style={{ width: "15%" }}
      />

      {/* 3. The Work Days Column */}
      <Column
        field="work_days"
        header="Hari Kerja"
        body={workDaysBodyTemplate}
        style={{ width: "40%" }}
      />

      {/* 3. The Office Column */}
      <Column
        field="office_name"
        header="Nama Kantor"
        style={{ width: "20%" }}
      />

      <Column
        header="Aksi"
        style={{ width: "25%" }}
        body={(row: Shift) => (
          <div className="flex gap-2">
            <Button
              icon="pi pi-eye text-sm"
              size="small"
              severity="info"
              tooltip="Lihat Detail"
              loading={viewingId === row.id}
              onClick={() => handleViewClick(row)}
            />

            <Button
              icon="pi pi-pencil text-sm"
              size="small"
              severity="warning"
              tooltip="Edit"
              onClick={() => onEdit(row)}
              disabled={viewingId !== null}
            />

            <Button
              icon="pi pi-trash text-sm"
              size="small"
              severity="danger"
              tooltip="Hapus"
              onClick={() => onDelete(row)}
              disabled={viewingId !== null}
            />
          </div>
        )}
      />
    </DataTable>
  );
}
