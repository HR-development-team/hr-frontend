"use client";

import { useMemo } from "react";
import { Users, UserCog } from "lucide-react";
import { Card } from "primereact/card";
import { Button } from "primereact/button"; // Import Button

// Components
import EmployeeTable from "../components/EmployeeTable";
import EmployeeDeleteDialog from "../components/EmployeeDeleteDialog";
import EmployeeSaveDialog from "../components/EmployeeSaveDialog";
import EmployeeViewDialog from "../components/EmployeeViewDialog";
import EmployeeFilterDialog from "../components/EmployeeFilterDialog"; // Import Filter Dialog
import TableToolbar from "@components/TableToolbar";
import DateRangeFilter from "@components/DateRangeFilter";

// Facade Hook
import { usePageEmployee } from "../hooks/usePageEmployee";

export default function EmployeeManagementPage() {
  const {
    // Data & Status
    employees,
    employee,
    isLoading,
    isSaving,

    // Dependencies (Raw Arrays)
    offices,
    departments,
    divisions,
    positions,

    // Dependencies (Formatted Options)
    userOptions,

    // Sub-Hooks
    dialog,
    filter, // This now contains selectedOffice, setSelectedOffice, etc.
    deleteAction,

    // Handlers
    handleSave,
    handleView,
  } = usePageEmployee();

  // We need to map raw data to { label, value, parentCode }
  const filterOptions = useMemo(() => {
    return {
      offices: offices.map((o) => ({
        label: o.name,
        value: o.office_code,
      })),
      departments: departments.map((d) => ({
        label: d.name,
        value: d.department_code,
        office_code: d.office_code, // Crucial for cascading
      })),
      divisions: divisions.map((d) => ({
        label: d.name,
        value: d.division_code,
        department_code: d.department_code, // Crucial for cascading
      })),
      positions: positions.map((p) => ({
        label: p.name,
        value: p.position_code,
        division_code: p.division_code, // Crucial for cascading
      })),
    };
  }, [offices, departments, divisions, positions]);

  const isFilterActive =
    !!filter.selectedOffice ||
    !!filter.selectedDepartment ||
    !!filter.selectedDivision ||
    filter.selectedPosition;

  const filteredEmployees = useMemo(() => {
    let result = employees;

    // Level 1: Office
    if (filter.selectedOffice) {
      result = result.filter(
        (emp) => emp.office_code === filter.selectedOffice
      );
    }

    // Level 2: Department
    if (filter.selectedDepartment) {
      result = result.filter(
        (emp) => emp.department_code === filter.selectedDepartment
      );
    }

    // Level 3: Division
    if (filter.selectedDivision) {
      result = result.filter(
        (emp) => emp.division_code === filter.selectedDivision
      );
    }

    // Search
    if (filter.search) {
      const lowerSearch = filter.search.toLowerCase();
      result = result.filter(
        (emp) =>
          emp.position_name.toLowerCase().includes(lowerSearch) ||
          emp.position_code?.toLowerCase().includes(lowerSearch)
      );
    }
    return result;
  }, [
    employees,
    filter.selectedOffice,
    filter.selectedDepartment,
    filter.selectedDivision,
    filter.search,
  ]);

  // ---------------------------------------------------------------------
  //    Render
  // ---------------------------------------------------------------------
  return (
    <div>
      {/* Title Section */}
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <Users className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Manajemen Karyawan
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola data karyawan, informasi kontrak, dan penempatan kerja
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <div className="flex flex-column gap-4">
          {/* Section Header */}
          <div className="flex gap-2 align-items-center">
            <UserCog className="h-2" />
            <h2 className="text-base text-800">Daftar Karyawan</h2>
          </div>

          {/* Toolbar & Filters */}
          <TableToolbar
            searchValue={filter.search}
            onSearchChange={(e) => filter.setSearch(e.target.value)}
            searchPlaceholder="Cari..."
            onAdd={dialog.openAdd}
            filterContent={
              <div className="flex gap-2 align-items-center">
                <DateRangeFilter
                  startDate={filter.dates.start}
                  endDate={filter.dates.end}
                  onStartDateChange={(e) =>
                    filter.setDates({ ...filter.dates, start: e.value })
                  }
                  onEndDateChange={(e) =>
                    filter.setDates({ ...filter.dates, end: e.value })
                  }
                  onApply={filter.applyDateFilter}
                  onClear={filter.clearDateFilter}
                />
              </div>
            }
            actionContent={
              <Button
                label="Filter"
                icon="pi pi-filter"
                className="gap-1 w-full sm:w-auto"
                onClick={dialog.openFilter}
                outlined={!isFilterActive}
              />
            }
          />

          {/* Data Table */}
          <EmployeeTable
            data={filteredEmployees}
            isLoading={isLoading}
            onView={handleView}
            onEdit={dialog.openEdit}
            onDelete={deleteAction.requestDelete}
          />
        </div>
      </Card>

      {/* --- Dialogs --- */}

      {/* 4. Hierarchy Filter Dialog */}
      <EmployeeFilterDialog
        isOpen={dialog.isFilterVisible}
        onClose={() => dialog.closeFilter()}
        // State
        selectedOffice={filter.selectedOffice}
        onOfficeChange={filter.setSelectedOffice}
        selectedDepartment={filter.selectedDepartment}
        onDepartmentChange={filter.setSelectedDepartment}
        selectedDivision={filter.selectedDivision}
        onDivisionChange={filter.setSelectedDivision}
        selectedPosition={filter.selectedPosition}
        onPositionChange={filter.setSelectedPosition}
        // Options
        officeOptions={filterOptions.offices}
        departmentOptions={filterOptions.departments}
        divisionOptions={filterOptions.divisions}
        positionOptions={filterOptions.positions}
      />

      {/* Delete Confirmation */}
      <EmployeeDeleteDialog
        isOpen={!!deleteAction.employeeToDelete}
        employee={deleteAction.employeeToDelete}
        isDeleting={deleteAction.isDeleting}
        onClose={deleteAction.cancelDelete}
        onConfirm={deleteAction.confirmDelete}
      />

      {/* Add/Edit Form */}
      {(dialog.mode === "add" || dialog.mode === "edit") && (
        <EmployeeSaveDialog
          isOpen={dialog.isVisible}
          title={dialog.title}
          employeeData={dialog.formData}
          onSubmit={handleSave}
          isSubmitting={isSaving}
          onClose={dialog.close}
          offices={offices}
          departments={departments}
          divisions={divisions}
          positions={positions}
          userOptions={userOptions}
        />
      )}

      {/* View Details */}
      <EmployeeViewDialog
        isOpen={dialog.isVisible && dialog.mode === "view"}
        onClose={dialog.close}
        employee={employee}
        isLoading={isLoading}
      />
    </div>
  );
}
