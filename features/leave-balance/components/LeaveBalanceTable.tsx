"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { LeaveBalance } from "../schemas/leaveBalanceSchema";

export interface LeaveBalanceTableProps {
  data: LeaveBalance[];
  isLoading: boolean;
  onEdit: (row: LeaveBalance) => void;
  onDelete: (row: LeaveBalance) => void;
}

export default function LeaveBalanceTable({
  data,
  isLoading,
  onEdit,
  onDelete,
}: LeaveBalanceTableProps) {
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // Helper to handle loading state on buttons for a split second
  const handleAction = (action: () => void, id: number) => {
    setActionLoadingId(id);
    // Small delay to prevent UI jumpiness
    setTimeout(() => {
      action();
      setActionLoadingId(null);
    }, 100);
  };

  // --- Templates ---

  const employeeBodyTemplate = (rowData: LeaveBalance) => {
    return (
      <div className="flex flex-column">
        <span className="font-medium text-gray-900">
          {rowData.employee_name || "-"}
        </span>
        <span className="text-xs text-gray-500">{rowData.employee_code}</span>
      </div>
    );
  };

  const leaveTypeBodyTemplate = (rowData: LeaveBalance) => {
    return (
      <div className="flex flex-column">
        <span className="font-medium text-gray-800">
          {rowData.leave_type_name || rowData.type_code}
        </span>
        <span className="text-xs text-gray-500">
          {rowData.leave_type_name ? rowData.type_code : ""}
        </span>
      </div>
    );
  };

  const balanceBodyTemplate = (rowData: LeaveBalance) => {
    // Color coding based on balance amount
    const severity =
      rowData.balance > 5
        ? "success"
        : rowData.balance > 0
          ? "warning"
          : "danger";

    return (
      <Tag
        value={rowData.balance}
        severity={severity}
        className="px-3 text-sm font-bold"
        rounded
      />
    );
  };

  const actionBodyTemplate = (rowData: LeaveBalance) => {
    const isProcessing = actionLoadingId === rowData.id;

    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil text-sm"
          size="small"
          severity="warning"
          tooltip="Edit Saldo"
          disabled={isProcessing}
          onClick={() => handleAction(() => onEdit(rowData), rowData.id)}
        />
        <Button
          icon="pi pi-trash text-sm"
          size="small"
          severity="danger"
          tooltip="Hapus Saldo"
          disabled={isProcessing}
          onClick={() => onDelete(rowData)}
        />
      </div>
    );
  };

  return (
    <DataTable
      value={data}
      loading={isLoading}
      paginator
      rows={10}
      rowsPerPageOptions={[10, 25, 50]}
      className="border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden"
      emptyMessage="Tidak ada data saldo cuti"
      size="small"
      stripedRows
      removableSort
    >
      <Column
        field="employee_name"
        header="Karyawan"
        body={employeeBodyTemplate}
        sortable
        style={{ minWidth: "200px" }}
      />
      <Column
        field="type_code"
        header="Tipe Cuti"
        body={leaveTypeBodyTemplate}
        sortable
        style={{ minWidth: "180px" }}
      />
      <Column
        field="year"
        header="Tahun"
        sortable
        align="center"
        style={{ width: "100px" }}
      />
      <Column
        field="balance"
        header="Sisa Saldo"
        body={balanceBodyTemplate}
        sortable
        align="center"
        style={{ width: "120px" }}
      />
      <Column
        header="Aksi"
        body={actionBodyTemplate}
        align="center"
        style={{ width: "100px" }}
      />
    </DataTable>
  );
}
