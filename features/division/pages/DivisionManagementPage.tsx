"use client";

import { useMemo, useEffect } from "react";
import { Briefcase } from "lucide-react";
import { Card } from "primereact/card";

// Components
import DivisionTable from "../components/DivisionTable";
import DivisionDeleteDialog from "../components/DivisionDeleteDialog";
import DivisionSaveDialog from "../components/DivisionSaveDialog";
import DivisionViewDialog from "../components/DivisionViewDialog";
import TableToolbar from "@components/TableToolbar";
import DateRangeFilter from "@components/DateRangeFilter";

// Facade Hook for Division
import { usePageDivision } from "../hooks/usePageDivision";
import { useFetchDepartment } from "@features/department/hooks/useFetchDepartment";
import { useFetchOffice } from "@features/office/hooks/useFetchOffice";

export default function DivisionManagementPage() {
  const {
    divisions,
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

  const officeOptions = useMemo(() => {
    return offices.map((office) => ({
      label: office.name,
      value: office.office_code || "",
    }));
  }, [offices]);

  const departmentOptions = useMemo(() => {
    return departments.map((dept) => ({
      label: dept.name,
      value: dept.department_code || "",
      office_code: dept.office_code || "",
    }));
  }, [departments]);

  useEffect(() => {
    fetchDepartments();
    fetchOffices();
  }, [fetchDepartments, fetchOffices]);
  // ---------------------------------------------------------------------
  //   Render
  // ---------------------------------------------------------------------
  return (
    <div>
      {/* Title Section */}
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          {/* Using Briefcase icon for Divisions */}
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
          {/* Section Header */}
          <div className="flex gap-2 align-items-center">
            <Briefcase className="h-2" />
            <h2 className="text-base text-800">Daftar Divisi</h2>
          </div>

          {/* Toolbar & Filters */}
          <TableToolbar
            searchValue={filter.search}
            onSearchChange={(e) => filter.setSearch(e.target.value)}
            searchPlaceholder="Cari berdasarkan Nama Divisi"
            onAdd={dialog.openAdd}
            addLabel="Tambah Divisi"
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
          <DivisionTable
            data={divisions}
            isLoading={isLoading}
            onView={handleView}
            onEdit={dialog.openEdit}
            onDelete={deleteAction.requestDelete}
          />
        </div>
      </Card>

      {/* --- Dialogs --- */}

      {/* Delete Confirmation */}
      <DivisionDeleteDialog
        isOpen={!!deleteAction.divisionToDelete}
        division={deleteAction.divisionToDelete}
        isDeleting={deleteAction.isDeleting}
        onClose={deleteAction.cancelDelete}
        onConfirm={deleteAction.confirmDelete}
      />

      {/* Add/Edit Form */}
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

      {/* View Details */}
      <DivisionViewDialog
        isOpen={dialog.isVisible && dialog.mode === "view"}
        onClose={dialog.close}
        division={division}
        isLoading={isLoading}
      />
    </div>
  );
}
