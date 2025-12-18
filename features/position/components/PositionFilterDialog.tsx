import { useMemo } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

// Define option types with relation keys
interface OfficeOption {
  label: string;
  value: string;
}

interface DepartmentOption {
  label: string;
  value: string;
  office_code: string; // Relates to Office
}

interface DivisionOption {
  label: string;
  value: string;
  department_code: string; // Relates to Department
}

interface PositionFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;

  // Level 1: Office
  selectedOffice: string | null | undefined;
  onOfficeChange: (value: string) => void;
  officeOptions: OfficeOption[];

  // Level 2: Department
  selectedDepartment: string | null | undefined;
  onDepartmentChange: (value: string) => void;
  departmentOptions: DepartmentOption[];

  // Level 3: Division
  selectedDivision: string | null | undefined;
  onDivisionChange: (value: string) => void;
  divisionOptions: DivisionOption[];
}

export default function PositionFilterDialog({
  isOpen,
  onClose,

  selectedOffice,
  onOfficeChange,
  officeOptions,

  selectedDepartment,
  onDepartmentChange,
  departmentOptions,

  selectedDivision,
  onDivisionChange,
  divisionOptions,
}: PositionFilterDialogProps) {
  // 1. Filter Departments based on selected Office
  const filteredDepartmentOptions = useMemo(() => {
    if (!selectedOffice) return departmentOptions;
    return departmentOptions.filter(
      (dept) => dept.office_code === selectedOffice
    );
  }, [selectedOffice, departmentOptions]);

  // 2. Filter Divisions based on selected Department
  const filteredDivisionOptions = useMemo(() => {
    if (!selectedDepartment) {
      // Optional: If no department selected, you might want to hide divisions or show all
      // belonging to the selected office. Usually, strict hierarchy is cleaner.
      return [];
    }
    return divisionOptions.filter(
      (div) => div.department_code === selectedDepartment
    );
  }, [selectedDepartment, divisionOptions]);

  const renderFooter = (
    <div>
      <Button
        label="Tutup"
        icon="pi pi-times"
        onClick={onClose}
        className="p-button-text gap-1"
      />
      <Button
        label="Selesai"
        icon="pi pi-check"
        onClick={onClose}
        className="gap-1"
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header="Filter Jabatan"
      visible={isOpen}
      style={{ width: "450px" }} // Slightly wider for 3 levels
      modal
      onHide={onClose}
      footer={renderFooter}
    >
      <div className="flex flex-column gap-4">
        {/* Level 1: Office */}
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
              // Reset children on parent change to maintain consistency
              // onDepartmentChange("");
              // onDivisionChange("");
            }}
            placeholder="Pilih Kantor"
            className="w-full"
            showClear
            filter
          />
        </div>

        {/* Level 2: Department */}
        <div className="flex flex-column gap-2">
          <label htmlFor="dept-filter" className="font-semibold">
            Departemen
          </label>
          <Dropdown
            id="dept-filter"
            value={selectedDepartment}
            options={filteredDepartmentOptions}
            onChange={(e) => {
              onDepartmentChange(e.value);
              // Reset child
              // onDivisionChange("");
            }}
            placeholder={
              selectedOffice
                ? "Pilih Departemen"
                : "Pilih Kantor Terlebih Dahulu"
            }
            className="w-full"
            showClear
            filter
            disabled={!selectedOffice || filteredDepartmentOptions.length === 0}
          />
        </div>

        {/* Level 3: Division */}
        <div className="flex flex-column gap-2">
          <label htmlFor="div-filter" className="font-semibold">
            Divisi
          </label>
          <Dropdown
            id="div-filter"
            value={selectedDivision}
            options={filteredDivisionOptions}
            onChange={(e) => onDivisionChange(e.value)}
            placeholder={
              selectedDepartment
                ? "Pilih Divisi"
                : "Pilih Departemen Terlebih Dahulu"
            }
            className="w-full"
            showClear
            filter
            disabled={
              !selectedDepartment || filteredDivisionOptions.length === 0
            }
          />
          <small className="text-gray-500">
            Filter berdasarkan struktur organisasi lengkap.
          </small>
        </div>
      </div>
    </Dialog>
  );
}
