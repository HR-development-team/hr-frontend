/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { User } from "../schemas/userSchema";

export interface UserTableProps {
  data: User[];
  isLoading: boolean;
  totalRecords: number;
  lazyParams: any;
  onPageChange: (e: any) => void;
  onView: (row: User) => void;
  onEdit: (row: User) => void;
  onDelete: (row: User) => void;
}

export default function UserTable({
  data,
  isLoading,
  totalRecords,
  lazyParams,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: UserTableProps) {
  const [viewingId, setViewingId] = useState<number | null>(null);

  const handleViewClick = async (row: User) => {
    setViewingId(row.id);
    setTimeout(async () => {
      await onView(row);
      setViewingId(null);
    }, 0);
  };

  return (
    <DataTable
      value={data}
      loading={isLoading}
      // 1. Enable Lazy Loading & Pagination Control
      lazy={true}
      paginator
      first={lazyParams.first}
      rows={lazyParams.rows}
      totalRecords={totalRecords}
      onPage={onPageChange}
      rowsPerPageOptions={[5, 10, 25, 50]}
      // 2. Styling
      className="border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden"
      emptyMessage="Tidak ada data user"
      stripedRows
    >
      <Column
        field="user_code"
        header="Kode User"
        sortable
        style={{ width: "20%" }}
      />

      <Column field="email" header="Email" sortable style={{ width: "25%" }} />

      <Column
        field="role_name"
        header="Role"
        sortable
        style={{ width: "20%" }}
      />

      <Column
        header="Karyawan"
        style={{ width: "20%" }}
        body={(row: User) => (
          <span
            className={row.employee_name ? "text-gray-900" : "text-gray-400"}
          >
            {row.employee_name || "-"}
          </span>
        )}
      />

      <Column
        header="Aksi"
        style={{ width: "15%" }}
        body={(row: User) => (
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
