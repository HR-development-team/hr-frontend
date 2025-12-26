"use client";

import { Building2 } from "lucide-react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

import OfficeTable from "../components/OfficeTable";
import OfficeDeleteDialog from "../components/OfficeDeleteDialog";
import OfficeSaveDialog from "../components/OfficeSaveDialog";
import OfficeViewDialog from "../components/OfficeViewDialog";
import OfficeFilterDialog from "../components/OfficeFilterDialog";
import TableToolbar from "@components/TableToolbar";

import { usePageOffice } from "../hooks/usePageOffice";

export default function OfficeManagementPage() {
  const {
    offices,
    office,
    officeOptions,
    totalRecords,
    onPageChange,
    lazyParams,
    isLoading,
    isSaving,
    dialog,
    filter,
    deleteAction,
    handleSave,
    handleView,
  } = usePageOffice();

  const isFilterActive = !!filter.selectedParentOffice;

  return (
    <div>
      {/* Title Section */}
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <Building2 className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Manajemen Kantor
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola data kantor, cabang, dan lokasi
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex gap-2 align-items-center">
            <Building2 className="h-2" />
            <h2 className="text-base text-800">Manajemen Data Kantor</h2>
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
                className="gap-1 w-full lg:w-auto"
                onClick={dialog.openFilter}
                outlined={!isFilterActive}
              />
            }
          />

          <OfficeFilterDialog
            isOpen={dialog.isFilterVisible}
            onClose={dialog.closeFilter}
            selectedOffice={filter.selectedParentOffice}
            onOfficeChange={filter.setSelectedParentOffice}
            officeOptions={officeOptions}
          />

          {/* Data Table */}
          <OfficeTable
            data={offices}
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
      <OfficeDeleteDialog
        isOpen={!!deleteAction.officeToDelete}
        office={deleteAction.officeToDelete}
        isDeleting={deleteAction.isDeleting}
        onClose={deleteAction.cancelDelete}
        onConfirm={deleteAction.confirmDelete}
      />

      {(dialog.mode === "add" || dialog.mode === "edit") && (
        <OfficeSaveDialog
          isOpen={dialog.isVisible}
          title={dialog.title}
          officeData={dialog.formData}
          onSubmit={handleSave}
          isSubmitting={isSaving}
          onClose={dialog.close}
          parentOfficeOptions={officeOptions}
        />
      )}

      <OfficeViewDialog
        isOpen={dialog.isVisible && dialog.mode === "view"}
        onClose={dialog.close}
        office={office}
        isLoading={isLoading}
      />
    </div>
  );
}
