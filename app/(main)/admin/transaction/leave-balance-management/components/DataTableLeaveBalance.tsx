"use client";

import { DataTableLeaveBalanceProps } from "@/lib/types/dataTable/dataTableLeaveBalanceType";
import { GetAllLeaveBalanceData } from "@/lib/types/leaveBalance";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function DataTableLeaveBalance({
  data,
  isLoading,
  onEdit,
  onDelete,
}: DataTableLeaveBalanceProps) {
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
      <Column
        field="balance_code"
        header="Kode Saldo"
        style={{ width: "25%" }}
      />
      <Column field="balance" header="Jumlah Saldo" style={{ width: "25%" }} />
      <Column
        field="year"
        header="Tahun"
        // body={joinDateBodyTemplate}
        style={{ width: "25%" }}
      />

      <Column
        field="employee_name"
        header="Nama Karyawan"
        // body={statusBodyTemplate}
        style={{ width: "25%" }}
      />
      <Column
        field="leave_type_name"
        header="Tipe Cuti"
        style={{ width: "25%" }}
      />
      <Column
        header="Aksi"
        body={(row: GetAllLeaveBalanceData) => (
          <div className="flex gap-2">
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
