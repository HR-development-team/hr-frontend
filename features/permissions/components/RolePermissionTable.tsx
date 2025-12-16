"use client";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputSwitch } from "primereact/inputswitch";
import { FeaturePermission } from "../schemas/permissionSchema"; // Updated import to schema

interface RolePermissionTableProps {
  permissionsList: FeaturePermission[];
  isLoading: boolean;
  roleName: string;
  onPermissionChange: (
    featureCode: string,
    field: keyof FeaturePermission,
    value: boolean
  ) => void;
}

export default function RolePermissionTable({
  permissionsList,
  isLoading,
  roleName,
  onPermissionChange,
}: RolePermissionTableProps) {
  /**
   * Reusable render function for the Toggles
   */
  const toggleBodyTemplate = (
    rowData: FeaturePermission,
    field: keyof FeaturePermission
  ) => {
    const isPermitted = rowData[field] === 1;

    return (
      <div className="flex justify-content-center">
        <InputSwitch
          checked={isPermitted}
          disabled={isLoading}
          onChange={(e) =>
            onPermissionChange(rowData.feature_code, field, e.value as boolean)
          }
          tooltip={isPermitted ? "Aktif" : "Nonaktif"}
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  return (
    <DataTable
      value={permissionsList}
      loading={isLoading}
      className="border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden"
      showGridlines
      stripedRows
      emptyMessage={`Belum ada data permission untuk role ${roleName}`}
    >
      {/* Feature Name Column (Frozen/Sticky on left) */}
      <Column
        field="feature_name"
        header="Nama Fitur"
        style={{ minWidth: "200px" }}
        frozen
        className="font-semibold"
      />

      {/* Permission Columns - No need for separate variables */}
      <Column
        header="Buat (Create)"
        body={(row) => toggleBodyTemplate(row, "can_create")}
        style={{ width: "12%", textAlign: "center" }}
        alignHeader="center"
      />
      <Column
        header="Baca (Read)"
        body={(row) => toggleBodyTemplate(row, "can_read")}
        style={{ width: "12%", textAlign: "center" }}
        alignHeader="center"
      />
      <Column
        header="Ubah (Update)"
        body={(row) => toggleBodyTemplate(row, "can_update")}
        style={{ width: "12%", textAlign: "center" }}
        alignHeader="center"
      />
      <Column
        header="Hapus (Delete)"
        body={(row) => toggleBodyTemplate(row, "can_delete")}
        style={{ width: "12%", textAlign: "center" }}
        alignHeader="center"
      />
      <Column
        header="Cetak (Print)"
        body={(row) => toggleBodyTemplate(row, "can_print")}
        style={{ width: "12%", textAlign: "center" }}
        alignHeader="center"
      />
    </DataTable>
  );
}
