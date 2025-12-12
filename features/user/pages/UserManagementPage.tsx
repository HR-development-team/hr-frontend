"use client";

import { useEffect, useMemo } from "react";
import { User as UserIcon } from "lucide-react";
import { Card } from "primereact/card";

// Components
import UserTable from "../components/UserTable";
import UserDeleteDialog from "../components/UserDeleteDialog";
import UserSaveDialog from "../components/UserSaveDialog";
import UserViewDialog from "../components/UserViewDialog";
import TableToolbar from "@components/TableToolbar";
import DateRangeFilter from "@components/DateRangeFilter";

// Facade Hook
import { usePageUser } from "../hooks/usePageUser";
import { useFetchRoles } from "@features/role/hooks/useFetchRole";

export default function UserManagementPage() {
  const {
    users,
    user,
    isLoading,
    isSaving,
    dialog,
    filter,
    deleteAction,
    handleSave,
    handleView,
  } = usePageUser();

  const { roles, fetchRoles } = useFetchRoles();

  useEffect(() => {
    fetchRoles(false);
  }, [fetchRoles]);

  const roleOptions = useMemo(() => {
    return roles.map((r) => ({ label: r.name, value: r.role_code }));
  }, [roles]);

  // ---------------------------------------------------------------------
  //  Render
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
            searchPlaceholder="Cari berdasarkan Email atau Nama"
            onAdd={dialog.openAdd}
            addLabel="Tambah User"
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
          <UserTable
            data={users}
            isLoading={isLoading}
            onView={handleView}
            onEdit={dialog.openEdit}
            onDelete={deleteAction.requestDelete}
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
          roleOptions={roleOptions}
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
