"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Role } from "../schemas/roleSchema";

export interface RoleTableProps {
  data: Role[];
  isLoading: boolean;
  onSetting: (row: Role) => void;
  onEdit: (row: Role) => void;
  onDelete: (row: Role) => void;
}

export default function RoleTable({
  data,
  isLoading,
  onSetting,
  onEdit,
  onDelete,
}: RoleTableProps) {
  const [navigatingId, setNavigatingId] = useState<number | null>(null);

  const handleSettingClick = (row: Role) => {
    setNavigatingId(row.id);

    setTimeout(() => {
      onSetting(row);
    }, 0);
  };

  return (
    <DataTable
      value={data}
      loading={isLoading}
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 25, 50]}
      className="border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden"
    >
      <Column field="role_code" header="Kode Role" style={{ width: "25%" }} />
      <Column field="name" header="Nama" style={{ width: "25%" }} />

      <Column
        header="Aksi"
        style={{ width: "25%" }}
        body={(row: Role) => (
          <div className="flex gap-2">
            {/* Setting Permission Button */}
            <Button
              icon="pi pi-cog text-sm"
              size="small"
              severity="success"
              loading={navigatingId === row.id}
              onClick={() => handleSettingClick(row)}
            />

            {/* Edit Button */}
            <Button
              icon="pi pi-pencil text-sm"
              size="small"
              severity="warning"
              onClick={() => onEdit(row)}
              disabled={navigatingId !== null}
            />

            {/* Delete Button */}
            <Button
              icon="pi pi-trash text-sm"
              size="small"
              severity="danger"
              onClick={() => onDelete(row)}
              disabled={navigatingId !== null}
            />
          </div>
        )}
      />
    </DataTable>
  );
}
