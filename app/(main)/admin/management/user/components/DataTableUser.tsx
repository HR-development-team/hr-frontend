"use client";

import { DataTableMasterPropsTypes } from "@/lib/types/dataTable/dataTableMasterPropsType";
import { GetAllUserData } from "@/lib/types/user";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";

export default function DataTableUser({
  data,
  isLoading,
  // lazyParams,
  // totalItems,
  // onPageChange,
  onView,
  onEdit,
  onDelete,
}: DataTableMasterPropsTypes<GetAllUserData>) {
  const newLocal =
    "border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden";

  return (
    <DataTable
      value={data}
      loading={isLoading}
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 25, 50]}
      className={newLocal}
    >
      <Column field="user_code" header="Kode User" style={{ width: "25%" }} />
      <Column field="email" header="Email" style={{ width: "25%" }} />
      <Column
        field="employee_name"
        header="Nama Karyawan"
        style={{ width: "25%" }}
      />
      <Column field="role" header="Role User" style={{ width: "25%" }} />
      <Column
        header="Aksi"
        body={(row: GetAllUserData) => (
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
