"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Position } from "../schemas/positionSchema";

export interface PositionTableProps {
  data: Position[];
  isLoading: boolean;
  onView: (row: Position) => void;
  onEdit: (row: Position) => void;
  onDelete: (row: Position) => void;
}

export default function PositionTable({
  data,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: PositionTableProps) {
  const [viewingId, setViewingId] = useState<number | null>(null);

  const handleViewClick = async (row: Position) => {
    setViewingId(row.id);

    // Small delay/async handling to show loading state on the button
    setTimeout(async () => {
      await onView(row);
      setViewingId(null);
    }, 0);
  };

  const salaryBodyTemplate = (rowData: Position) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(rowData.base_salary));
  };

  return (
    <DataTable
      value={data}
      loading={isLoading}
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 25, 50]}
      className="border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden"
      emptyMessage="Tidak ada data jabatan"
    >
      {/* Column Config */}
      <Column
        field="position_code"
        header="Kode Jabatan"
        sortable
        style={{ width: "15%" }}
      />

      <Column
        field="name"
        header="Nama Jabatan"
        sortable
        style={{ width: "25%" }}
      />

      <Column
        field="division_name"
        header="Nama Divisi"
        sortable
        style={{ width: "20%" }}
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

      <Column
        field="base_salary"
        header="Gaji Pokok"
        body={salaryBodyTemplate}
        sortable
        style={{ width: "20%" }}
      />

      {/* Actions Column */}
      <Column
        header="Aksi"
        style={{ width: "25%" }}
        body={(row: Position) => (
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
