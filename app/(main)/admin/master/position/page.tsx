"use client";

import { GitFork, UserCheck } from "lucide-react";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import InputTextComponent from "@/components/Input";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import PositionDialogForm from "./components/PositionDialogForm";
import DataTablePosition from "./components/DataTablePosition";
import { PositionFormData } from "@/lib/schemas/positionFormSchema";
import { GetAllPositionData, GetPositionByIdData } from "@/lib/types/position";
import { GetAllDivisionData } from "@/lib/types/division";
import PositionDialogView from "./components/PositionDialogView";

export default function Position() {
  const toastRef = useRef<Toast>(null);
  const isInitialLoad = useRef<boolean>(true);

  const [division, setDivision] = useState<GetAllDivisionData[]>([]);
  const [position, setPosition] = useState<GetAllPositionData[]>([]);
  const [viewPosition, setViewPosition] = useState<GetPositionByIdData | null>(
    null
  );

  const [currentEditedId, setCurrentEditedId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [dialogMode, setDialogMode] = useState<"view" | "add" | "edit" | null>(
    null
  );
  const [dialogLabel, setDialogLabel] = useState<
    "Lihat Data Posisi" | "Edit Posisi" | "Tambah Posisi" | null
  >(null);

  const fetchAllPosition = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/master/position");

      if (!res.ok) {
        throw new Error("Gagal mendapatkan data posisi");
      }

      const responseData = await res.json();

      if (responseData && responseData.status === "00") {
        if (isInitialLoad.current) {
          toastRef.current?.show({
            severity: "success",
            summary: "Sukses",
            detail: responseData.message,
            life: 3000,
          });
          isInitialLoad.current = false;
        }
        setPosition(responseData.master_positions || []);
      }
    } catch (error: any) {
      setPosition([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPositionById = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/master/position/${id}`);

      if (!res.ok) {
        throw new Error("Gagal mendapatkan data posisi berdasarkan id");
      }

      const responseData = await res.json();
      console.log(`Status Position: ${responseData.status} dan id: ${id}`);

      if (responseData && responseData.status === "00") {
        setViewPosition(responseData.master_positions || null);
      }

      console.log(viewPosition);
    } catch (error: any) {
      setViewPosition(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDivision = async () => {
    try {
      const res = await fetch("/api/admin/master/division");

      if (!res.ok) {
        throw new Error("Gagal mendapatkan data divisi");
      }

      const responseData = await res.json();

      if (responseData && responseData.status === "00") {
        setDivision(responseData.master_divisions || []);
      }
    } catch (error) {
      setDivision([]);
    }
  };

  const cleanPositionDataForm = useMemo(() => {
    if (!viewPosition) {
      return null;
    }

    const {
      id,
      position_code,
      created_at,
      updated_at,
      division_name,
      department_code,
      department_name,
      ...cleanData
    } = viewPosition;

    return {
      ...cleanData,
    };
  }, [viewPosition]);

  const handleSubmit = async (formData: PositionFormData) => {
    setIsSaving(true);
    setIsLoading(true);

    const {} = formData;

    const url =
      dialogMode === "edit"
        ? `/api/admin/master/position/${currentEditedId}`
        : "/api/admin/master/position";

    const method = dialogMode === "edit" ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        body: JSON.stringify(formData),
      });

      const response = await res.json();

      if (response && response.status === "00") {
        toastRef.current?.show({
          severity: "success",
          summary: "Sukses",
          detail: response.message,
          life: 3000,
        });
        fetchAllPosition();
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: "Gagal",
          detail: response.error[0].message || "Gagal menyimpan data divisi",
          life: 3000,
        });
      }

      fetchAllPosition();
      setDialogMode(null);
      setIsDialogVisible(false);
      setCurrentEditedId(null);
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Terjadi kesalahan koneksi",
        life: 3000,
      });
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const handleView = (position: GetAllPositionData) => {
    setDialogMode("view");
    setIsDialogVisible(true);
    setDialogLabel("Lihat Data Posisi");
    fetchPositionById(position.id);
  };

  const handleEdit = (position: GetAllPositionData) => {
    setDialogMode("edit");
    setIsDialogVisible(true);
    setCurrentEditedId(position.id);
    setDialogLabel("Edit Posisi");
    fetchPositionById(position.id);
  };

  const handleDelete = (position: GetAllPositionData) => {
    confirmDialog({
      icon: "pi pi-exclamation-triangle text-red-400 mr-2",
      header: "Konfirmasi Hapus",
      message: `Yakin ingin menghapus posisi ${position.name}`,
      acceptLabel: "Hapus",
      rejectLabel: "Batal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const res = await fetch(`/api/admin/master/position/${position.id}`, {
            method: "DELETE",
          });

          const responseData = await res.json();

          if (!res.ok)
            throw new Error(
              responseData.message || "Terjadi kesalahan koneksi"
            );

          toastRef.current?.show({
            severity: "success",
            summary: "Sukses",
            detail: responseData.message || "Data berhasil dihapus",
            life: 3000,
          });

          fetchAllPosition();
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
    fetchAllPosition();
    fetchDivision();
  }, []);

  return (
    <div>
      <Toast ref={toastRef} />
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <UserCheck className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Master Data Posisi
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola data posisi atau jabatan
          </p>
        </div>
      </div>

      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex gap-2 align-items-center">
            <UserCheck className="h-2" />
            <h2 className="text-base text-800">Master Data Posisi</h2>
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

            {/* search filter and add button */}
            <div className="flex flex-column md:flex-row gap-3">
              {/* search */}
              <InputTextComponent
                icon="pi pi-search"
                placeholder="Cari berdasarkan Kode atau nama"
                className="w-full"
              />

              {/* add button */}
              <div>
                <Button
                  icon="pi pi-plus"
                  label="Tambah"
                  pt={{
                    icon: { className: "mr-2" },
                  }}
                  onClick={() => {
                    setDialogMode("add");
                    setIsDialogVisible(true);
                    setCurrentEditedId(null);
                    setDialogLabel("Tambah Posisi");
                  }}
                />
              </div>
            </div>
          </div>

          {/* data table */}
          <DataTablePosition
            data={position}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>

        <ConfirmDialog />

        <Dialog
          header={dialogLabel}
          visible={isDialogVisible}
          onHide={() => {
            setDialogLabel(null);
            setIsDialogVisible(false);
            setViewPosition(null);
          }}
          modal
          className="w-full md:w-4"
        >
          <div
            className={
              dialogMode === "add" || dialogMode === "edit" ? "block" : "hidden"
            }
          >
            <PositionDialogForm
              positionData={cleanPositionDataForm}
              onSubmit={handleSubmit}
              divisionOptions={division}
              isSubmitting={isSaving}
            />
          </div>

          <div className={dialogMode === "view" ? "block" : "hidden"}>
            <PositionDialogView
              data={viewPosition}
              isLoading={isLoading}
              dialogMode={dialogMode}
            />
          </div>
        </Dialog>
      </Card>
    </div>
  );
}
