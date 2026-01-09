import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useFetchPosition } from "../hooks/useFetchPosition";
import { useEffect } from "react";

// Define option types
interface OptionType {
  label: string;
  value: string;
}

interface PositionFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;

  selectedOffice: string | null | undefined;
  onOfficeChange: (value: string | null) => void;
  officeOptions: OptionType[];

  selectedDepartment: string | null | undefined;
  onDepartmentChange: (value: string | null) => void;

  selectedDivision: string | null | undefined;
  onDivisionChange: (value: string | null) => void;

  selectedScope: string | null | undefined;
  onScopeChange: (value: string | null) => void;
}

// Hardcoded Scope Options
const scopeOptions: OptionType[] = [
  { label: "Semua", value: "" },
  { label: "Staff Reguler", value: "staff" },
  { label: "Kepala Kantor", value: "office_lead" },
  { label: "Kepala Departemen", value: "department_lead" },
  { label: "Kepala Divisi", value: "division_lead" },
];

export default function PositionFilterDialog({
  isOpen,
  onClose,

  selectedOffice,
  onOfficeChange,
  officeOptions,

  selectedDepartment,
  onDepartmentChange,

  selectedDivision,
  onDivisionChange,

  selectedScope,
  onScopeChange,
}: PositionFilterDialogProps) {
  const {
    departmentOptions,
    divisionOptions,
    fetchDepartmentOptions,
    fetchDivisionOptions,
    clearDepartmentOptions,
    clearDivisionOptions,
    isOptionsDepartmentLoading,
    isOptionsDivisionLoading,
  } = useFetchPosition();

  useEffect(() => {
    if (isOpen) {
      if (selectedOffice) {
        fetchDepartmentOptions(selectedOffice);
      } else {
        clearDepartmentOptions();
      }

      if (selectedOffice && selectedDepartment) {
        fetchDivisionOptions(selectedOffice, selectedDepartment);
      } else {
        clearDivisionOptions();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedOffice, selectedDepartment]);

  const handleOfficeChange = (val: string | null) => {
    onOfficeChange(val);
    onDepartmentChange(null);
    onDivisionChange(null);

    if (val) {
      fetchDepartmentOptions(val);
      clearDivisionOptions();
    } else {
      clearDepartmentOptions();
      clearDivisionOptions();
    }
  };

  const handleDepartmentChange = (val: string | null) => {
    onDepartmentChange(val);
    onDivisionChange(null);

    if (selectedOffice && val) {
      fetchDivisionOptions(selectedOffice, val);
    } else {
      clearDivisionOptions();
    }
  };

  const isDepartmentDisabled = !selectedOffice;
  const isDivisionDisabled = !selectedDepartment;

  const handleReset = () => {
    onOfficeChange(null);
    onDepartmentChange(null);
    onDivisionChange(null);
    onScopeChange(null);
    clearDepartmentOptions();
    clearDivisionOptions();
  };

  return (
    <Dialog
      header="Filter Jabatan"
      visible={isOpen}
      style={{ width: "450px" }}
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
        {/* --- Scope Filter (New) --- */}
        <div className="flex flex-column gap-2">
          <label htmlFor="scope-filter" className="font-semibold">
            Jenis Jabatan (Scope)
          </label>
          <Dropdown
            id="scope-filter"
            value={selectedScope}
            options={scopeOptions}
            onChange={(e) => onScopeChange(e.value)}
            placeholder="Pilih Scope Jabatan"
            className="w-full"
            showClear
            optionLabel="label"
            optionValue="value"
          />
        </div>

        {/* --- Level 1: Office --- */}
        <div className="flex flex-column gap-2">
          <label htmlFor="office-filter" className="font-semibold">
            Kantor
          </label>
          <Dropdown
            id="office-filter"
            value={selectedOffice}
            options={officeOptions}
            onChange={(e) => handleOfficeChange(e.value)}
            placeholder="Pilih Kantor"
            className="w-full"
            showClear
            filter
            optionLabel="label"
            optionValue="value"
          />
        </div>

        {/* --- Level 2: Department --- */}
        <div className="flex flex-column gap-2">
          <label htmlFor="dept-filter" className="font-semibold">
            Departemen
          </label>
          <Dropdown
            id="dept-filter"
            value={selectedDepartment}
            options={departmentOptions}
            onChange={(e) => handleDepartmentChange(e.value)}
            disabled={isDepartmentDisabled || isOptionsDepartmentLoading}
            loading={isOptionsDepartmentLoading}
            placeholder={
              isDepartmentDisabled
                ? "Pilih Kantor Terlebih Dahulu"
                : isOptionsDepartmentLoading
                  ? "Memuat Departemen..."
                  : "Pilih Departemen"
            }
            className="w-full"
            showClear={!isDepartmentDisabled}
            filter={!isDepartmentDisabled}
            emptyMessage="Tidak ada departemen untuk kantor ini"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        {/* --- Level 3: Division --- */}
        <div className="flex flex-column gap-2">
          <label htmlFor="div-filter" className="font-semibold">
            Divisi
          </label>
          <Dropdown
            id="div-filter"
            value={selectedDivision}
            options={divisionOptions}
            onChange={(e) => onDivisionChange(e.value)}
            disabled={isDivisionDisabled || isOptionsDivisionLoading}
            loading={isOptionsDivisionLoading}
            placeholder={
              isDivisionDisabled
                ? "Pilih Departemen Terlebih Dahulu"
                : isOptionsDivisionLoading
                  ? "Memuat Divisi..."
                  : "Pilih Divisi"
            }
            className="w-full"
            showClear={!isDivisionDisabled}
            filter={!isDivisionDisabled}
            emptyMessage="Tidak ada divisi untuk departemen ini"
            optionLabel="label"
            optionValue="value"
          />
          <small className="text-gray-500">
            {isDivisionDisabled
              ? "Urutan Filter: Kantor > Departemen > Divisi"
              : "Menampilkan divisi sesuai departemen yang dipilih."}
          </small>
        </div>
      </div>
    </Dialog>
  );
}
