import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

interface Option {
  label: string;
  value: string;
}

interface DepartmentFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOffice: string | null | undefined;
  onOfficeChange: (value: string) => void;
  officeOptions: Option[];
}

export default function DepartmentFilterDialog({
  isOpen,
  onClose,
  selectedOffice,
  onOfficeChange,
  officeOptions,
}: DepartmentFilterDialogProps) {
  return (
    <Dialog
      header="Filter Departemen"
      visible={isOpen}
      style={{ width: "400px" }}
      modal
      onHide={onClose}
    >
      <div className="flex flex-column gap-2">
        <label htmlFor="office-filter" className="font-semibold">
          Kantor
        </label>
        <Dropdown
          id="office-filter"
          value={selectedOffice}
          options={officeOptions}
          onChange={(e) => onOfficeChange(e.value)}
          placeholder="Pilih Kantor"
          className="w-full"
          showClear
          filter
        />
        <small className="text-gray-500">
          Pilih kantor untuk menyaring daftar departemen.
        </small>
      </div>
    </Dialog>
  );
}
