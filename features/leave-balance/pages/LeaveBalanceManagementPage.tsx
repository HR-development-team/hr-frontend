"use client";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { WalletCards, Plus, FilterX } from "lucide-react";
import { Dropdown } from "primereact/dropdown";

// Components
import LeaveBalanceTable from "../components/LeaveBalanceTable";
import LeaveBalanceOptionDialog from "../components/LeaveBalanceOptionDialog";
import LeaveBalanceSaveDialog from "../components/LeaveBalanceSaveDialog";
import LeaveBalanceDeleteDialog from "../components/LeaveBalanceDeleteDialog";

// Hooks
import { usePageLeaveBalance } from "../hooks/usePageLeaveBalance";

export default function LeaveBalanceManagementPage() {
  const {
    // Data
    leaveBalances,
    yearOptions,
    typeOptions,
    employeeOptions,

    // Status
    isLoading,
    isSaving,
    isDeleting,

    // Filter State
    filterYear,
    filterType,
    setFilterYear,
    setFilterType,

    // UI & Dialog State
    isOptionDialogOpen,
    dialog, // The Form Dialog (Add/Edit)
    deleteAction, // The Single Delete Dialog

    // Handlers
    openOptionDialog,
    closeOptionDialog,
    handleSelectBulkAdd,
    handleSelectSingleAdd,
    handleSelectBulkDelete,
    handleEdit,
    handleSubmit,
  } = usePageLeaveBalance();

  return (
    <div>
      {/* --- HEADER --- */}
      <div className="flex flex-column md:flex-row md:align-items-center justify-content-between mb-5 mt-4 gap-3">
        <div className="flex align-items-center gap-3">
          <div className="bg-blue-100 text-blue-600 p-3 border-round-xl">
            <WalletCards size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 m-0">
              Manajemen Saldo Cuti
            </h1>
            <p className="text-gray-500 m-0 mt-1">
              Kelola jatah cuti karyawan per tahun
            </p>
          </div>
        </div>

        {/* Main Action Button */}
        <Button
          label="Tindakan"
          icon={<Plus size={16} className="mr-2" />}
          onClick={openOptionDialog}
          raised
        />
      </div>

      {/* --- MAIN CARD --- */}
      <Card>
        <div className="flex flex-column gap-4">
          {/* Section Header */}
          <div className="flex gap-2 align-items-center">
            <WalletCards className="h-2" />
            <h2 className="text-base text-800">Manajemen Saldo Cuti</h2>
          </div>

          {/* Filters */}
          <div className="flex flex-column md:flex-row gap-3 bg-gray-50 p-3 border-round-lg border-1 border-gray-200">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter Tahun
              </label>
              <Dropdown
                value={filterYear}
                onChange={(e) => setFilterYear(e.value)}
                options={yearOptions}
                optionLabel="label"
                optionValue="value"
                placeholder="Semua Tahun"
                className="w-full"
                showClear
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter Tipe Cuti
              </label>
              <Dropdown
                value={filterType}
                onChange={(e) => setFilterType(e.value)}
                options={typeOptions}
                optionLabel="label"
                optionValue="value"
                placeholder="Semua Tipe Cuti"
                className="w-full"
                showClear
              />
            </div>
            <div className="flex align-items-end">
              <Button
                icon={<FilterX size={18} />}
                severity="secondary"
                outlined
                tooltip="Reset Filter"
                onClick={() => {
                  setFilterYear(null);
                  setFilterType(null);
                }}
              />
            </div>
          </div>

          {/* Table */}
          <LeaveBalanceTable
            data={leaveBalances}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={deleteAction.requestDelete}
          />
        </div>
      </Card>

      {/* --- DIALOGS --- */}

      {/* 1. Option Dialog (The Menu) */}
      <LeaveBalanceOptionDialog
        isOpen={isOptionDialogOpen}
        onClose={closeOptionDialog}
        onSelectBulkAdd={handleSelectBulkAdd}
        onSelectSingleAdd={handleSelectSingleAdd}
        onSelectBulkDelete={handleSelectBulkDelete}
      />

      {/* 2. Form Dialog (Unified Form for Add/Edit/Bulk) */}
      {dialog.mode && (
        <LeaveBalanceSaveDialog
          isOpen={dialog.isOpen}
          onClose={dialog.close}
          mode={dialog.mode}
          title={dialog.title}
          initialData={dialog.formData}
          leaveTypeOptions={typeOptions}
          employeeOptions={employeeOptions}
          onSubmit={handleSubmit}
          isSubmitting={isSaving}
        />
      )}

      {/* 3. Delete Dialog (Single Item Confirmation) */}
      <LeaveBalanceDeleteDialog
        isOpen={!!deleteAction.leaveBalanceToDelete}
        leaveBalance={deleteAction.leaveBalanceToDelete}
        isDeleting={isDeleting}
        onClose={deleteAction.cancelDelete}
        onConfirm={deleteAction.confirmDelete}
      />
    </div>
  );
}
