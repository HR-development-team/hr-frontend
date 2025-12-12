/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Clock4 } from "lucide-react";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import InputTextComponent from "@components/InputTextComponent";
import DataTableSession from "./components/DataTableSession";
import {
  GetAllAttendanceSessionData,
  GetAttendanceSessionByIdData,
} from "@/lib/types/attendanceSession";
import { AttendanceSessionFormData } from "@/lib/schemas/attendanceFormSchema";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import AttendanceSessionDialogForm from "./components/AttendanceSessionDialogForm";
import { formatDateToYYYYMMDD, formatTime } from "@/lib/utils/dateFormat";
import AttendanceSessionDialogView from "./components/AttendanceSessionDialogView";
import { useFetch } from "@/lib/hooks/useFetch";
import { useSubmit } from "@/lib/hooks/useSubmit";
import { useDelete } from "@/lib/hooks/useDelete";

export default function AttendanceSession() {
  const toastRef = useRef<Toast>(null);
  const isInitialLoad = useRef<boolean>(true);

  const [attendanceSessions, setAttendanceSessions] = useState<
    GetAllAttendanceSessionData[]
  >([]);
  const [viewSession, setViewSession] =
    useState<GetAttendanceSessionByIdData | null>(null);

  const [currentEditedId, setCurrentEditedId] = useState<number | null>(null);

  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);

  const [dialogMode, setDialogMode] = useState<"view" | "add" | "edit" | null>(
    null
  );
  const [dialogLabel, setDialogLabel] = useState<
    "Lihat Sesi" | "Edit Sesi" | "Tambah Sesi" | null
  >(null);

  const { isLoading, fetchData, fetchDataById } = useFetch();
  const { isSaving, submitData } = useSubmit();
  const deleteData = useDelete();

  const fetchAllSessions = async () => {
    await fetchData({
      url: "/api/admin/attendance/session",
      // toastRef: toastRef,
      onSuccess: (responseData) => {
        setAttendanceSessions(responseData.attendance_sessions || []);
      },
      onError: () => {
        setAttendanceSessions([]);
      },
    });
  };

  const fetchSessionById = async (id: number) => {
    await fetchDataById({
      url: `/api/admin/attendance/session/${id}`,
      onSuccess: (responseData) => {
        setViewSession(responseData.attendance_sessions || null);
      },
      onError: () => {
        setViewSession(null);
      },
    });
  };

  const cleanSessionData = useMemo(() => {
    if (!viewSession) {
      return null;
    }

    return {
      date: new Date(viewSession.date),
      open_time: new Date(`1970-01-01T${viewSession.open_time}`),
      cutoff_time: new Date(`1970-01-01T${viewSession.cutoff_time}`),
      close_time: new Date(`1970-01-01T${viewSession.close_time}`),
    };
  }, [viewSession]);

  const handleSubmit = async (formData: AttendanceSessionFormData) => {
    const payload = {
      ...formData,
      date: formData.date ? formatDateToYYYYMMDD(formData.date) : null,
      open_time: formData.open_time ? formatTime(formData.open_time) : null,
      cutoff_time: formData.cutoff_time
        ? formatTime(formData.cutoff_time)
        : null,
      close_time: formData.close_time ? formatTime(formData.close_time) : null,
      status: "open",
    };

    const method = dialogMode === "add" ? "POST" : "PUT";

    const url =
      dialogMode === "add"
        ? "/api/admin/attendance/session"
        : `/api/admin/attendance/session/${currentEditedId}`;

    await submitData({
      url: url,
      payload: payload,
      // toastRef: toastRef,
      onSuccess: () => {
        fetchAllSessions();
        setDialogMode(null);
        setIsDialogVisible(false);
        setCurrentEditedId(null);
      },
      method: method,
    });
  };

  const handleView = (session: GetAllAttendanceSessionData) => {
    setDialogMode("view");
    setIsDialogVisible(true);
    setDialogLabel("Lihat Sesi");
    fetchSessionById(session.id);
  };

  const handleEdit = (session: GetAllAttendanceSessionData) => {
    setDialogMode("edit");
    setIsDialogVisible(true);
    setCurrentEditedId(session.id);
    setDialogLabel("Edit Sesi");
    fetchSessionById(session.id);
  };

  const handleClose = (session: GetAllAttendanceSessionData) => {
    confirmDialog({
      icon: "pi pi-exclamation-triangle text-red-400 mr-2",
      header: "Konfirmasi Menutup Sesi",
      message: `Yakin ingin Menutup sesi ${session.session_code}?`,
      acceptLabel: "Tutup",
      rejectLabel: "Batal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        await submitData({
          url: `/api/admin/attendance/session/${session.id}/status`,
          // toastRef: toastRef,
          onSuccess: () => {
            fetchAllSessions();
          },
          method: "PUT",
        });
      },
    });
  };

  const handleDelete = (session: GetAllAttendanceSessionData) => {
    confirmDialog({
      icon: "pi pi-exclamation-triangle text-red-400 mr-2",
      header: "Konfirmasi Hapus",
      message: `Yakin ingin menghapus sesi ${session.session_code}?`,
      acceptLabel: "Hapus",
      rejectLabel: "Batal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        await deleteData({
          url: `/api/admin/attendance/session/${session.id}`,
          onSuccess: () => {
            fetchAllSessions();
          },
          // toastRef: toastRef,
        });
      },
    });
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);
  return (
    <div>
      <Toast ref={toastRef} />
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <Clock4 className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Manajemen Sesi Kerja
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kontrol Status Kehadiran Harian
          </p>
        </div>
      </div>

      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex gap-2 align-items-center">
            <Clock4 className="h-2" />
            <h2 className="text-base text-800">Manajemen Sesi Kerja</h2>
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
                  <Button icon="pi pi-check" type="submit" />
                  <Button icon="pi pi-times" severity="secondary" />
                </div>
              </div>
            </form>

            <div className="flex flex-column md:flex-row gap-3">
              <InputTextComponent
                icon="pi pi-search"
                placeholder="Cari berdasarkan Kode atau nama"
                className="w-full"
              />

              <div>
                <Button
                  icon="pi pi-plus"
                  label="Tambah"
                  pt={{
                    icon: { className: "mr-2" },
                  }}
                  onClick={() => {
                    setDialogMode("add");
                    setDialogLabel("Tambah Sesi");
                    setCurrentEditedId(null);
                    setIsDialogVisible(true);
                  }}
                />
              </div>
            </div>
          </div>

          {/* data table */}
          <DataTableSession
            attendanceSession={attendanceSessions}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onClose={handleClose}
          />
        </div>

        <ConfirmDialog />

        <Dialog
          header={dialogLabel}
          visible={isDialogVisible}
          onHide={() => {
            setIsDialogVisible(false);
            setDialogLabel(null);
            setViewSession(null);
          }}
          modal
          className="w-full md:w-4"
        >
          <div
            className={`${
              dialogMode === "edit" || dialogMode === "add" ? "block" : "hidden"
            }`}
          >
            <AttendanceSessionDialogForm
              sessionData={cleanSessionData}
              dialogMode={dialogMode}
              onSubmit={handleSubmit}
              isSubmitting={isSaving}
            />
          </div>

          <div className={`${dialogMode === "view" ? "block" : "hidden"}`}>
            <AttendanceSessionDialogView
              data={viewSession}
              isLoading={isLoading}
              dialogMode={dialogMode}
            />
          </div>
        </Dialog>
      </Card>
    </div>
  );
}
