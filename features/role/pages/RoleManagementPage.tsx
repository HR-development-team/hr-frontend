"use client";

import { Settings2 } from "lucide-react";
import { Card } from "primereact/card";

// Components
import RoleTable from "../components/RoleTable";
import RoleDeleteDialog from "../components/RoleDeleteDialog";
import RoleSaveDialog from "../components/RoleSaveDialog";
import TableToolbar from "@components/TableToolbar";

// Facade Hook
import { usePageRole } from "../hooks/usePageRole";

export default function RoleManagementPage() {
  const {
    // Data
    roles,
    totalRecords,

    // Loading State
    isLoading,
    isSaving,

    // Pagination
    lazyParams,
    onPageChange,

    // Actions & Dialogs
    dialog,
    filter,
    deleteAction,
    handleSave,
    handleSetting,
  } = usePageRole();

  // ---------------------------------------------------------------------
  //  Render
  // ---------------------------------------------------------------------
  return (
    <div>
      {/* Title Section */}
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <Settings2 className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Manajemen Role
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola data dan informasi Role
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <div className="flex flex-column gap-4">
          {/* Section Header */}
          <div className="flex gap-2 align-items-center">
            <Settings2 className="h-2" />
            <h2 className="text-base text-800">Manajemen Data Role</h2>
          </div>

          {/* Filters & Toolbar */}
          <TableToolbar
            searchValue={filter.search}
            onSearchChange={(e) => filter.setSearch(e.target.value)}
            onAdd={dialog.openAdd}
          />

          {/* Data Table */}
          <RoleTable
            data={roles}
            isLoading={isLoading}
            totalRecords={totalRecords}
            lazyParams={lazyParams}
            onPageChange={onPageChange}
            onEdit={dialog.openEdit}
            onDelete={deleteAction.requestDelete}
            onSetting={handleSetting}
          />
        </div>
      </Card>

      {/* --- Dialogs --- */}
      <RoleDeleteDialog
        isOpen={!!deleteAction.roleToDelete}
        role={deleteAction.roleToDelete}
        isDeleting={deleteAction.isDeleting}
        onClose={deleteAction.cancelDelete}
        onConfirm={deleteAction.confirmDelete}
      />

      <RoleSaveDialog
        isOpen={dialog.isVisible}
        title={dialog.title}
        roleData={dialog.formData}
        onSubmit={handleSave}
        isSubmitting={isSaving}
        onClose={dialog.close}
      />
    </div>
  );
}
