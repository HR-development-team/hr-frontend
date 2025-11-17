"use client";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { formatRupiah } from "@/lib/utils/formatRupiah";
import { GetAllPositionData } from "@/lib/types/position";
import { DataTableMasterPropsTypes } from "@/lib/types/dataTable/dataTableMasterPropsType";

export default function DataTablePosition({
  data,
  isLoading,
  // lazyParams,
  // totalItems,
  // onPageChange,
  onEdit,
  onDelete,
  onView,
}: DataTableMasterPropsTypes<GetAllPositionData>) {
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
      <Column field="position_code" header="Kode" style={{ width: "25%" }} />
      <Column field="name" header="Nama Posisi" style={{ width: "25%" }} />
      <Column
        field="base_salary"
        header="Gaji Pokok"
        body={(row: GetAllPositionData) => formatRupiah(row.base_salary)}
        style={{ width: "25%" }}
      />
      <Column
        field="division_name"
        header="Nama Divisi"
        style={{ width: "25%" }}
      />
      <Column
        field="department_name"
        header="Nama Departemen"
        style={{ width: "25%" }}
      />
      <Column
        header="Aksi"
        body={(row: GetAllPositionData) => (
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
