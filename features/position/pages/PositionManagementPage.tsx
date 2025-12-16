"use client";

import { useMemo, useEffect } from "react";
import { UserCheck, Layers } from "lucide-react";
import { Card } from "primereact/card";

// Components
import PositionTable from "../components/PositionTable";
import PositionDeleteDialog from "../components/PositionDeleteDialog";
import PositionSaveDialog from "../components/PositionSaveDialog";
import PositionViewDialog from "../components/PositionViewDialog";
import TableToolbar from "@components/TableToolbar";
import DateRangeFilter from "@components/DateRangeFilter";

// Facade Hook for Position
import { usePagePosition } from "../hooks/usePagePosition";
import { useFetchDivision } from "@features/division/hooks/useFetchDivision";

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

  const { divisions, fetchDivisions } = useFetchDivision();

  const divisionOptions = useMemo(() => {
    return divisions.map((div) => ({
      label: div.name,
      value: div.division_code || "",
    }));
  }, [divisions]);

  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

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
            searchPlaceholder="Cari berdasarkan Nama Jabatan"
            onAdd={dialog.openAdd}
            addLabel="Tambah Jabatan"
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
          />

          {/* Data Table */}
          <PositionTable
            data={positions}
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
