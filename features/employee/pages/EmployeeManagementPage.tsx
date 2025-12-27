"use client";

import { Users, UserCog } from "lucide-react"; // Removed unused imports: useEffect, useMemo
import { Card } from "primereact/card";
import { Button } from "primereact/button";

// Components
import EmployeeTable from "../components/EmployeeTable";
import EmployeeDeleteDialog from "../components/EmployeeDeleteDialog";
import EmployeeSaveDialog from "../components/EmployeeSaveDialog";
import EmployeeViewDialog from "../components/EmployeeViewDialog";
import EmployeeFilterDialog from "../components/EmployeeFilterDialog";
import TableToolbar from "@components/TableToolbar";

// Facade Hook
import { usePageEmployee } from "../hooks/usePageEmployee";

export default function EmployeeManagementPage() {
  const {
    // Data
    employees,
    employee,
    totalRecords,

    // Options (Level 1 only needed for passing to Root inputs)
    officeOptions,

    // Loading State
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
  } = usePageEmployee();

  const isFilterActive =
    !!filter.selectedOffice ||
    !!filter.selectedDepartment ||
    !!filter.selectedDivision ||
    !!filter.selectedPosition;

  // ---------------------------------------------------------------------
  //    Render
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
            searchPlaceholder="Cari..."
            onAdd={dialog.openAdd}
            filterContent={
              <Button
                label="Filter"
                icon="pi pi-filter"
                className="gap-1 w-full sm:w-auto"
                onClick={dialog.openFilter}
                outlined={!isFilterActive}
              />
            }
          />

          <EmployeeFilterDialog
            isOpen={dialog.isFilterVisible}
            onClose={() => dialog.closeFilter()}
            // Level 1: Office (Passed from Page)
            selectedOffice={filter.selectedOffice}
            onOfficeChange={filter.setSelectedOffice}
            officeOptions={officeOptions}
            // Level 2: Department (Handled Internally by Dialog)
            selectedDepartment={filter.selectedDepartment}
            onDepartmentChange={filter.setSelectedDepartment}
            // Level 3: Division (Handled Internally by Dialog)
            selectedDivision={filter.selectedDivision}
            onDivisionChange={filter.setSelectedDivision}
            // Level 4: Position (Handled Internally by Dialog)
            selectedPosition={filter.selectedPosition}
            onPositionChange={filter.setSelectedPosition}
          />

          {/* Data Table */}
          <EmployeeTable
            data={employees}
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
