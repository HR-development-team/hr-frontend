"use client";

import { useMemo, useEffect } from "react";
import { Briefcase } from "lucide-react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

// Components
import DivisionTable from "../components/DivisionTable";
import DivisionDeleteDialog from "../components/DivisionDeleteDialog";
import DivisionSaveDialog from "../components/DivisionSaveDialog";
import DivisionViewDialog from "../components/DivisionViewDialog";
import DivisionFilterDialog from "../components/DivisionFilterDialog";
import TableToolbar from "@components/TableToolbar";

// Facade Hook
import { usePageDivision } from "../hooks/usePageDivision";
import { useFetchDepartment } from "@features/department/hooks/useFetchDepartment";
import { useFetchOffice } from "@features/office/hooks/useFetchOffice";

export default function DivisionManagementPage() {
  const {
    divisions,
    totalRecords,
    onPageChange,
    lazyParams,
    division,
    isLoading,
    isSaving,
    dialog,
    filter,
    deleteAction,
    handleSave,
    handleView,
  } = usePageDivision();

  const { departments, fetchDepartments } = useFetchDepartment();
  const { offices, fetchOffices } = useFetchOffice();

  // Dropdown Options
  const officeOptions = useMemo(() => {
    return (offices || []).map((office) => ({
      label: office.name,
      value: office.office_code || "",
    }));
  }, [offices]);

  const departmentOptions = useMemo(() => {
    return (departments || []).map((dept) => ({
      label: dept.name,
      value: dept.department_code || "",
      office_code: dept.office_code || "",
    }));
  }, [departments]);

  const isFilterActive = !!filter.selectedOffice || !!filter.selectedDepartment;

  useEffect(() => {
    fetchDepartments();
    fetchOffices();
  }, [fetchDepartments, fetchOffices]);

  return (
    <div>
      {/* Title Section */}
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <Briefcase className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Manajemen Divisi
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola data divisi berdasarkan departemen
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex gap-2 align-items-center">
            <Briefcase className="h-2" />
            <h2 className="text-base text-800">Daftar Divisi</h2>
          </div>

          {/* Toolbar & Filters */}
          <TableToolbar
            searchValue={filter.search}
            onSearchChange={(e) => filter.setSearch(e.target.value)}
            searchPlaceholder="Cari..."
            onAdd={dialog.openAdd}
            filterContent={
              <Button
                label="Filter"
                icon="pi pi-filter"
                className="gap-1 w-full sm:w-auto"
                onClick={() => dialog.openFilter()}
                outlined={!isFilterActive}
              />
            }
          />

          <DivisionFilterDialog
            isOpen={dialog.isFilterVisible}
            onClose={dialog.closeFilter}
            selectedOffice={filter.selectedOffice}
            onOfficeChange={filter.setSelectedOffice}
            officeOptions={officeOptions}
            selectedDepartment={filter.selectedDepartment}
            onDepartmentChange={filter.setSelectedDepartment}
            departmentOptions={departmentOptions}
          />

          {/* Data Table */}
          <DivisionTable
            data={divisions}
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
      <DivisionDeleteDialog
        isOpen={!!deleteAction.divisionToDelete}
        division={deleteAction.divisionToDelete}
        isDeleting={deleteAction.isDeleting}
        onClose={deleteAction.cancelDelete}
        onConfirm={deleteAction.confirmDelete}
      />

      {(dialog.mode === "add" || dialog.mode === "edit") && (
        <DivisionSaveDialog
          isOpen={dialog.isVisible}
          title={dialog.title}
          divisionData={dialog.formData}
          onSubmit={handleSave}
          isSubmitting={isSaving}
          onClose={dialog.close}
          departmentOptions={departmentOptions}
          officeOptions={officeOptions}
        />
      )}

      <DivisionViewDialog
        isOpen={dialog.isVisible && dialog.mode === "view"}
        onClose={dialog.close}
        division={division}
        isLoading={isLoading}
      />
    </div>
  );
}
