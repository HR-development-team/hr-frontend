import { useMemo } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

interface OfficeOption {
  label: string;
  value: string;
}

interface DepartmentOption {
  label: string;
  value: string;
  office_code: string;
}

interface DivisionFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;

  // Office Filter Props
  selectedOffice: string | null | undefined;
  onOfficeChange: (value: string) => void;
  officeOptions: OfficeOption[];

  // Department Filter Props
  selectedDepartment: string | null | undefined;
  onDepartmentChange: (value: string) => void;
  departmentOptions: DepartmentOption[];
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
}: DivisionFilterDialogProps) {
  // Logic: Only show departments that belong to the selected office
  const filteredDepartmentOptions = useMemo(() => {
    if (!selectedOffice) {
      return departmentOptions;
    }
    return departmentOptions.filter(
      (dept) => dept.office_code === selectedOffice
    );
  }, [selectedOffice, departmentOptions]);

  return (
    <Dialog
      header="Filter Divisi"
      visible={isOpen}
      style={{ width: "400px" }}
      modal
      onHide={onClose}
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
              // Optional: Reset department when office changes if you want strict consistency
              // onDepartmentChange("");
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
            options={filteredDepartmentOptions}
            onChange={(e) => onDepartmentChange(e.value)}
            placeholder={
              selectedOffice
                ? "Pilih Departemen"
                : "Pilih Departemen (Semua Kantor)"
            }
            className="w-full"
            showClear
            filter
            // Disable department selection if there are no options available for the selected office
            disabled={
              !!selectedOffice && filteredDepartmentOptions.length === 0
            }
          />
          <small className="text-gray-500">
            {selectedOffice
              ? "Menampilkan departemen untuk kantor yang dipilih."
              : "Pilih kantor terlebih dahulu untuk menyaring departemen."}
          </small>
        </div>
      </div>
    </Dialog>
  );
}
