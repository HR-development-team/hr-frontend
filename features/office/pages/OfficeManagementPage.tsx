"use client";

import { Building2 } from "lucide-react";
import { Card } from "primereact/card";

import OfficeTable from "../components/OfficeTable";
import OfficeDeleteDialog from "../components/OfficeDeleteDialog";
import OfficeSaveDialog from "../components/OfficeSaveDialog";
import OfficeViewDialog from "../components/OfficeViewDialog";
import TableToolbar from "@components/TableToolbar";

// Facade Hook
import { usePageOffice } from "../hooks/usePageOffice";
import { useMemo } from "react";
import { Button } from "primereact/button";
import OfficeFilterDialog from "../components/OfficeFilterDialog";

export default function OfficeManagementPage() {
  const {
    offices,
    office,
    isLoading,
    isSaving,
    dialog,
    filter,
    deleteAction,
    handleSave,
    handleView,
  } = usePageOffice();

  const parentOfficeOptions = useMemo(() => {
    return offices.map((office) => ({
      label: office.name,
      value: office.office_code,
    }));
  }, [offices]);

  const filteredOffice = useMemo(() => {
    let result = offices;

    if (filter.selectedOffice) {
      result = result.filter(
        (dept) => dept.parent_office_code === filter.selectedOffice
      );
    }

    if (filter.search) {
      const lowerSearch = filter.search.toLowerCase();
      result = result.filter(
        (dept) =>
          dept.name.toLowerCase().includes(lowerSearch) ||
          dept.office_code?.toLowerCase().includes(lowerSearch)
      );
    }
    return result;
  }, [offices, filter.selectedOffice, filter.search]);

  const isFilterActive = !!filter.selectedOffice;

  // ---------------------------------------------------------------------
  //   Render
  // ---------------------------------------------------------------------
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
          {/* Section Header */}
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
                className="gap-1 w-full sm:w-auto"
                onClick={() => dialog.openFilter()}
                outlined={!isFilterActive}
              />
            }
          />

          {/* Data Table */}
          <OfficeTable
            data={filteredOffice}
            isLoading={isLoading}
            onView={handleView}
            onEdit={dialog.openEdit}
            onDelete={deleteAction.requestDelete}
          />
        </div>
      </Card>

      {/* --- Dialogs --- */}
      {/* Filter Dialog */}

      <OfficeFilterDialog
        isOpen={dialog.isFilterVisible}
        onClose={dialog.closeFilter}
        selectedOffice={filter.selectedOffice}
        onOfficeChange={filter.setSelectedOffice}
        officeOptions={parentOfficeOptions}
      />

      {/* Delete Confirmation */}
      <OfficeDeleteDialog
        isOpen={!!deleteAction.officeToDelete}
        office={deleteAction.officeToDelete}
        isDeleting={deleteAction.isDeleting}
        onClose={deleteAction.cancelDelete}
        onConfirm={deleteAction.confirmDelete}
      />

      {/* Add/Edit Form */}
      {(dialog.mode === "add" || dialog.mode === "edit") && (
        <OfficeSaveDialog
          isOpen={dialog.isVisible}
          title={dialog.title}
          officeData={dialog.formData}
          onSubmit={handleSave}
          isSubmitting={isSaving}
          onClose={dialog.close}
          parentOfficeOptions={parentOfficeOptions}
        />
      )}

      {/* View Details */}
      <OfficeViewDialog
        isOpen={dialog.isVisible && dialog.mode === "view"}
        onClose={dialog.close}
        office={office}
        isLoading={isLoading}
      />
    </div>
  );
}
