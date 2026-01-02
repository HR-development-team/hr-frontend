import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

// Define option types
interface OptionType {
  label: string;
  value: string;
}

interface ShiftFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;

  selectedOffice: string | null | undefined;
  onOfficeChange: (value: string | null) => void;
  officeOptions: OptionType[];
}

export default function ShiftFilterDialog({
  isOpen,
  onClose,
  selectedOffice,
  onOfficeChange,
  officeOptions,
}: ShiftFilterDialogProps) {
  const handleReset = () => {
    onOfficeChange(null);
  };

  return (
    <Dialog
      header="Filter Shift"
      visible={isOpen}
      style={{ width: "400px" }}
      modal
      onHide={onClose}
      footer={
        <div className="flex justify-content-end gap-2">
          <Button
            label="Reset"
            icon="pi pi-refresh"
            text
            onClick={handleReset}
            className="p-button-secondary gap-1"
          />
          <Button
            label="Terapkan"
            icon="pi pi-check"
            onClick={onClose}
            className="gap-1"
            autoFocus
          />
        </div>
      }
    >
      <div className="flex flex-column gap-4">
        {/* --- Level 1: Office Only --- */}
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
            optionLabel="label"
            optionValue="value"
            emptyMessage="Tidak ada data kantor"
          />
          <small className="text-gray-500">
            Menampilkan data shift berdasarkan kantor yang dipilih.
          </small>
        </div>
      </div>
    </Dialog>
  );
}
