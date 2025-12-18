"use client";

import { useMemo, useEffect } from "react";
import { UserCheck, Layers } from "lucide-react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

// Components
import PositionTable from "../components/PositionTable";
import PositionDeleteDialog from "../components/PositionDeleteDialog";
import PositionSaveDialog from "../components/PositionSaveDialog";
import PositionViewDialog from "../components/PositionViewDialog";
import PositionFilterDialog from "../components/PositionFilterDialog";
import TableToolbar from "@components/TableToolbar";
import DateRangeFilter from "@components/DateRangeFilter";

// Facade Hook for Position
import { usePagePosition } from "../hooks/usePagePosition";
import { useFetchDivision } from "@features/division/hooks/useFetchDivision";
import { useFetchOffice } from "@features/office/hooks/useFetchOffice";
import { useFetchDepartment } from "@features/department/hooks/useFetchDepartment";

export default function PositionManagementPage() {
  const {
    positions,
    position,
    isLoading,
    isSaving,
    dialog,
    filter,
    deleteAction,
    handleSave,
    handleView,
  } = usePagePosition();

  const { offices, fetchOffices } = useFetchOffice();
  const { departments, fetchDepartments } = useFetchDepartment();
  const { divisions, fetchDivisions } = useFetchDivision();

  const officeOptions = useMemo(() => {
    return offices.map((office) => ({
      label: office.name,
      value: office.office_code || "",
    }));
  }, [offices]);

  const departmentOptions = useMemo(() => {
    return departments.map((dept) => ({
      label: dept.name,
      value: dept.department_code || "",
      office_code: dept.office_code || "",
    }));
  }, [departments]);

  const divisionOptions = useMemo(() => {
    return divisions.map((div) => ({
      label: div.name,
      value: div.division_code || "",
      department_code: div.department_code || "",
    }));
  }, [divisions]);

  const filteredPositions = useMemo(() => {
    let result = positions;

    // Level 1: Office
    if (filter.selectedOffice) {
      result = result.filter(
        (pos) => pos.office_code === filter.selectedOffice
      );
    }

    // Level 2: Department
    if (filter.selectedDepartment) {
      result = result.filter(
        (pos) => pos.department_code === filter.selectedDepartment
      );
    }

    // Level 3: Division
    if (filter.selectedDivision) {
      result = result.filter(
        (pos) => pos.division_code === filter.selectedDivision
      );
    }

    // Search
    if (filter.search) {
      const lowerSearch = filter.search.toLowerCase();
      result = result.filter(
        (pos) =>
          pos.name.toLowerCase().includes(lowerSearch) ||
          pos.position_code?.toLowerCase().includes(lowerSearch)
      );
    }
    return result;
  }, [
    positions,
    filter.selectedOffice,
    filter.selectedDepartment,
    filter.selectedDivision,
    filter.search,
  ]);

  const isFilterActive =
    !!filter.selectedOffice ||
    !!filter.selectedDepartment ||
    !!filter.selectedDivision;

  useEffect(() => {
    fetchOffices();
    fetchDepartments();
    fetchDivisions();
  }, [fetchOffices, fetchDepartments, fetchDivisions]);

  // ---------------------------------------------------------------------
  //   Render
  // ---------------------------------------------------------------------
  return (
    <div>
      {/* Title Section */}
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          {/* Using UserCheck icon for Positions/Jobs */}
          <UserCheck className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Manajemen Jabatan
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola data jabatan, struktur organisasi, dan gaji pokok
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <div className="flex flex-column gap-4">
          {/* Section Header */}
          <div className="flex gap-2 align-items-center">
            <Layers className="h-2" />
            <h2 className="text-base text-800">Daftar Jabatan</h2>
          </div>

          {/* Toolbar & Filters */}
          <TableToolbar
            searchValue={filter.search}
            onSearchChange={(e) => filter.setSearch(e.target.value)}
            searchPlaceholder="Cari..."
            onAdd={dialog.openAdd}
            filterContent={
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

          <PositionFilterDialog
            isOpen={dialog.isFilterVisible}
            onClose={dialog.closeFilter}
            // Level 1
            selectedOffice={filter.selectedOffice}
            onOfficeChange={filter.setSelectedOffice}
            officeOptions={officeOptions}
            // Level 2
            selectedDepartment={filter.selectedDepartment}
            onDepartmentChange={filter.setSelectedDepartment}
            departmentOptions={departmentOptions}
            // Level 3
            selectedDivision={filter.selectedDivision}
            onDivisionChange={filter.setSelectedDivision}
            divisionOptions={divisionOptions}
          />

          {/* Data Table */}
          <PositionTable
            data={filteredPositions}
            isLoading={isLoading}
            onView={handleView}
            onEdit={dialog.openEdit}
            onDelete={deleteAction.requestDelete}
          />
        </div>
      </Card>

      {/* --- Dialogs --- */}

      {/* Delete Confirmation */}
      <PositionDeleteDialog
        isOpen={!!deleteAction.positionToDelete}
        position={deleteAction.positionToDelete}
        isDeleting={deleteAction.isDeleting}
        onClose={deleteAction.cancelDelete}
        onConfirm={deleteAction.confirmDelete}
      />

      {/* Add/Edit Form */}
      {(dialog.mode === "add" || dialog.mode === "edit") && (
        <PositionSaveDialog
          isOpen={dialog.isVisible}
          title={dialog.title}
          positionData={dialog.formData}
          onSubmit={handleSave}
          isSubmitting={isSaving}
          onClose={dialog.close}
          divisionOptions={divisionOptions}
        />
      )}

      {/* View Details */}
      <PositionViewDialog
        isOpen={dialog.isVisible && dialog.mode === "view"}
        onClose={dialog.close}
        position={position}
        isLoading={isLoading}
      />
    </div>
  );
}
