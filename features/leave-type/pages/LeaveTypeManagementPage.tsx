"use client";

import { CalendarOff, FileClock } from "lucide-react";
import { Card } from "primereact/card";

// Components
import LeaveTypeTable from "../components/LeaveTypeTable";
import LeaveTypeDeleteDialog from "../components/LeaveTypeDeleteDialog";
import LeaveTypeSaveDialog from "../components/LeaveTypeSaveDialog";
import LeaveTypeViewDialog from "../components/LeaveTypeViewDialog";
import TableToolbar from "@components/TableToolbar";
import DateRangeFilter from "@components/DateRangeFilter";

// Facade Hook
import { usePageLeaveType } from "../hooks/usePageLeaveType";

export default function LeaveTypeManagementPage() {
  const {
    // Data & Status
    leaveTypes,
    leaveType,
    isLoading,
    isSaving,

    // Sub-Hooks
    dialog,
    filter,
    deleteAction,

    // Handlers
    handleSave,
    handleView,
  } = usePageLeaveType();

  // ---------------------------------------------------------------------
  //   Render
  // ---------------------------------------------------------------------
  return (
    <div>
      {/* Title Section */}
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <CalendarOff className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Manajemen Tipe Cuti
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Atur kategori cuti dan ketentuan pengurangan kuota cuti tahunan
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <div className="flex flex-column gap-4">
          {/* Section Header */}
          <div className="flex gap-2 align-items-center">
            <FileClock className="h-2" />
            <h2 className="text-base text-800">Daftar Tipe Cuti</h2>
          </div>

          {/* Toolbar & Filters */}
          <TableToolbar
            searchValue={filter.search}
            onSearchChange={(e) => filter.setSearch(e.target.value)}
            searchPlaceholder="Cari Tipe Cuti..."
            onAdd={dialog.openAdd}
            addLabel="Tambah Tipe Cuti"
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
          <LeaveTypeTable
            data={leaveTypes}
            isLoading={isLoading}
            onView={handleView}
            onEdit={dialog.openEdit}
            onDelete={deleteAction.requestDelete}
          />
        </div>
      </Card>

      {/* --- Dialogs --- */}

      {/* Delete Confirmation */}
      <LeaveTypeDeleteDialog
        isOpen={!!deleteAction.leaveTypeToDelete}
        leaveType={deleteAction.leaveTypeToDelete}
        isDeleting={deleteAction.isDeleting}
        onClose={deleteAction.cancelDelete}
        onConfirm={deleteAction.confirmDelete}
      />

      {/* Add/Edit Form */}
      {(dialog.mode === "add" || dialog.mode === "edit") && (
        <LeaveTypeSaveDialog
          isOpen={dialog.isVisible}
          title={dialog.title}
          leaveTypeData={dialog.formData}
          onSubmit={handleSave}
          isSubmitting={isSaving}
          onClose={dialog.close}
        />
      )}

      {/* View Details */}
      <LeaveTypeViewDialog
        isOpen={dialog.isVisible && dialog.mode === "view"}
        onClose={dialog.close}
        leaveType={leaveType}
        isLoading={isLoading}
      />
    </div>
  );
}
