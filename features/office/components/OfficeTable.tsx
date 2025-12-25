/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Office } from "../schemas/officeSchema";
import { Tag } from "primereact/tag";

export interface OfficeTableProps {
  data: Office[];
  isLoading: boolean;
  totalRecords: number;
  lazyParams: any;
  onPageChange: (e: any) => void;
  onView: (row: Office) => void;
  onEdit: (row: Office) => void;
  onDelete: (row: Office) => void;
}

export default function OfficeTable({
  data,
  isLoading,
  totalRecords,
  lazyParams,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: OfficeTableProps) {
  const [viewingId, setViewingId] = useState<number | null>(null);

  const handleViewClick = async (row: Office) => {
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
      lazy={true}
      paginator
      first={lazyParams.first}
      rows={lazyParams.rows}
      totalRecords={totalRecords}
      onPage={onPageChange}
      rowsPerPageOptions={[5, 10, 25, 50]}
      className="border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden"
      emptyMessage="Tidak ada data kantor"
      stripedRows
    >
      <Column
        field="office_code"
        header="Kode"
        sortable
        style={{ width: "15%" }}
      />

      <Column
        field="name"
        header="Nama Kantor"
        sortable
        style={{ width: "35%" }}
        body={(row: Office) => (
          <div className="flex align-items-center gap-2">
            <span className="font-medium text-gray-900">{row.name}</span>
            {!row.parent_office_name && (
              <Tag
                value="Pusat"
                severity="info"
                className="text-xs px-2 py-0 border-round-md"
              />
            )}
          </div>
        )}
      />

      <Column
        field="parent_office_name"
        header="Kantor Induk"
        sortable
        style={{ width: "30%" }}
        body={(row: Office) => {
          if (row.parent_office_name) {
            return (
              <span className="text-gray-700">{row.parent_office_name}</span>
            );
          }
          return <span className="text-gray-400">-</span>;
        }}
      />

      <Column
        header="Aksi"
        style={{ width: "20%" }}
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
