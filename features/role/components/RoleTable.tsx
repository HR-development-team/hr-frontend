/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Role } from "../schemas/roleSchema";

export interface RoleTableProps {
  data: Role[];
  isLoading: boolean;
  totalRecords: number;
  lazyParams: any;
  onPageChange: (e: any) => void;
  onSetting: (row: Role) => void;
  onEdit: (row: Role) => void;
  onDelete: (row: Role) => void;
}

export default function RoleTable({
  data,
  isLoading,
  totalRecords,
  lazyParams,
  onPageChange,
  onSetting,
  onEdit,
  onDelete,
}: RoleTableProps) {
  const [navigatingId, setNavigatingId] = useState<number | null>(null);

  const handleSettingClick = (row: Role) => {
    setNavigatingId(row.id);
    setTimeout(() => {
      onSetting(row);
    }, 0);
  };

  return (
    <DataTable
      value={data}
      loading={isLoading}
      // Enable Lazy Loading & Pagination Control
      lazy={true}
      paginator
      first={lazyParams.first}
      rows={lazyParams.rows}
      totalRecords={totalRecords}
      onPage={onPageChange}
      rowsPerPageOptions={[5, 10, 25, 50]}
      // Styling
      className="border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden"
      emptyMessage="Tidak ada data role"
      stripedRows
    >
      <Column
        field="role_code"
        header="Kode Role"
        sortable
        style={{ width: "25%" }}
      />

      <Column field="name" header="Nama" sortable style={{ width: "25%" }} />

      <Column
        header="Aksi"
        style={{ width: "25%" }}
        body={(row: Role) => (
          <div className="flex gap-2">
            {/* Setting Permission Button */}
            <Button
              icon="pi pi-cog text-sm"
              size="small"
              severity="success"
              tooltip="Pengaturan"
              loading={navigatingId === row.id}
              onClick={() => handleSettingClick(row)}
            />

            {/* Edit Button */}
            <Button
              icon="pi pi-pencil text-sm"
              size="small"
              severity="warning"
              tooltip="Edit"
              onClick={() => onEdit(row)}
              disabled={navigatingId !== null}
            />

            {/* Delete Button */}
            <Button
              icon="pi pi-trash text-sm"
              size="small"
              severity="danger"
              tooltip="Hapus"
              onClick={() => onDelete(row)}
              disabled={navigatingId !== null}
            />
          </div>
        )}
      />
    </DataTable>
  );
}
