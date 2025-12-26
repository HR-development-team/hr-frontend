import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

interface OfficeOption {
  label: string;
  value: string;
}

interface DepartmentOption {
  label: string;
  value: string;
}

interface DivisionFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOffice: string | null | undefined;
  onOfficeChange: (value: string | null) => void;
  officeOptions: OfficeOption[];

  selectedDepartment: string | null | undefined;
  onDepartmentChange: (value: string | null) => void;
  departmentOptions: DepartmentOption[];

  isLoadingDepartment?: boolean;
}

export default function DivisionFilterDialog({
  isOpen,
  onClose,
  selectedOffice,
  onOfficeChange,
  officeOptions,
  selectedDepartment,
  onDepartmentChange,
  departmentOptions,
  isLoadingDepartment = false,
}: DivisionFilterDialogProps) {
  // Logic: Disable department if no office is selected
  const isDepartmentDisabled = !selectedOffice;

  const handleReset = () => {
    onOfficeChange(null);
    onDepartmentChange(null);
  };

  const footerContent = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Reset"
        icon="pi pi-refresh"
        text
        onClick={handleReset}
        className="p-button-secondary gap-1"
      />
      <Button
        className="gap-1"
        label="Terapkan"
        icon="pi pi-check"
        onClick={onClose}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header="Filter Divisi"
      visible={isOpen}
      style={{ width: "400px" }}
      modal
      onHide={onClose}
      footer={footerContent}
    >
      <div className="flex flex-column gap-4">
        {/* Filter 1: Office */}
        <div className="flex flex-column gap-2">
          <label htmlFor="office-filter" className="font-semibold">
            Kantor
          </label>
          <Dropdown
            id="office-filter"
            value={selectedOffice}
            options={officeOptions}
            onChange={(e) => {
              onOfficeChange(e.value);
              onDepartmentChange(null);
            }}
            placeholder="Pilih Kantor"
            className="w-full"
            showClear
            filter
          />
        </div>

        {/* Filter 2: Department */}
        <div className="flex flex-column gap-2">
          <label htmlFor="dept-filter" className="font-semibold">
            Departemen
          </label>
          <Dropdown
            id="dept-filter"
            value={selectedDepartment}
            options={departmentOptions}
            onChange={(e) => onDepartmentChange(e.value)}
            disabled={isDepartmentDisabled}
            loading={isLoadingDepartment}
            placeholder={
              isDepartmentDisabled
                ? "Pilih Kantor Terlebih Dahulu"
                : isLoadingDepartment
                  ? "Memuat data..."
                  : "Pilih Departemen"
            }
            className="w-full"
            showClear={!isDepartmentDisabled}
            filter={!isDepartmentDisabled}
            emptyMessage="Tidak ada departemen untuk kantor ini"
          />
          <small className="text-gray-500">
            {isDepartmentDisabled
              ? "Anda harus memilih kantor sebelum memilih departemen."
              : "Menampilkan departemen sesuai kantor yang dipilih."}
          </small>
        </div>
      </div>
    </Dialog>
  );
}
