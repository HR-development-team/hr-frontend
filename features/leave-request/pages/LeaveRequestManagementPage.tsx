"use client";

import React, { useMemo } from "react";
import { Card } from "primereact/card";
// import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { TicketsPlane } from "lucide-react";

// Components & Hooks
import LeaveRequestTable from "../components/LeaveRequestTable";
import { usePageLeaveRequest } from "../hooks/usePageLeaveRequest";
// import LeaveRequestDialog  from "../components/LeaveRequestDialog";

export default function LeaveRequestManagementPage() {
  const {
    leaveRequests,
    leaveRequest,
    isLoading,
    isSaving,
    dialog,
    filter,
    deleteAction,
    handleUpdateStatus,
    handleView,
  } = usePageLeaveRequest();

  const statusCounts = useMemo(() => {
    const counts = { pending: 0, approved: 0, rejected: 0 };

    if (!leaveRequests) return counts;

    leaveRequests.forEach((req) => {
      const status = (req.status || "pending").toLowerCase();
      if (status === "pending") counts.pending++;
      else if (status === "approved") counts.approved++;
      else if (status === "rejected") counts.rejected++;
    });

    return counts;
  }, [leaveRequests]);

  // =========================================================================
  // 3. Render
  // =========================================================================
  return (
    <div className="fadein animation-duration-300">
      {/* Toast is handled globally or via hooks usually, but kept here if needed */}
      <Toast />
      <ConfirmDialog />

      {/* --- Page Header --- */}
      <div className="mb-6 flex align-items-center gap-3 mt-4">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center justify-content-center">
          <TicketsPlane className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-1">
            Manajemen Cuti
          </h1>
          <p className="text-sm md:text-md text-gray-500 m-0">
            Kelola pengajuan cuti dan saldo cuti karyawan
          </p>
        </div>
      </div>

      <Card className="border-round-xl shadow-2">
        <div className="flex flex-column gap-4">
          {/* --- Card Header & Actions --- */}
          <div className="flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="flex gap-2 align-items-center">
              <TicketsPlane className="text-gray-800 w-1.5rem h-1.5rem" />
              <h2 className="text-xl font-semibold text-gray-800 m-0">
                Daftar Pengajuan Cuti
              </h2>
            </div>
          </div>

          {/* --- Status Stats Bar --- */}
          <div className="flex flex-wrap align-items-center gap-3 text-white font-medium text-sm">
            {/* Pending */}
            <div className="bg-yellow-500 py-2 px-3 border-round-lg flex gap-2 shadow-1 align-items-center">
              <i className="pi pi-clock"></i>
              <span>Pending:</span>
              <span className="font-bold">{statusCounts.pending}</span>
            </div>

            {/* Approved */}
            <div className="bg-green-500 py-2 px-3 border-round-lg flex gap-2 shadow-1 align-items-center">
              <i className="pi pi-check-circle"></i>
              <span>Approved:</span>
              <span className="font-bold">{statusCounts.approved}</span>
            </div>

            {/* Rejected */}
            <div className="bg-red-500 py-2 px-3 border-round-lg flex gap-2 shadow-1 align-items-center">
              <i className="pi pi-times-circle"></i>
              <span>Rejected:</span>
              <span className="font-bold">{statusCounts.rejected}</span>
            </div>
          </div>

          {/* --- Main Table --- */}
          <LeaveRequestTable
            data={leaveRequests}
            isLoading={isLoading}
            onView={handleView}
            onEdit={dialog.openEdit}
            onDelete={deleteAction.requestDelete}
          />
        </div>
      </Card>

      {/* --- Form Dialog --- */}
      {/* Assuming you created the LeaveRequestDialog component */}
      {/* <LeaveRequestDialog
        visible={dialog.isVisible}
        mode={dialog.mode}
        onClose={dialog.close}
        onSubmit={handleSubmit}
        initialData={dialog.formData}
        title={dialog.title}
        // If you added isReadOnly to the hook:
        isReadOnly={dialog.mode === "view"}
      /> */}
    </div>
  );
}
