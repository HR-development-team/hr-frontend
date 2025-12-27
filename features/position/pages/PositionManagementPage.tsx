"use client";

import { useEffect } from "react";
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

export default function PositionManagementPage() {
  const {
    // Data
    positions,
    position,
    totalRecords,

    // Options
    officeOptions,

    // Option Fetchers
    fetchDepartmentOptions,
    fetchDivisionOptions,
    clearDepartmentOptions,
    clearDivisionOptions,

    // Loading States
    isLoading,
    isSaving,

    // Pagination & Params
    onPageChange,
    lazyParams,

    // Actions & Dialogs
    dialog,
    filter,
    deleteAction,
    handleSave,
    handleView,
  } = usePagePosition();

  const isFilterActive =
    !!filter.selectedOffice ||
    !!filter.selectedDepartment ||
    !!filter.selectedDivision;

  // Cascade Level 1: Office -> Department
  useEffect(() => {
    if (filter.selectedOffice) {
      fetchDepartmentOptions(filter.selectedOffice);
    } else {
      clearDepartmentOptions();
      clearDivisionOptions();
    }
  }, [
    filter.selectedOffice,
    fetchDepartmentOptions,
    clearDepartmentOptions,
    clearDivisionOptions,
  ]);

  // Level 2: Department -> Division
  useEffect(() => {
    if (filter.selectedOffice && filter.selectedDepartment) {
      fetchDivisionOptions(filter.selectedOffice, filter.selectedDepartment);
    } else {
      clearDivisionOptions();
    }
  }, [
    filter.selectedOffice,
    filter.selectedDepartment,
    fetchDivisionOptions,
    clearDivisionOptions,
  ]);

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
            // Level 1: Office
            selectedOffice={filter.selectedOffice}
            onOfficeChange={filter.setSelectedOffice}
            officeOptions={officeOptions}
            // Level 2: Department
            selectedDepartment={filter.selectedDepartment}
            onDepartmentChange={filter.setSelectedDepartment}
            selectedDivision={filter.selectedDivision}
            onDivisionChange={filter.setSelectedDivision}
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
