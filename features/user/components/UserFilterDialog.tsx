import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { useFetchUser } from "../hooks/useFetchUser";
import { useEffect } from "react";

interface UserFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: string | null;
  onRoleChange: (value: string | null) => void;
}

export default function UserFilterDialog({
  isOpen,
  onClose,
  selectedRole,
  onRoleChange,
}: UserFilterDialogProps) {
  const { roleOptions, fetchRoleOptions } = useFetchUser();

  useEffect(() => {
    if (isOpen) {
      fetchRoleOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Dialog
      header="Filter User"
      visible={isOpen}
      style={{ width: "400px" }}
      modal
      onHide={onClose}
    >
      <div className="flex flex-column gap-2">
        <label htmlFor="role-filter" className="font-semibold">
          Role
        </label>
        <Dropdown
          id="role-filter"
          value={selectedRole}
          options={roleOptions}
          onChange={(e) => onRoleChange(e.value)}
          placeholder="Pilih Role"
          className="w-full"
          showClear
          filter
          // Explicitly define label/value fields to be safe
          optionLabel="label"
          optionValue="value"
        />
        <small className="text-gray-500">
          Pilih role untuk menyaring daftar user.
        </small>
      </div>
    </Dialog>
  );
}
