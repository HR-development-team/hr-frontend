"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Division } from "../schemas/divisionSchema";

export interface DivisionTableProps {
  data: Division[];
  isLoading: boolean;
  onView: (row: Division) => void;
  onEdit: (row: Division) => void;
  onDelete: (row: Division) => void;
}

export default function DivisionTable({
  data,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: DivisionTableProps) {
  const [viewingId, setViewingId] = useState<number | null>(null);

  const handleViewClick = async (row: Division) => {
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
      emptyMessage="Tidak ada data divisi"
    >
      {/* Column Config */}
      <Column
        field="division_code"
        header="Kode Divisi"
        sortable
        style={{ width: "20%" }}
      />

      <Column
        field="name"
        header="Nama Divisi"
        sortable
        style={{ width: "25%" }}
      />

      <Column
        field="department_name"
        header="Nama Departemen"
        sortable
        style={{ width: "20%" }}
      />

      <Column
        field="office_name"
        header="Nama Kantor"
        sortable
        style={{ width: "20%" }}
      />

      {/* Actions Column */}
      <Column
        header="Aksi"
        style={{ width: "20%" }}
        body={(row: Division) => (
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
