"use client";

import { TicketsPlane } from "lucide-react";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import React, { useEffect, useMemo, useRef, useState } from "react";
import DataTableLeaveRequest from "./components/DataTableLeaveRequest";
import { GetAllLeaveTypeData } from "@/lib/types/leaveType";
import { GetAllLeaveRequestData } from "@/lib/types/leaveRequest";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { stat } from "fs";

// interface CombinedLeaveRequestData extends LeaveRequestData {
// 	employee_name: string;
// 	leave_type_name: string;
// }

export default function Leave() {
  const toasRef = useRef<Toast>(null);
  const isInitialLoad = useRef<boolean>(true);

  // const [employee, setEmployee] = useState<GetAllEmployeeData[]>([]);
  const [leaveType, setLeaveType] = useState<GetAllLeaveTypeData[]>([]);
  const [leaveRequest, setLeaveRequest] = useState<GetAllLeaveRequestData[]>(
    []
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const featchAllLeaveRequest = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/transaction/leave-request");

      if (!res.ok) {
        throw new Error("Gagal mengambil data dari server");
      }

      const leaveRequestData = await res.json();

      if (leaveRequestData && leaveRequestData.status === "00") {
        if (isInitialLoad.current) {
          toasRef.current?.show({
            severity: "success",
            summary: "Sukses",
            detail: leaveRequestData.message,
            life: 3000,
          });

          isInitialLoad.current = false;
        }

        // setEmployee(employeeData.master_employees || []);
        setLeaveRequest(leaveRequestData.leave_requests || []);
      } else {
        toasRef.current?.show({
          severity: "error",
          summary: "Gagal",
          detail: leaveRequestData.message,
          life: 3000,
        });
        // setEmployee([]);
        setLeaveType([]);
        setLeaveRequest([]);
      }
    } catch (error: any) {
      // setEmployee([]);
      setLeaveType([]);
      setLeaveRequest([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, status: "Approved" | "Rejected") => {
    try {
      const res = await fetch(`/api/admin/transaction/leave-request/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: status,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal update status permintaan cuti");
      }

      const responseData = await res.json();

      if (responseData && responseData.status === "00") {
        toasRef.current?.show({
          severity: "success",
          summary: "Sukses",
          detail: responseData.message,
          life: 3000,
        });
        featchAllLeaveRequest();
      } else {
        toasRef.current?.show({
          severity: "error",
          summary: "Gagal",
          detail: responseData.message,
          life: 3000,
        });
      }
    } catch (error: any) {
      toasRef.current?.show({
        severity: "error",
        summary: "Gagal",
        detail: error.message,
        life: 3000,
      });
    }
  };

  const handleUpdateStatus = (
    leaveRequest: GetAllLeaveRequestData,
    status: "Approved" | "Rejected"
  ) => {
    const icon =
      status === "Approved"
        ? "pi-check-square text-green-400"
        : "pi-times-circle text-red-400";

    const header = status === "Approved" ? "Persetujuan" : "Penolakan";

    const message = status === "Approved" ? "menyetujui" : "menolak";

    const acceptClassName =
      status === "Approved" ? "p-button-success" : "p-button-danger";

    confirmDialog({
      icon: `pi ${icon} mr-2`,
      header: `Konfirmasi ${header}`,
      message: `Konfirmasi ${message} cuti karyawan ${leaveRequest.employee_name}`,
      acceptLabel: "Konfirmasi",
      rejectLabel: "Batal",
      acceptClassName: acceptClassName,
      accept: () => updateStatus(leaveRequest.id, status),
    });
  };

  const sortedData = leaveRequest.sort((a, b) => {
    if (a.status === "Pending" && b.status !== "Pending") {
      return -1;
    }

    if (a.status === "Pending" && b.status === "Pending") {
      return 1;
    }

    return 0;
  });

  useEffect(() => {
    featchAllLeaveRequest();
  }, []);

  return (
    <div>
      <Toast ref={toasRef} />
      <div className="mb-6 flex align-items-center gap-3 mt-4">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <TicketsPlane className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Manajemen Cuti
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola pengajuan cuti dan saldo cuti karyawan
          </p>
        </div>
      </div>

      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex gap-2 align-items-center">
            <TicketsPlane className="h-2" />
            <h2 className="text-base text-800">Daftar Pengajuan Cuti</h2>
          </div>

          {/* total status */}

          <div className="flex align-items-center gap-4 text-white font-medium">
            {/* pending status */}
            <div className="bg-bluegray-500 py-2 px-3 border-round flex gap-2">
              <span>Pending:</span>
              <span>total</span>
            </div>

            {/* approve */}
            <div className="bg-green-500 py-2 px-3 border-round flex gap-2">
              <span>Approve:</span>
              <span>total</span>
            </div>

            {/* rejected */}
            <div className="bg-red-500 py-2 px-3 border-round flex gap-2">
              <span>Rejected:</span>
              <span>total</span>
            </div>
          </div>

          <ConfirmDialog />

          <DataTableLeaveRequest
            leaveRequest={sortedData}
            isLoading={isLoading}
            onUpdate={handleUpdateStatus}
          />
        </div>
      </Card>
    </div>
  );
}
