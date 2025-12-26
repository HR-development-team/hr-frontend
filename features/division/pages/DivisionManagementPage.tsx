"use client";

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
import { useEffect } from "react";

export default function DivisionManagementPage() {
  const {
    divisions,
    division,
    officeOptions,
    departmentOptions,
    fetchDepartmentOptions,
    clearDepartmentOptions,
    totalRecords,
    onPageChange,
    lazyParams,
    isLoading,
    isOptionsLoading: isDepartmentLoading,
    isSaving,
    dialog,
    filter,
    deleteAction,
    handleSave,
    handleView,
  } = usePageDivision();

  const isFilterActive = !!filter.selectedOffice || !!filter.selectedDepartment;

  useEffect(() => {
    if (filter.selectedOffice) {
      fetchDepartmentOptions(filter.selectedOffice);
    } else {
      clearDepartmentOptions();
    }
  }, [fetchDepartmentOptions, filter.selectedOffice, clearDepartmentOptions]);

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
            isLoadingDepartment={isDepartmentLoading}
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
