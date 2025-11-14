"use client";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import React from "react";
import { GetAllLeaveTypeData } from "@/lib/types/leaveType";
import { formatRupiah } from "@/lib/utils/formatRupiah";
import { DataTableLeaveTypeProp } from "@/lib/types/dataTable/dataTableLeaveTypesType";

export default function DataTableLeaveType({
  leaveType,
  isLoading,
  // lazyParams,
  // totalItems,
  // onPageChange,
  onView,
  onEdit,
  onDelete,
}: DataTableLeaveTypeProp) {
  const newLocal =
    "border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden";

  const statusBodyTemplate = (rowData: any) => {
    const severity = rowData.status === "Aktif" ? "success" : "danger";

    return <Tag value={rowData.status} severity={severity} />;
  };

  return (
    <DataTable
      value={leaveType}
      loading={isLoading}
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 25, 50]}
      className={newLocal}
    >
      <Column field="type_code" header="Kode" style={{ width: "25%" }} />
      <Column field="name" header="Tipe Cuti" style={{ width: "25%" }} />
      <Column
        field="deduction"
        header="Pengurangan Gaji"
        body={(row: GetAllLeaveTypeData) => formatRupiah(row.deduction)}
        style={{ width: "25%" }}
      />
      <Column
        header="Aksi"
        body={(row: GetAllLeaveTypeData) => (
          <div className="flex gap-2">
            <Button
              icon="pi pi-eye text-sm"
              size="small"
              severity="success"
              onClick={() => {
                onView(row);
              }}
            />

            <Button
              icon="pi pi-pencil text-sm"
              size="small"
              severity="warning"
              onClick={() => {
                onEdit(row);
              }}
            />

            <Button
              icon="pi pi-trash text-sm"
              size="small"
              severity="danger"
              onClick={() => {
                onDelete(row);
              }}
            />
          </div>
        )}
        style={{ width: "25%" }}
      />
    </DataTable>
  );
}
