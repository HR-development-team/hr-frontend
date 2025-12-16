"use client";

import { useMemo } from "react";
import { Users, UserCog } from "lucide-react";
import { Card } from "primereact/card";

// Components
import EmployeeTable from "../components/EmployeeTable";
import EmployeeDeleteDialog from "../components/EmployeeDeleteDialog";
import EmployeeSaveDialog, {
  SelectOption,
} from "../components/EmployeeSaveDialog";
import EmployeeViewDialog from "../components/EmployeeViewDialog";
import TableToolbar from "@components/TableToolbar";
import DateRangeFilter from "@components/DateRangeFilter";

// Facade Hook
import { usePageEmployee } from "../hooks/usePageEmployee";

export default function EmployeeManagementPage() {
  const {
    // Data & Status
    employees,
    employee,
    isLoading,
    isSaving,

    // Dependencies
    offices,
    positions,
    users,

    // Sub-Hooks
    dialog,
    filter,
    deleteAction,

    // Handlers
    handleSave,
    handleView,
  } = usePageEmployee();

  // ---------------------------------------------------------------------
  //   Data Transformation for Dropdowns
  // ---------------------------------------------------------------------

  const officeOptions: SelectOption[] = useMemo(() => {
    return offices.map((office) => ({
      label: office.name,
      value: office.office_code,
    }));
  }, [offices]);

  const positionOptions: SelectOption[] = useMemo(() => {
    return positions.map((pos) => ({
      label: pos.name,
      value: pos.position_code || "",
    }));
  }, [positions]);

  const userOptions: SelectOption[] = useMemo(() => {
    // Assuming 'users' has email or username. Adjust based on your User schema.
    return users.map((user) => ({
      label: user.email || "User",
      value: user.user_code,
    }));
  }, [users]);

  // ---------------------------------------------------------------------
  //   Render
  // ---------------------------------------------------------------------
  return (
    <div>
      {/* Title Section */}
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <Users className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Manajemen Karyawan
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola data karyawan, informasi kontrak, dan penempatan kerja
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <div className="flex flex-column gap-4">
          {/* Section Header */}
          <div className="flex gap-2 align-items-center">
            <UserCog className="h-2" />
            <h2 className="text-base text-800">Daftar Karyawan</h2>
          </div>

          {/* Toolbar & Filters */}
          <TableToolbar
            searchValue={filter.search}
            onSearchChange={(e) => filter.setSearch(e.target.value)}
            searchPlaceholder="Cari Nama atau NIK..."
            onAdd={dialog.openAdd}
            addLabel="Tambah Karyawan"
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
          <EmployeeTable
            data={employees}
            isLoading={isLoading}
            onView={handleView}
            onEdit={dialog.openEdit}
            onDelete={deleteAction.requestDelete}
          />
        </div>
      </Card>

      {/* --- Dialogs --- */}

      {/* Delete Confirmation */}
      <EmployeeDeleteDialog
        isOpen={!!deleteAction.employeeToDelete}
        employee={deleteAction.employeeToDelete}
        isDeleting={deleteAction.isDeleting}
        onClose={deleteAction.cancelDelete}
        onConfirm={deleteAction.confirmDelete}
      />

      {/* Add/Edit Form */}
      {(dialog.mode === "add" || dialog.mode === "edit") && (
        <EmployeeSaveDialog
          isOpen={dialog.isVisible}
          title={dialog.title}
          employeeData={dialog.formData}
          onSubmit={handleSave}
          isSubmitting={isSaving}
          onClose={dialog.close}
          // Pass Options
          officeOptions={officeOptions}
          positionOptions={positionOptions}
          userOptions={userOptions}
        />
      )}

      {/* View Details */}
      <EmployeeViewDialog
        isOpen={dialog.isVisible && dialog.mode === "view"}
        onClose={dialog.close}
        employee={employee}
        isLoading={isLoading}
      />
    </div>
  );
}
