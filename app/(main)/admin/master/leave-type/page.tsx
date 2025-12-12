"use client";

import { TicketsPlane } from "lucide-react";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import InputTextComponent from "@components/InputTextComponent";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import {
  GetAllLeaveTypeData,
  GetLeaveTypeByIdData,
} from "@/lib/types/leaveType";
import DataTableLeaveType from "./components/DataTableLeaveType";
import { LeaveTypeFormData } from "@/lib/schemas/leaveTypeFormSchema";
import LeaveTypeDialogForm from "./components/LeaveTypeDialogForm";
import LeaveTypeDialogView from "./components/LeaveTypeDialogView";
import { useFetch } from "@/lib/hooks/useFetch";
import { useSubmit } from "@/lib/hooks/useSubmit";
import { useDelete } from "@/lib/hooks/useDelete";
import { useToastContext } from "@/components/ToastProvider";

export default function LeaveType() {
  const isInitialLoad = useRef<boolean>(true);

  const [leaveType, setLeaveType] = useState<GetAllLeaveTypeData[]>([]);
  const [viewLeaveType, setViewLeaveType] =
    useState<GetLeaveTypeByIdData | null>(null);

  const [currentEditedId, setCurrentEditedId] = useState<number | null>(null);

  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [dialogLabel, setDialogLabel] = useState<
    "Lihat Data Tipe Cuti" | "Edit Tipe Cuti" | "Tambah Tipe Cuti" | null
  >(null);

  const [dialogMode, setDialogMode] = useState<"view" | "add" | "edit" | null>(
    null
  );

  const { isLoading, fetchData, fetchDataById } = useFetch();
  const { isSaving, submitData } = useSubmit();
  const deleteData = useDelete();

  const { showToast } = useToastContext();

  const fetchLeaveType = async () => {
    await fetchData({
      url: "/api/admin/master/leave-type",
      showToast: showToast,
      onSuccess: (responseData) => {
        setLeaveType(responseData.leave_types || []);
      },
      onError: () => {
        setLeaveType([]);
      },
    });
  };

  const fetchLeaveTypeById = async (id: number) => {
    await fetchDataById({
      url: `/api/admin/master/leave-type/${id}`,
      onSuccess: (responseData) => {
        setViewLeaveType(responseData.leave_types || null);
      },
      onError: () => {
        setViewLeaveType(null);
      },
    });
  };

  const cleanLeaveTypeDataForm = useMemo(() => {
    if (!viewLeaveType) {
      return null;
    }

    return {
      name: viewLeaveType.name,
      deduction: Number(viewLeaveType.deduction),
      description: viewLeaveType.description,
    };
  }, [viewLeaveType]);

  const handleSubmit = async (formData: LeaveTypeFormData) => {
    const method = dialogMode === "add" ? "POST" : "PUT";

    const url =
      dialogMode === "add"
        ? "/api/admin/master/leave-type"
        : `/api/admin/master/leave-type/${currentEditedId}`;

    await submitData({
      url: url,
      payload: formData,
      showToast: showToast,
      onSuccess: () => {
        fetchLeaveType();
        setDialogMode(null);
        setIsDialogVisible(false);
        setCurrentEditedId(null);
      },
      method: method,
    });
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
        await deleteData({
          url: `/api/admin/master/leave-type/${leaveType.id}`,
          onSuccess: () => fetchLeaveType(),
          showToast: showToast,
        });
      },
    });
  };

  useEffect(() => {
    fetchLeaveType();
  }, []);

  return (
    <div>
      <div className="mb-6 flex align-items-center gap-3 mt-4">
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
            data={leaveType}
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
            <LeaveTypeDialogView
              data={viewLeaveType}
              isLoading={isLoading}
              dialogMode={dialogMode}
            />
          </div>
        </Dialog>
      </Card>
    </div>
  );
}
