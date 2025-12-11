import { FeaturePermission } from "@/lib/types/permission";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputSwitch } from "primereact/inputswitch";

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
  onPermissionChange,
}: RolePermissionTableProps) {
  const renderPermissionToggle = (
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
        />
      </div>
    );
  };

  // Body Templates for DataTable columns
  const readBodyTemplate = (rowData: FeaturePermission) =>
    renderPermissionToggle(rowData, "can_read");
  const createBodyTemplate = (rowData: FeaturePermission) =>
    renderPermissionToggle(rowData, "can_create");
  const updateBodyTemplate = (rowData: FeaturePermission) =>
    renderPermissionToggle(rowData, "can_update");
  const deleteBodyTemplate = (rowData: FeaturePermission) =>
    renderPermissionToggle(rowData, "can_delete");
  const printBodyTemplate = (rowData: FeaturePermission) =>
    renderPermissionToggle(rowData, "can_print");

  const newLocal =
    "border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden";

  return (
    <DataTable value={permissionsList} loading={isLoading} className={newLocal}>
      {/* Feature Name Column */}
      <Column
        field="feature_name"
        header="Nama Fitur"
        style={{ width: "20%" }}
      />

      {/* Permission Columns */}
      <Column
        header="Buat (Create)"
        body={createBodyTemplate}
        className="text-center"
        style={{ width: "14%" }}
      />
      <Column
        header="Baca (Read)"
        body={readBodyTemplate}
        className="text-center"
        style={{ width: "14%" }}
      />
      <Column
        header="Ubah (Update)"
        body={updateBodyTemplate}
        className="text-center"
        style={{ width: "14%" }}
      />
      <Column
        header="Hapus (Delete)"
        body={deleteBodyTemplate}
        className="text-center"
        style={{ width: "14%" }}
      />
      <Column
        header="Cetak (Print)"
        body={printBodyTemplate}
        className="text-center"
        style={{ width: "14%" }}
      />
    </DataTable>
  );
}
