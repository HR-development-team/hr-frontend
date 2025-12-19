"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { Employee } from "../schemas/employeeSchema";

export interface EmployeeTableProps {
  data: Employee[];
  isLoading: boolean;
  onView: (row: Employee) => void;
  onEdit: (row: Employee) => void;
  onDelete: (row: Employee) => void;
}

export default function EmployeeTable({
  data,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  const [viewingId, setViewingId] = useState<number | null>(null);

  const handleViewClick = async (row: Employee) => {
    setViewingId(row.id);
    setTimeout(async () => {
      await onView(row);
      setViewingId(null);
    }, 0);
  };

  const getStatusSeverity = (statusName: string | undefined) => {
    switch (statusName?.toLowerCase()) {
      case "tetap":
        return "success"; // Green
      case "kontrak":
        return "info"; // Blue
      case "training":
      case "magang":
        return "warning"; // Orange/Yellow
      case "keluar":
        return "danger"; // Red
      default:
        return "secondary"; // Grey for unknown
    }
  };

  const statusBodyTemplate = (rowData: Employee) => {
    const status = rowData.employment_status;
    if (!status) {
      return <Tag value="-" severity="secondary" className="text-xs" />;
    }

    return (
      <Tag
        value={status} // Display the name (e.g., "Tetap")
        severity={getStatusSeverity(status)} // Calculate color
        className="text-xs"
      />
    );
  };

  return (
    <DataTable
      value={data}
      loading={isLoading}
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 25, 50]}
      className="border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden"
      emptyMessage="Tidak ada data karyawan"
      scrollable
    >
      {/* Column Config */}
      <Column
        field="employee_code"
        header="Kode Karyawan"
        sortable
        style={{ minWidth: "150px" }}
      />

      <Column
        field="full_name"
        header="Nama Karyawan"
        sortable
        style={{ minWidth: "200px" }}
        className="font-medium"
      />

      <Column
        field="join_date"
        header="Bergabung Pada"
        sortable
        style={{ minWidth: "150px" }}
      />

      <Column
        field="employment_status"
        header="Status"
        body={statusBodyTemplate}
        sortable
        style={{ minWidth: "100px" }}
      />

      <Column
        field="position_name"
        header="Nama Posisi"
        sortable
        style={{ minWidth: "150px" }}
      />

      <Column
        field="division_name"
        header="Nama Divisi"
        sortable
        style={{ minWidth: "150px" }}
      />

      <Column
        field="department_name"
        header="Nama Department"
        sortable
        style={{ minWidth: "150px" }}
      />

      <Column
        field="office_name"
        header="Nama Kantor"
        sortable
        style={{ minWidth: "150px" }}
      />

      {/* Actions Column */}
      <Column
        header="Aksi"
        style={{ minWidth: "140px" }}
        frozen
        alignFrozen="right"
        body={(row: Employee) => (
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
