"use client";

import { useMemo } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

// Define option types with relation keys
export interface OfficeOption {
  label: string;
  value: string;
}

export interface DepartmentOption {
  label: string;
  value: string;
  office_code: string; // Relates to Office
}

export interface DivisionOption {
  label: string;
  value: string;
  department_code: string; // Relates to Department
}

export interface PositionOption {
  label: string;
  value: string;
  division_code: string; // Relates to Division
}

interface EmployeeFilterDialogProps {
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

  // Level 4: Position
  selectedPosition: string | null | undefined;
  onPositionChange: (value: string) => void;
  positionOptions: PositionOption[];
}

export default function EmployeeFilterDialog({
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

  selectedPosition,
  onPositionChange,
  positionOptions,
}: EmployeeFilterDialogProps) {
  // 1. Filter Departments based on selected Office
  const filteredDepartmentOptions = useMemo(() => {
    if (!selectedOffice) return []; // Strict hierarchy: must select parent first
    return departmentOptions.filter(
      (dept) => dept.office_code === selectedOffice
    );
  }, [selectedOffice, departmentOptions]);

  // 2. Filter Divisions based on selected Department
  const filteredDivisionOptions = useMemo(() => {
    if (!selectedDepartment) return [];
    return divisionOptions.filter(
      (div) => div.department_code === selectedDepartment
    );
  }, [selectedDepartment, divisionOptions]);

  // 3. Filter Positions based on selected Division
  const filteredPositionOptions = useMemo(() => {
    if (!selectedDivision) return [];
    return positionOptions.filter(
      (pos) => pos.division_code === selectedDivision
    );
  }, [selectedDivision, positionOptions]);

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
      header="Filter Karyawan"
      visible={isOpen}
      style={{ width: "450px" }}
      modal
      onHide={onClose}
      footer={renderFooter}
    >
      <div className="flex flex-column gap-4">
        <p className="m-0 text-gray-500 text-sm">
          Filter data karyawan berdasarkan struktur organisasi.
        </p>

        {/* Level 1: Office */}
        <div className="flex flex-column gap-2">
          <label htmlFor="office-filter" className="font-semibold">
            1. Kantor
          </label>
          <Dropdown
            id="office-filter"
            value={selectedOffice}
            options={officeOptions}
            onChange={(e) => {
              onOfficeChange(e.value);
              // Reset children
              onDepartmentChange("");
              onDivisionChange("");
              onPositionChange("");
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
            2. Departemen
          </label>
          <Dropdown
            id="dept-filter"
            value={selectedDepartment}
            options={filteredDepartmentOptions}
            onChange={(e) => {
              onDepartmentChange(e.value);
              // Reset children
              onDivisionChange("");
              onPositionChange("");
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
            emptyMessage="Tidak ada departemen di kantor ini"
          />
        </div>

        {/* Level 3: Division */}
        <div className="flex flex-column gap-2">
          <label htmlFor="div-filter" className="font-semibold">
            3. Divisi
          </label>
          <Dropdown
            id="div-filter"
            value={selectedDivision}
            options={filteredDivisionOptions}
            onChange={(e) => {
              onDivisionChange(e.value);
              // Reset child
              onPositionChange("");
            }}
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
            emptyMessage="Tidak ada divisi di departemen ini"
          />
        </div>

        {/* Level 4: Position */}
        <div className="flex flex-column gap-2">
          <label htmlFor="pos-filter" className="font-semibold">
            4. Jabatan
          </label>
          <Dropdown
            id="pos-filter"
            value={selectedPosition}
            options={filteredPositionOptions}
            onChange={(e) => onPositionChange(e.value)}
            placeholder={
              selectedDivision
                ? "Pilih Jabatan"
                : "Pilih Divisi Terlebih Dahulu"
            }
            className="w-full"
            showClear
            filter
            disabled={!selectedDivision || filteredPositionOptions.length === 0}
            emptyMessage="Tidak ada jabatan di divisi ini"
          />
        </div>
      </div>
    </Dialog>
  );
}
