"use client";

import { useMemo, useEffect } from "react";
import { UserCheck, Layers } from "lucide-react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

import PositionTable from "../components/PositionTable";
import PositionDeleteDialog from "../components/PositionDeleteDialog";
import PositionSaveDialog from "../components/PositionSaveDialog";
import PositionViewDialog from "../components/PositionViewDialog";
import PositionFilterDialog from "../components/PositionFilterDialog";
import TableToolbar from "@components/TableToolbar";

import { usePagePosition } from "../hooks/usePagePosition";
import { useFetchDivision } from "@features/division/hooks/useFetchDivision";
import { useFetchOffice } from "@features/office/hooks/useFetchOffice";
import { useFetchDepartment } from "@features/department/hooks/useFetchDepartment";

export default function PositionManagementPage() {
  const {
    positions,
    totalRecords,
    onPageChange,
    lazyParams,
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

  const officeOptions = useMemo(
    () =>
      offices.map((office) => ({
        label: office.name,
        value: office.office_code || "",
      })),
    [offices]
  );

  const departmentOptions = useMemo(
    () =>
      departments.map((dept) => ({
        label: dept.name,
        value: dept.department_code || "",
        office_code: dept.office_code || "",
      })),
    [departments]
  );

  const divisionOptions = useMemo(
    () =>
      divisions.map((div) => ({
        label: div.name,
        value: div.division_code || "",
        department_code: div.department_code || "",
      })),
    [divisions]
  );

  const isFilterActive =
    !!filter.selectedOffice ||
    !!filter.selectedDepartment ||
    !!filter.selectedDivision;

  useEffect(() => {
    fetchOffices();
    fetchDepartments();
    fetchDivisions();
  }, [fetchOffices, fetchDepartments, fetchDivisions]);

  return (
    <div>
      {/* Title Section */}
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
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
          <div className="flex gap-2 align-items-center">
            <Layers className="h-2" />
            <h2 className="text-base text-800">Daftar Jabatan</h2>
          </div>

          {/* Toolbar & Filters */}
          <TableToolbar
            searchValue={filter.search}
            onSearchChange={(e) => filter.setSearch(e.target.value)}
            searchPlaceholder="Cari Nama atau Kode"
            onAdd={dialog.openAdd}
            filterContent={
              <Button
                label="Filter"
                icon="pi pi-filter"
                className="gap-1 w-full lg:w-auto"
                onClick={dialog.openFilter}
                outlined={!isFilterActive}
              />
            }
          />

          <PositionFilterDialog
            isOpen={dialog.isFilterVisible}
            onClose={dialog.closeFilter}
            selectedOffice={filter.selectedOffice}
            onOfficeChange={filter.setSelectedOffice}
            officeOptions={officeOptions}
            selectedDepartment={filter.selectedDepartment}
            onDepartmentChange={filter.setSelectedDepartment}
            departmentOptions={departmentOptions}
            selectedDivision={filter.selectedDivision}
            onDivisionChange={filter.setSelectedDivision}
            divisionOptions={divisionOptions}
          />

          {/* Data Table */}
          <PositionTable
            data={positions}
            isLoading={isLoading}
            onView={handleView}
            onEdit={dialog.openEdit}
            onDelete={deleteAction.requestDelete}
            totalRecords={totalRecords}
            lazyParams={lazyParams}
            onPageChange={onPageChange}
          />
        </div>
      </Card>

      {/* --- Dialogs --- */}
      <PositionDeleteDialog
        isOpen={!!deleteAction.positionToDelete}
        position={deleteAction.positionToDelete}
        isDeleting={deleteAction.isDeleting}
        onClose={deleteAction.cancelDelete}
        onConfirm={deleteAction.confirmDelete}
      />

      {(dialog.mode === "add" || dialog.mode === "edit") && (
        <PositionSaveDialog
          isOpen={dialog.isVisible}
          title={dialog.title}
          positionData={dialog.formData}
          onSubmit={handleSave}
          isSubmitting={isSaving}
          onClose={dialog.close}
          divisionOptions={divisionOptions}
          departmentOptions={departmentOptions}
          officeOptions={officeOptions}
        />
      )}

      <PositionViewDialog
        isOpen={dialog.isVisible && dialog.mode === "view"}
        onClose={dialog.close}
        position={position}
        isLoading={isLoading}
      />
    </div>
  );
}
