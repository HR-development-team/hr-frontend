"use client";

import { DataTableManagementPropsTypes } from "@/lib/types/dataTable/dataTableManagementPropsType";
import { GetAllRoleData } from "@/lib/types/role";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";

export default function DataTableRole({
  data,
  isLoading,
  // lazyParams,
  // totalItems,
  // onPageChange,
  onSetting,
  onEdit,
  onDelete,
}: DataTableManagementPropsTypes<GetAllRoleData>) {
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
      <Column field="role_code" header="Kode Role" style={{ width: "25%" }} />
      <Column field="name" header="Nama" style={{ width: "25%" }} />
      <Column
        header="Aksi"
        body={(row: GetAllRoleData) => (
          <div className="flex gap-2">
            <Button
              icon="pi pi-cog text-sm"
              size="small"
              severity="success"
              onClick={() => {
                onSetting(row);
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
