"use client";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import React, { useState } from "react";
import { GetAllEmployeeData } from "@/lib/types/employee";
import { DataTableEmployeesProp } from "@/lib/types/dataTable/dataTableEmployeeType";

export default function DataTableEmployees({
  employees,
  isLoading,
  // lazyParams,
  // totalItems,
  // onPageChange,
  onView,
  onEdit,
  onDelete,
}: DataTableEmployeesProp) {
  const newLocal =
    "border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden";

  const statusBodyTemplate = (rowData: GetAllEmployeeData) => {
    const severity =
      rowData.employment_status === "aktif" ? "success" : "danger";

    const firstCharUppercase = rowData.employment_status
      .charAt(0)
      .toUpperCase();

    const restOfString = rowData.employment_status.slice(1);

    return (
      <Tag value={firstCharUppercase + restOfString} severity={severity} />
    );
  };

  const joinDateBodyTemplate = (rowData: GetAllEmployeeData) => {
    const dateObject = new Date(rowData.join_date);
    return dateObject.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <DataTable
      value={employees}
      loading={isLoading}
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 25, 50]}
      className={newLocal}
      // style={{ minWidth: "50rem" }}
    >
      <Column
        field="employee_code"
        header="Kode karyawan"
        style={{ width: "25%" }}
      />
      <Column
        field="full_name"
        header="Nama Lengkap"
        style={{ width: "25%" }}
      />
      <Column
        field="join_date"
        header="Bergabung Pada"
        body={joinDateBodyTemplate}
        style={{ width: "25%" }}
      />

      <Column
        field="employment_status"
        header="Status"
        body={statusBodyTemplate}
        style={{ width: "25%" }}
      />
      <Column
        field="position_name"
        header="Nama Posisi"
        style={{ width: "25%" }}
      />
      <Column
        header="Aksi"
        body={(row: GetAllEmployeeData) => (
          <div className="flex gap-2">
            <Button
              icon="pi pi-eye text sm"
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
