"use client";

import InputTextComponent from "@/components/Input";
import { Building } from "lucide-react";
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
import OfficeDialogView from "./components/OfficeDialogView";
import { useFetch } from "@/lib/hooks/useFetch";
import { useSubmit } from "@/lib/hooks/useSubmit";
import { useDelete } from "@/lib/hooks/useDelete";

export default function Office() {
  const toastRef = useRef<Toast>(null);

  const [office, setOffice] = useState<GetAllOfficeData[]>([]);
  const [viewOffice, setViewOffice] = useState<GetOfficeByIdData | null>(null);

  const [currentEditedId, setCurrentEditedId] = useState<number | null>(null);

  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);

  const [dialogMode, setDialogMode] = useState<"view" | "add" | "edit" | null>(
    null
  );
  const [dialogLabel, setDialogLabel] = useState<
    "Lihat Data Kantor" | "Edit Kantor" | "Tambah Kantor" | null
  >(null);

  const { isLoading, fetchData, fetchDataById } = useFetch();
  const { isSaving, submitData } = useSubmit();
  const deleteData = useDelete();

  const fetchAllOffice = async () => {
    await fetchData({
      url: "/api/admin/master/office",
      toastRef: toastRef,
      onSuccess: (responseData) => {
        setOffice(responseData.master_offices || []);
      },
      onError: () => {
        setOffice([]);
      },
    });
  };

  const fetchOfficeById = async (id: number) => {
    await fetchDataById({
      url: `/api/admin/master/office/${id}`,
      onSuccess: (responseData) => {
        setViewOffice(responseData.master_offices || null);
      },
      onError: () => {
        setViewOffice(null);
      },
    });
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
      // sort_order: viewOffice.sort_order,
      // description: viewOffice.description,
    };
  }, [viewOffice]);

  const handleSubmit = async (formData: OfficeFormData) => {
    const url =
      dialogMode === "add"
        ? "/api/admin/master/office"
        : `/api/admin/master/office/${currentEditedId}`;

    const method = dialogMode === "add" ? "POST" : "PUT";

    await submitData({
      url: url,
      payload: formData,
      toastRef: toastRef,
      onSuccess: () => {
        fetchAllOffice();
        setDialogMode(null);
        setIsDialogVisible(false);
        setCurrentEditedId(null);
      },
      method: method,
    });
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
        await deleteData({
          url: `/api/admin/master/office/${office.id}`,
          onSuccess: () => fetchAllOffice(),
          toastRef: toastRef,
        });
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

          <DataTableOffice
            data={office}
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
            setViewOffice(null);
            setCurrentEditedId(null);
          }}
          modal
          className={dialogMode === "view" ? "w-full md:w-8" : "w-full md:w-6"}
        >
          <div className={dialogMode !== "view" ? "block" : "hidden"}>
            <OfficeDialogForm
              officeData={cleanOfficeDataForm}
              officeOptions={office}
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
