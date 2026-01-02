"use client";

import { Clock, Layers } from "lucide-react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

import ShiftTable from "../components/ShiftTable";
import ShiftDeleteDialog from "../components/ShiftDeleteDialog";
import ShiftSaveDialog from "../components/ShiftSaveDialog";
import ShiftViewDialog from "../components/ShiftViewDialog";
import ShiftFilterDialog from "../components/ShiftFilterDialog";
import TableToolbar from "@components/TableToolbar";

import { usePageShift } from "../hooks/usePageShift";

export default function ShiftManagementPage() {
  const {
    // Data
    shifts,
    shift,
    totalRecords,

    // Options
    officeOptions,

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
  } = usePageShift();

  const isFilterActive = !!filter.selectedOffice;

  return (
    <div>
      {/* Title Section */}
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-indigo-100 text-indigo-500 p-3 border-round-xl flex align-items-center">
          <Clock className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Manajemen Shift
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola jadwal kerja, jam operasional, dan aturan toleransi absensi
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex gap-2 align-items-center">
            <Layers className="h-2" />
            <h2 className="text-base text-800">Daftar Shift Kerja</h2>
          </div>

          {/* Toolbar & Filters */}
          <TableToolbar
            searchValue={filter.search}
            onSearchChange={(e) => filter.setSearch(e.target.value)}
            searchPlaceholder="Cari Nama Shift"
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

          <ShiftFilterDialog
            isOpen={dialog.isFilterVisible}
            onClose={dialog.closeFilter}
            // Level 1: Office Only
            selectedOffice={filter.selectedOffice}
            onOfficeChange={filter.setSelectedOffice}
            officeOptions={officeOptions}
          />

          {/* Data Table */}
          <ShiftTable
            data={shifts}
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
      <ShiftDeleteDialog
        isOpen={!!deleteAction.shiftToDelete}
        shift={deleteAction.shiftToDelete}
        isDeleting={deleteAction.isDeleting}
        onClose={deleteAction.cancelDelete}
        onConfirm={deleteAction.confirmDelete}
      />

      {(dialog.mode === "add" || dialog.mode === "edit") && (
        <ShiftSaveDialog
          isOpen={dialog.isVisible}
          title={dialog.title}
          shiftData={dialog.formData}
          onSubmit={handleSave}
          isSubmitting={isSaving}
          onClose={dialog.close}
          officeOptions={officeOptions}
        />
      )}

      <ShiftViewDialog
        isOpen={dialog.isVisible && dialog.mode === "view"}
        onClose={dialog.close}
        shift={shift}
        isLoading={isLoading}
      />
    </div>
  );
}
