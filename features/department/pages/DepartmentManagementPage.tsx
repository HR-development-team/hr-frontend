"use client";

import { useMemo, useEffect } from "react";
import { Building, Layers } from "lucide-react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

import DepartmentTable from "../components/DepartmentTable";
import DepartmentDeleteDialog from "../components/DepartmentDeleteDialog";
import DepartmentSaveDialog from "../components/DepartmentSaveDialog";
import DepartmentViewDialog from "../components/DepartmentViewDialog";
import DepartmentFilterDialog from "../components/DepartmentFilterDialog";
import TableToolbar from "@components/TableToolbar";

import { usePageDepartment } from "../hooks/usePageDepartment";
import { useFetchOffice } from "@features/office/hooks/useFetchOffice";

export default function DepartmentManagementPage() {
  const {
    departments,
    totalRecords,
    onPageChange,
    lazyParams,
    department,
    isLoading,
    isSaving,
    dialog,
    filter,
    deleteAction,
    handleSave,
    handleView,
  } = usePageDepartment();

  const { offices, fetchOffices } = useFetchOffice();

  const officeOptions = useMemo(() => {
    return (offices || []).map((office) => ({
      label: office.name,
      value: office.office_code || "",
    }));
  }, [offices]);

  const isFilterActive = !!filter.selectedOffice;

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  return (
    <div>
      {/* Title Section */}
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <Layers className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Manajemen Departemen
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola data departemen dan struktur organisasi
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex gap-2 align-items-center">
            <Building className="h-2" />
            <h2 className="text-base text-800">Daftar Departemen</h2>
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

          <DepartmentFilterDialog
            isOpen={dialog.isFilterVisible}
            onClose={dialog.closeFilter}
            selectedOffice={filter.selectedOffice}
            onOfficeChange={filter.setSelectedOffice}
            officeOptions={officeOptions}
          />

          {/* Data Table */}
          <DepartmentTable
            data={departments}
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
      <DepartmentDeleteDialog
        isOpen={!!deleteAction.departmentToDelete}
        department={deleteAction.departmentToDelete}
        isDeleting={deleteAction.isDeleting}
        onClose={deleteAction.cancelDelete}
        onConfirm={deleteAction.confirmDelete}
      />

      {(dialog.mode === "add" || dialog.mode === "edit") && (
        <DepartmentSaveDialog
          isOpen={dialog.isVisible}
          title={dialog.title}
          departmentData={dialog.formData}
          onSubmit={handleSave}
          isSubmitting={isSaving}
          onClose={dialog.close}
          officeOptions={officeOptions}
        />
      )}

      <DepartmentViewDialog
        isOpen={dialog.isVisible && dialog.mode === "view"}
        onClose={dialog.close}
        department={department}
        isLoading={isLoading}
      />
    </div>
  );
}
