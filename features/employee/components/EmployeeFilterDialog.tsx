"use client";

import { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useFetchEmployee } from "../hooks/useFetchEmployee";

interface OptionType {
  label: string;
  value: string;
}

interface EmployeeFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;

  selectedOffice: string | null | undefined;
  onOfficeChange: (value: string | null) => void;
  officeOptions: OptionType[];

  selectedDepartment: string | null | undefined;
  onDepartmentChange: (value: string | null) => void;

  selectedDivision: string | null | undefined;
  onDivisionChange: (value: string | null) => void;

  selectedPosition: string | null | undefined;
  onPositionChange: (value: string | null) => void;
}

export default function EmployeeFilterDialog({
  isOpen,
  onClose,

  selectedOffice,
  onOfficeChange,
  officeOptions,

  selectedDepartment,
  onDepartmentChange,

  selectedDivision,
  onDivisionChange,

  selectedPosition,
  onPositionChange,
}: EmployeeFilterDialogProps) {
  const {
    departmentOptions,
    divisionOptions,
    positionOptions,

    fetchDepartmentOptions,
    fetchDivisionOptions,
    fetchPositionOptions,

    clearDepartmentOptions,
    clearDivisionOptions,
    clearPositionOptions,

    isOptionsDepartmentLoading,
    isOptionsDivisionLoading,
    isOptionsPositionLoading,
  } = useFetchEmployee();

  // 1. Sync State (Hydration)
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

      if (selectedOffice && selectedDepartment && selectedDivision) {
        fetchPositionOptions(
          selectedOffice,
          selectedDepartment,
          selectedDivision
        );
      } else {
        clearPositionOptions();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 2. Handlers with Correct API Arguments

  const handleOfficeChange = (val: string | null) => {
    onOfficeChange(val);
    onDepartmentChange(null);
    onDivisionChange(null);
    onPositionChange(null);

    if (val) {
      fetchDepartmentOptions(val);
      clearDivisionOptions();
      clearPositionOptions();
    } else {
      clearDepartmentOptions();
      clearDivisionOptions();
      clearPositionOptions();
    }
  };

  const handleDepartmentChange = (val: string | null) => {
    onDepartmentChange(val);
    onDivisionChange(null);
    onPositionChange(null);

    // [FIX]: Pass 'selectedOffice' AND 'val' (current department)
    if (selectedOffice && val) {
      fetchDivisionOptions(selectedOffice, val);
      clearPositionOptions();
    } else {
      clearDivisionOptions();
      clearPositionOptions();
    }
  };

  const handleDivisionChange = (val: string | null) => {
    onDivisionChange(val);
    onPositionChange(null);

    // [FIX]: Pass 'selectedOffice', 'selectedDepartment', AND 'val' (current division)
    if (selectedOffice && selectedDepartment && val) {
      fetchPositionOptions(selectedOffice, selectedDepartment, val);
    } else {
      clearPositionOptions();
    }
  };

  const handleReset = () => {
    onOfficeChange(null);
    onDepartmentChange(null);
    onDivisionChange(null);
    onPositionChange(null);

    clearDepartmentOptions();
    clearDivisionOptions();
    clearPositionOptions();
  };

  const isDepartmentDisabled = !selectedOffice;
  const isDivisionDisabled = !selectedDepartment;
  const isPositionDisabled = !selectedDivision;

  return (
    <Dialog
      header="Filter Karyawan"
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
        {/* --- Level 1: Office --- */}
        <div className="flex flex-column gap-2">
          <label htmlFor="office-filter" className="font-semibold">
            1. Kantor
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
            2. Departemen
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
            emptyMessage="Tidak ada departemen"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        {/* --- Level 3: Division --- */}
        <div className="flex flex-column gap-2">
          <label htmlFor="div-filter" className="font-semibold">
            3. Divisi
          </label>
          <Dropdown
            id="div-filter"
            value={selectedDivision}
            options={divisionOptions}
            onChange={(e) => handleDivisionChange(e.value)}
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
            emptyMessage="Tidak ada divisi"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        {/* --- Level 4: Position --- */}
        <div className="flex flex-column gap-2">
          <label htmlFor="pos-filter" className="font-semibold">
            4. Jabatan
          </label>
          <Dropdown
            id="pos-filter"
            value={selectedPosition}
            options={positionOptions}
            onChange={(e) => onPositionChange(e.value)}
            disabled={isPositionDisabled || isOptionsPositionLoading}
            loading={isOptionsPositionLoading}
            placeholder={
              isPositionDisabled
                ? "Pilih Divisi Terlebih Dahulu"
                : isOptionsPositionLoading
                  ? "Memuat Jabatan..."
                  : "Pilih Jabatan"
            }
            className="w-full"
            showClear={!isPositionDisabled}
            filter={!isPositionDisabled}
            emptyMessage="Tidak ada jabatan"
            optionLabel="label"
            optionValue="value"
          />
        </div>
      </div>
    </Dialog>
  );
}
