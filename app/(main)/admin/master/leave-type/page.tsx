"use client";

import { TicketsPlane, User, Users } from "lucide-react";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import InputTextComponent from "@/components/Input";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { EmployeeFormData } from "@/lib/schemas/employeeFormSchema";
import { Toast } from "primereact/toast";
import {
  GetAllLeaveTypeData,
  GetLeaveTypeByIdData,
} from "@/lib/types/leaveType";
import DataTableLeaveType from "./components/DataTableLeaveType";
import { LeaveTypeFormData } from "@/lib/schemas/leaveTypeFormSchema";
import LeaveTypeDialogForm from "./components/LeaveTypeDialogForm";
import LeaveTYpeDialogView from "./components/LeaveTypeDialogView";

export default function LeaveType() {
  const toastRef = useRef<Toast>(null);
  const isInitialLoad = useRef<boolean>(true);

  const [leaveType, setLeaveType] = useState<GetAllLeaveTypeData[]>([]);
  const [viewLeaveType, setViewLeaveType] =
    useState<GetLeaveTypeByIdData | null>(null);

  const [currentEditedId, setCurrentEditedId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [dialogLabel, setDialogLabel] = useState<
    "Lihat Data Tipe Cuti" | "Edit Tipe Cuti" | "Tambah Tipe Cuti" | null
  >(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [dialogMode, setDialogMode] = useState<"view" | "add" | "edit" | null>(
    null
  );

  const fetchLeaveType = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/master/leave-type");

      if (!res.ok) throw new Error("Gagal mendapatkan data dari server");

      const leaveTypeData = await res.json();

      console.log(leaveTypeData.message);

      if (leaveTypeData && leaveTypeData.status === "00") {
        if (isInitialLoad.current) {
          toastRef.current?.show({
            severity: "success",
            summary: "Sukses",
            detail: leaveTypeData.message,
            life: 3000,
          });

          isInitialLoad.current = false;
        }
        setLeaveType(leaveTypeData.leave_types || []);
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: "Gagal",
          detail: leaveTypeData.message,
          life: 3000,
        });

        setLeaveType([]);
      }
    } catch (error) {
      setLeaveType([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaveTypeById = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/master/leave-type/${id}`);

      if (!res.ok) throw new Error("Gagal mendapatkan user berdasarkan id");

      const leaveTypeData = await res.json();

      console.log(leaveTypeData.message);

      if (leaveTypeData && leaveTypeData.status === "00") {
        setViewLeaveType(leaveTypeData.leave_types || null);
      } else {
        setViewLeaveType(null);
      }
    } catch (error) {
      setViewLeaveType(null);
    } finally {
      setIsLoading(false);
    }
  };

  const cleanLeaveTypeDataForm = useMemo(() => {
    if (!viewLeaveType) {
      return null;
    }

    const { id, type_code, created_at, updated_at, ...cleanData } =
      viewLeaveType;

    return {
      ...cleanData,
    };
  }, [viewLeaveType]);

  const handleSubmit = async (formData: LeaveTypeFormData) => {
    try {
      const method = dialogMode === "add" ? "POST" : "PUT";

      const url =
        dialogMode === "add"
          ? "/api/admin/master/leave-type"
          : `/api/admin/master/leave-type/${currentEditedId}`;

      const res = await fetch(url, {
        method: method,
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Terjadi kesalahan");
      }

      toastRef.current?.show({
        severity: "success",
        summary: "Sukses",
        detail: responseData.message || "Data berhasil disimpan",
        life: 3000,
      });

      fetchLeaveType();
      setDialogMode(null);
      setIsDialogVisible(false);
      setCurrentEditedId(null);
    } catch (error: any) {
      toastRef.current?.show({
        severity: "success",
        summary: "Sukses",
        detail: error.message,
        life: 3000,
      });
    }
  };

  const handleView = (leaveType: GetAllLeaveTypeData) => {
    setDialogMode("view");
    setIsDialogVisible(true);
    setDialogLabel("Lihat Data Tipe Cuti");
    fetchLeaveTypeById(leaveType.id);
  };

  const handleEdit = (leaveType: GetAllLeaveTypeData) => {
    setDialogMode("edit");
    setIsDialogVisible(true);
    setCurrentEditedId(leaveType.id);
    setDialogLabel("Edit Tipe Cuti");
    fetchLeaveTypeById(leaveType.id);
  };

  const handleDelete = (leaveType: GetAllLeaveTypeData) => {
    confirmDialog({
      icon: "pi pi-exclamation-triangle text-red-400 mr-2",
      header: "Konfirmasi Hapus",
      message: `Yakin ingin menghapus Tipe Cuti ${leaveType.name}`,
      acceptLabel: "Hapus",
      rejectLabel: "Batal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const res = await fetch(
            `/api/admin/master/leave-type/${leaveType.id}`,
            {
              method: "DELETE",
            }
          );

          const responseData = await res.json();

          if (!res.ok) {
            throw new Error(
              responseData.message || "Terjadi kesalahan koneksi"
            );
          }

          toastRef.current?.show({
            severity: "success",
            summary: "Sukses",
            detail: responseData.message || "Data berhasil dihapus",
            life: 3000,
          });

          fetchLeaveType();
        } catch (error: any) {
          toastRef.current?.show({
            severity: "error",
            summary: "Gagal",
            detail: error.message,
            life: 3000,
          });
        } finally {
          setCurrentEditedId(null);
        }
      },
    });
  };

  useEffect(() => {
    fetchLeaveType();
  }, []);

  return (
    <div>
      <Toast ref={toastRef} />
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <TicketsPlane className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Master Data Tipe Cuti
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola tipe cuti beserta saldo setiap cuti
          </p>
        </div>
      </div>

      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex gap-2 align-items-center">
            <TicketsPlane className="h-2" />
            <h2 className="text-base text-800">Master Data Cuti</h2>
          </div>

          {/* filters */}
          <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-end gap-3">
            {/* calendar */}
            <form className="flex flex-column md:flex-row md:align-items-end gap-3">
              <div className="flex flex-column md:flex-row gap-2">
                {/* start date */}
                <div className="flex flex-column gap-2">
                  <label htmlFor="startDate">Dari</label>
                  <Calendar
                    id="startDate"
                    placeholder="Mulai"
                    showIcon
                    style={{ width: "10rem" }}
                  />
                </div>

                {/* end date */}
                <div className="flex flex-column gap-2">
                  <label htmlFor="endDate">Sampai</label>
                  <Calendar
                    id="startDate"
                    placeholder="Selesai"
                    showIcon
                    style={{ width: "10rem" }}
                  />
                </div>
              </div>

              {/* submit button */}
              <div className="flex flex-column gap-2">
                <span>Terapkan</span>
                <div className="flex align-items-center gap-3">
                  <Button icon="pi pi-check" type="submit" severity="info" />

                  <Button icon="pi pi-times" severity="secondary" />
                </div>
              </div>
            </form>

            {/* search filter and add button */}
            <div className="flex flex-column md:flex-row gap-3">
              {/* search */}
              <InputTextComponent
                icon="pi pi-search"
                placeholder="Cari berdasarkan ID atau nama"
                className="w-full"
              />

              {/* add button */}
              <div>
                <Button
                  icon="pi pi-plus"
                  label="Tambah"
                  severity="info"
                  pt={{
                    icon: { className: "mr-2" },
                  }}
                  onClick={() => {
                    setDialogMode("add");
                    setDialogLabel("Tambah Tipe Cuti");
                    setCurrentEditedId(null);
                    setIsDialogVisible(true);
                  }}
                />
              </div>
            </div>
          </div>

          {/* data table */}
          <DataTableLeaveType
            leaveType={leaveType}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <ConfirmDialog />

        <Dialog
          header={dialogLabel}
          visible={isDialogVisible}
          onHide={() => {
            setDialogLabel(null);
            setIsDialogVisible(false);
            setViewLeaveType(null);
          }}
          modal
          className="w-full md:w-4"
        >
          <div
            className={
              dialogMode === "edit" || dialogMode === "add" ? "block" : "hidden"
            }
          >
            <LeaveTypeDialogForm
              leaveType={cleanLeaveTypeDataForm}
              onSubmit={handleSubmit}
              isSubmitting={isSaving}
            />
          </div>

          <div className={dialogMode === "view" ? "block" : "hidden"}>
            <LeaveTYpeDialogView
              leaveTypeData={viewLeaveType}
              isLoading={isLoading}
              dialogMode={dialogMode}
            />
          </div>
        </Dialog>
      </Card>
    </div>
  );
}
