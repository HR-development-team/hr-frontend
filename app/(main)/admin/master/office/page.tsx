"use client";

import InputTextComponent from "@/components/Input";
import { Building, Diamond } from "lucide-react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import DataTableOffice from "./components/DataTableOffice";
import { useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { GetAllOfficeData, GetOfficeByIdData } from "@/lib/types/office";
import { OfficeFormData } from "@/lib/schemas/officeFormSchema";
import { Dialog } from "primereact/dialog";
import OfficeDialogForm from "./components/OfficeDialogForm";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { off } from "process";
import OfficeDialogView from "./components/OfficeDialogView";

export default function Office() {
  const toastRef = useRef<Toast>(null);
  const isInitialLoad = useRef<boolean>(true);

  const [office, setOffice] = useState<GetAllOfficeData[]>([]);
  const [viewOffice, setViewOffice] = useState<GetOfficeByIdData | null>(null);

  const [currentEditedId, setCurrentEditedId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [dialogMode, setDialogMode] = useState<"view" | "add" | "edit" | null>(
    null
  );
  const [dialogLabel, setDialogLabel] = useState<
    "Lihat Data Kantor" | "Edit Kantor" | "Tambah Kantor" | null
  >(null);

  const fetchAllOffice = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/master/office");

      if (!res.ok) {
        throw new Error("Gagal mendapatkan data kantor");
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
        setOffice(responseData.master_offices || []);
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: "Error",
          detail: responseData.message || "Gagal mendapatkan data kantor",
          life: 3000,
        });

        setOffice([]);
      }
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Gagal mendapatkan data kantor",
        life: 3000,
      });
      setOffice([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOfficeById = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/master/office/${id}`);

      if (!res.ok)
        throw new Error("Gagal mendapatkan data kantor berdasarkan id");

      const leaveTypeData = await res.json();

      if (leaveTypeData && leaveTypeData.status === "00") {
        setViewOffice(leaveTypeData.master_offices || null);
      } else {
        setViewOffice(null);
      }
    } catch (error: any) {
      console.log(error.message);

      setViewOffice(null);
    } finally {
      setIsLoading(false);
    }
  };

  const cleanOfficeDataForm = useMemo(() => {
    if (!viewOffice) {
      return null;
    }

    return {
      name: viewOffice.name,
      address: viewOffice.address,
      latitude: parseFloat(viewOffice.latitude),
      longitude: parseFloat(viewOffice.longitude),
      radius_meters: viewOffice.radius_meters,
    };
  }, [viewOffice]);

  const handleSubmit = async (formData: OfficeFormData) => {
    setIsSaving(true);

    console.log(JSON.stringify(formData));

    const url =
      dialogMode === "add"
        ? "/api/admin/master/office"
        : `/api/admin/master/office/${currentEditedId}`;

    const method = dialogMode === "add" ? "POST" : "PUT";

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
        fetchAllOffice();
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: "Error",
          detail: response.message,
          life: 3000,
        });
      }

      setDialogMode(null);
      setIsDialogVisible(false);
      setCurrentEditedId(null);
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleView = (office: GetAllOfficeData) => {
    setDialogMode("view");
    setIsDialogVisible(true);
    setDialogLabel("Lihat Data Kantor");
    fetchOfficeById(office.id);
  };

  const handleEdit = (office: GetAllOfficeData) => {
    setDialogMode("edit");
    setIsDialogVisible(true);
    setCurrentEditedId(office.id);
    setDialogLabel("Edit Kantor");
    fetchOfficeById(office.id);
  };

  const handleDelete = (office: GetAllOfficeData) => {
    confirmDialog({
      icon: "pi pi-exclamation-triangle text-red-400 mr-2",
      header: "Konfirmasi Hapus",
      message: `Yakin ingin menghapus Kantor ${office.name}`,
      acceptLabel: "Hapus",
      rejectLabel: "Batal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const res = await fetch(`/api/admin/master/office/${office.id}`, {
            method: "DELETE",
          });

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

          fetchAllOffice();
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
    fetchAllOffice();
  }, []);

  return (
    <div>
      <Toast ref={toastRef} />
      <div className="mb-6 flex align-items-center gap-3 mt-4">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <Building className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Master Data Kantor
          </h1>
          <p className="text-sm md:text-md text-gray-500">Kelola data kantor</p>
        </div>
      </div>

      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex gap-2 align-content-center">
            <Building className="h-2" />
            <h2 className="text-base text-800">Master Data Kantor</h2>
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
                    setDialogLabel("Tambah Kantor");
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <DataTableOffice
          data={office}
          isLoading={isLoading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ConfirmDialog />

        <Dialog
          header={dialogLabel}
          visible={isDialogVisible}
          onHide={() => {
            setDialogLabel(null);
            setIsDialogVisible(false);
            setViewOffice(null);
            setCurrentEditedId(null);
          }}
          modal
          className={dialogMode === 'view' ? 'w-full md:w-8' : 'w-full md:w-6'}
        >
          <div className={dialogMode !== "view" ? "block" : "hidden"}>
            <OfficeDialogForm
              officeData={cleanOfficeDataForm}
              onSubmit={handleSubmit}
              isSubmitting={isSaving}
            />
          </div>

          <div className={dialogMode === "view" ? "block" : "hidden"}>
            <OfficeDialogView
              data={viewOffice}
              isLoading={isLoading}
              dialogMode={dialogMode}
            />
          </div>
        </Dialog>
      </Card>
    </div>
  );
}
