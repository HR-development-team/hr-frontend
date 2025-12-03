"use client";

import { Building } from "lucide-react";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import InputTextComponent from "@/components/Input";
import { useEffect, useMemo, useRef, useState } from "react";
import { DepartementFormData } from "@/lib/schemas/departmentFormSchema";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import DataTableDepartment from "./components/DataTableDepartment";
import { Dialog } from "primereact/dialog";
import DepartmentDialogForm from "./components/DepartmentDialogForm";
import { Toast } from "primereact/toast";
import {
  GetAllDepartmentData,
  GetDepartmentByIdData,
} from "@/lib/types/department";
import DepartmentDialogView from "./components/DepartmentDialogView";
import { useFetch } from "@/lib/hooks/useFetch";

export default function Department() {
  const toastRef = useRef<Toast>(null);

  const [department, setDepartment] = useState<GetAllDepartmentData[]>([]);
  const [viewDepartment, setViewDepartment] =
    useState<GetDepartmentByIdData | null>(null);

  const [currentEditedId, setCurrentEditedId] = useState<number | null>(null);

  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [dialogMode, setDialogMode] = useState<"view" | "add" | "edit" | null>(
    null
  );
  const [dialogLabel, setDialogLabel] = useState<
    "Lihat Data Departement" | "Edit Departemen" | "Tambah Departemen" | null
  >(null);

  const { isLoading, fetchData, fetchDataById } = useFetch();

  const fetchAllDepartment = async () => {
    await fetchData({
      url: "/api/admin/master/department",
      toastRef: toastRef,
      onSuccess: (responseData) => {
        setDepartment(responseData.master_departments || []);
      },
      onError: () => {
        setDepartment([]);
      },
    });
  };

  const fetchDepartmentById = async (id: number) => {
    await fetchDataById({
      url: `/api/admin/master/department/${id}`,
      onSuccess: (responseData) => {
        setViewDepartment(responseData.master_departments || null);
      },
      onError: () => {
        setViewDepartment(null);
      },
    });
  };

  const handleSubmit = async (formData: DepartementFormData) => {
    setIsSaving(true);
    try {
      const method = dialogMode === "add" ? "POST" : "PUT";

      const url =
        dialogMode === "add"
          ? "/api/admin/master/department"
          : `/api/admin/master/department/${currentEditedId}`;

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

      fetchAllDepartment();
      setDialogMode(null);
      setIsDialogVisible(false);
      setCurrentEditedId(null);
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Gagal",
        detail: error.message,
        life: 3000,
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const cleanDepartmentData = useMemo(() => {
    if (!viewDepartment) {
      return null;
    }

    return {
      name: viewDepartment.name,
      description: viewDepartment.description,
    };
  }, [viewDepartment]);

  const handleView = (department: GetAllDepartmentData) => {
    setDialogMode("view");
    setIsDialogVisible(true);
    setDialogLabel("Lihat Data Departement");
    fetchDepartmentById(department.id);
  };

  const handleEdit = (department: GetAllDepartmentData) => {
    setDialogMode("edit");
    setIsDialogVisible(true);
    setCurrentEditedId(department.id);
    setDialogLabel("Edit Departemen");
    fetchDepartmentById(department.id);
  };

  const handleDelete = (department: GetAllDepartmentData) => {
    confirmDialog({
      icon: "pi pi-exclamation-triangle text-red-400 mr-2",
      header: "Konfirmasi Hapus",
      message: `Yakin ingin menghapus departemen ${department.name}`,
      acceptLabel: "Hapus",
      rejectLabel: "Batal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const res = await fetch(
            `/api/admin/master/department/${department.id}`,
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

          if (responseData && responseData.status === "00") {
            toastRef.current?.show({
              severity: "success",
              summary: "Sukses",
              detail: responseData.message,
              life: 3000,
            });

            fetchAllDepartment();
          } else {
            toastRef.current?.show({
              severity: "error",
              summary: "Error",
              detail: responseData.message,
              life: 3000,
            });
          }
        } catch (error: any) {
          toastRef.current?.show({
            severity: "error",
            summary: "Gagal",
            detail: error.message,
            life: 3000,
          });
        }
      },
    });
  };

  useEffect(() => {
    fetchAllDepartment();
  }, []);

  return (
    <div>
      <Toast ref={toastRef} />
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <Building className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Master Data Departemen
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola data departemen perusahaan
          </p>
        </div>
      </div>

      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex gap-2 align-items-center">
            <Building className="h-2" />
            <h2 className="text-base text-800">Master Data Departemen</h2>
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
                    setDialogLabel("Tambah Departemen");
                    setCurrentEditedId(null);
                    setIsDialogVisible(true);
                  }}
                />
              </div>
            </div>
          </div>

          {/* data table */}
          <DataTableDepartment
            data={department}
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
            setIsDialogVisible(false);
            setDialogLabel(null);
            setViewDepartment(null);
          }}
          modal
          className="w-full md:w-4"
        >
          <div
            className={`${
              dialogMode === "edit" || dialogMode === "add" ? "block" : "hidden"
            }`}
          >
            <DepartmentDialogForm
              departmentData={cleanDepartmentData}
              dialogMode={dialogMode}
              onSubmit={handleSubmit}
              isSubmitting={isSaving}
            />
          </div>

          <div className={`${dialogMode === "view" ? "block" : "hidden"}`}>
            <DepartmentDialogView
              data={viewDepartment}
              isLoading={isLoading}
              dialogMode={dialogMode}
            />
          </div>
        </Dialog>
      </Card>
    </div>
  );
}
