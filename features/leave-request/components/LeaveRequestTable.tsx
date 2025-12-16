"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { formatDateIDN } from "@/utils/dateFormat";
import { LeaveRequest } from "../schemas/leaveRequestSchema";
import { useState } from "react";

interface LeaveRequestTableProps {
  data: LeaveRequest[];
  isLoading: boolean;
  onView: (row: LeaveRequest) => void;
  onEdit: (row: LeaveRequest) => void;
  onDelete: (row: LeaveRequest) => void;
}

export default function LeaveRequestTable({
  data,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: LeaveRequestTableProps) {
  const [viewingId, setViewingId] = useState<number | null>(null);

  const handleViewClick = async (row: LeaveRequest) => {
    setViewingId(row.id);

    // Small delay/async handling to show loading state on the button
    setTimeout(async () => {
      await onView(row);
      setViewingId(null);
    }, 0);
  };

  const statusBodyTemplate = (rowData: LeaveRequest) => {
    const status = rowData.status || "Pending"; // Default fallback

    let severity: "warning" | "success" | "danger" | null = null;

    if (status === "Pending") severity = "warning";
    else if (status === "Approved") severity = "success";
    else if (status === "Rejected") severity = "danger";

    return <Tag value={status} severity={severity} />;
  };

  // =========================================================================
  // Main Render
  // =========================================================================

  return (
    <div className="card border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden">
      <DataTable
        value={data}
        loading={isLoading}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "60rem" }}
        emptyMessage="Belum ada data permohonan cuti."
      >
        <Column field="id" header="Kode" style={{ width: "10%" }} />

        {/* If your API returns joined user data, use row.user.name. 
            Otherwise, this might just be user_id */}
        <Column
          field="user_id" // Or employee_name if joined
          header="Karyawan"
          style={{ width: "20%" }}
        />

        <Column
          field="type_id" // Or type_name if joined
          header="Tipe Cuti"
          style={{ width: "15%" }}
        />

        <Column
          field="start_date"
          header="Tanggal Mulai"
          body={(row) => formatDateIDN(row.start_date)}
          style={{ width: "15%" }}
        />

        <Column
          field="end_date"
          header="Tanggal Selesai"
          body={(row) => formatDateIDN(row.end_date)}
          style={{ width: "15%" }}
        />

        <Column field="reason" header="Alasan" style={{ width: "20%" }} />

        <Column
          field="status"
          header="Status"
          body={statusBodyTemplate}
          style={{ width: "10%" }}
          align="center"
        />

        <Column
          header="Aksi"
          body={(row: LeaveRequest) => (
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
                icon="pi pi-pencil"
                rounded
                outlined
                size="small"
                severity="info"
                tooltip="Edit Permohonan"
                onClick={() => onEdit(row)}
                // Disable edit if already processed (optional logic)
                disabled={row.status !== "Pending"}
              />

              {/* Delete Button */}
              <Button
                icon="pi pi-trash"
                rounded
                outlined
                size="small"
                severity="danger"
                tooltip="Hapus Permohonan"
                onClick={() => onDelete(row)}
                disabled={row.status !== "Pending"}
              />
            </div>
          )}
          style={{ width: "10%" }}
          align="center"
        />
      </DataTable>
    </div>
  );
}
