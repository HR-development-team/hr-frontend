"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import React from "react"; // Added React import for consistency
import { DataTableAttendanceSessionProp } from "@/lib/types/dataTable/dataTableAttendanceSessionType";
import { GetAllAttendanceSessionData } from "@/lib/types/attendanceSession";

export default function DataTableSession({
  attendanceSession,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onClose,
}: DataTableAttendanceSessionProp) {
  // Helper function for the Action Buttons, matching your Department table button style
  return (
    <DataTable
      value={attendanceSession}
      loading={isLoading}
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 25, 50]}
      className="border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden"
      stripedRows
    >
      <Column
        field="session_code"
        header="Kode Sesi"
        sortable
        style={{ width: "15%" }}
      />

      {/* Date Column */}
      <Column
        field="date"
        header="Tanggal"
        sortable
        style={{ minWidth: "200px" }}
        body={(rowData: GetAllAttendanceSessionData) => (
          <div className="flex align-items-center gap-2">
            <span>
              {new Date(rowData.date).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}
      />

      {/* Time Range Column */}
      <Column
        field="time_range"
        header="Waktu (Mulai-Selesai)"
        style={{ minWidth: "250px" }}
        body={(rowData: GetAllAttendanceSessionData) => (
          <div className="flex align-items-center gap-2">
            <span>{`${rowData.open_time.substring(0, 5)} - ${rowData.close_time.substring(0, 5)}`}</span>
          </div>
        )}
      />

      <Column
        field="cutoff_time"
        header="Batas Absen Masuk"
        style={{ minWidth: "150px" }}
      />

      <Column
        field="created_by_full_name"
        header="Dibuat Oleh"
        style={{ minWidth: "150px" }}
      />

      {/* Status Column */}
      <Column
        field="status"
        header="Status"
        sortable
        style={{ width: "10%" }}
        body={(rowData: GetAllAttendanceSessionData) => {
          const isClosed = rowData.status === "closed";
          return (
            <Tag
              value={isClosed ? "TUTUP" : "BUKA"}
              severity={isClosed ? "danger" : "success"}
            />
          );
        }}
      />

      {/* Action Buttons Column */}
      <Column
        header="Aksi"
        style={{ width: "10%", textAlign: "center" }}
        body={(rowData: GetAllAttendanceSessionData) => {
          const isClosed = rowData.status === "closed";
          return (
            <div className="flex gap-2">
              <Button
                icon="pi pi-eye"
                size="small"
                severity="success"
                tooltip="Lihat Detail"
                onClick={() => onView(rowData)}
              />

              <Button
                icon="pi pi-pencil"
                size="small"
                severity="warning"
                tooltip="Ubah Sesi"
                onClick={() => onEdit(rowData)}
              />

              <Button
                icon={isClosed ? "pi pi-trash" : "pi pi-lock"}
                size="small"
                severity={isClosed ? "danger" : "info"}
                tooltip={isClosed ? "Hapus Sesi" : "Tutup Sesi"}
                onClick={() => {
                  if (isClosed) {
                    onDelete(rowData);
                  } else {
                    onClose(rowData);
                  }
                }}
              />
            </div>
          );
        }}
      />
    </DataTable>
  );
}
