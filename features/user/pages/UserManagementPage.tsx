"use client";

import { User as UserIcon } from "lucide-react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import UserTable from "../components/UserTable";
import UserDeleteDialog from "../components/UserDeleteDialog";
import UserSaveDialog from "../components/UserSaveDialog";
import UserViewDialog from "../components/UserViewDialog";
import UserFilterDialog from "../components/UserFilterDialog";
import TableToolbar from "@components/TableToolbar";
import { usePageUser } from "../hooks/usePageUser";

export default function UserManagementPage() {
  const {
    // Data
    users,
    user,
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
    handleView,
  } = usePageUser();

  // Check if any filter is active for button styling
  const isFilterActive = !!filter.selectedRole;

  // ---------------------------------------------------------------------
  //    Render
  // ---------------------------------------------------------------------
  return (
    <div>
      {/* Title Section */}
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <UserIcon className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Manajemen Pengguna
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola data diri dan informasi User
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <div className="flex flex-column gap-4">
          {/* Section Header */}
          <div className="flex gap-2 align-items-center">
            <UserIcon className="h-2" />
            <h2 className="text-base text-800">Manajemen Data User</h2>
          </div>

          {/* Toolbar & Filters */}
          <TableToolbar
            searchValue={filter.search}
            onSearchChange={(e) => filter.setSearch(e.target.value)}
            searchPlaceholder="Cari berdasarkan Email..."
            onAdd={dialog.openAdd}
            addLabel="Tambah"
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

          {/* Filter Dialog */}
          <UserFilterDialog
            isOpen={dialog.isFilterVisible}
            onClose={dialog.closeFilter}
            selectedRole={filter.selectedRole}
            onRoleChange={filter.setSelectedRole}
          />

          {/* Data Table */}
          <UserTable
            data={users}
            isLoading={isLoading}
            onView={handleView}
            onEdit={dialog.openEdit}
            onDelete={deleteAction.requestDelete}
            // Pagination Props
            totalRecords={totalRecords}
            lazyParams={lazyParams}
            onPageChange={onPageChange}
          />
        </div>
      </Card>

      {/* --- Dialogs --- */}
      <UserDeleteDialog
        isOpen={!!deleteAction.userToDelete}
        user={deleteAction.userToDelete}
        isDeleting={deleteAction.isDeleting}
        onClose={deleteAction.cancelDelete}
        onConfirm={deleteAction.confirmDelete}
      />

      {(dialog.mode === "add" || dialog.mode === "edit") && (
        <UserSaveDialog
          isOpen={dialog.isVisible}
          title={dialog.title}
          userData={dialog.formData}
          onSubmit={handleSave}
          isSubmitting={isSaving}
          onClose={dialog.close}
        />
      )}

      <UserViewDialog
        isOpen={dialog.isVisible && dialog.mode === "view"}
        onClose={dialog.close}
        user={user}
        isLoading={isLoading}
      />
    </div>
  );
}
