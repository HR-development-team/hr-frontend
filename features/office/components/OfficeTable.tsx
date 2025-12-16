"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Office } from "../schemas/officeSchema";

export interface OfficeTableProps {
  data: Office[];
  isLoading: boolean;
  onView: (row: Office) => void;
  onEdit: (row: Office) => void;
  onDelete: (row: Office) => void;
}

export default function OfficeTable({
  data,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: OfficeTableProps) {
  const [viewingId, setViewingId] = useState<number | null>(null);

  const handleViewClick = async (row: Office) => {
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
      emptyMessage="Tidak ada data kantor"
    >
      {/* Column Config: Adjust 'field' names based on your actual API response */}
      <Column
        field="office_code"
        header="Kode Kantor"
        style={{ width: "20%" }}
      />
      <Column field="name" header="Nama Kantor" style={{ width: "25%" }} />

      {/* Actions Column */}
      <Column
        header="Aksi"
        style={{ width: "15%" }}
        body={(row: Office) => (
          <div className="flex gap-2">
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
