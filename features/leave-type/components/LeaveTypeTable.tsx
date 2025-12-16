"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { LeaveType } from "../schemas/leaveTypeSchema";

export interface LeaveTypeTableProps {
  data: LeaveType[];
  isLoading: boolean;
  onView: (row: LeaveType) => void;
  onEdit: (row: LeaveType) => void;
  onDelete: (row: LeaveType) => void;
}

export default function LeaveTypeTable({
  data,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: LeaveTypeTableProps) {
  const [viewingId, setViewingId] = useState<number | null>(null);

  const handleViewClick = async (row: LeaveType) => {
    setViewingId(row.id);
    // Small delay/async handling to show loading state on the button
    setTimeout(async () => {
      await onView(row);
      setViewingId(null);
    }, 0);
  };

  return (
    <DataTable
      value={data}
      loading={isLoading}
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 25, 50]}
      className="border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden"
      emptyMessage="Tidak ada data tipe cuti"
      scrollable
    >
      {/* Column Config */}
      <Column
        field="type_code"
        header="Kode"
        sortable
        style={{ minWidth: "150px" }}
      />

      <Column
        field="name"
        header="Nama Tipe Cuti"
        sortable
        style={{ minWidth: "200px" }}
        className="font-medium"
      />

      <Column
        field="deduction"
        header="Pengurangan (Hari)"
        sortable
        style={{ minWidth: "150px" }}
        body={(rowData: LeaveType) => (
          <span className="font-mono bg-blue-50 text-blue-600 px-2 py-1 border-round">
            {rowData.deduction}
          </span>
        )}
      />

      <Column
        field="description"
        header="Deskripsi"
        style={{ minWidth: "250px" }}
        body={(rowData: LeaveType) => (
          <span className="text-gray-500 text-sm italic">
            {rowData.description || "-"}
          </span>
        )}
      />

      {/* Actions Column */}
      <Column
        header="Aksi"
        style={{ minWidth: "140px" }}
        body={(row: LeaveType) => (
          <div className="flex gap-2">
            {/* View Detail Button */}
            <Button
              icon="pi pi-eye text-sm"
              size="small"
              severity="info"
              tooltip="Lihat Detail"
              loading={viewingId === row.id}
              onClick={() => handleViewClick(row)}
            />

            {/* Edit Button */}
            <Button
              icon="pi pi-pencil text-sm"
              size="small"
              severity="warning"
              tooltip="Edit"
              onClick={() => onEdit(row)}
              disabled={viewingId !== null}
            />

            {/* Delete Button */}
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
