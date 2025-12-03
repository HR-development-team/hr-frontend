"use client";

import { GitFork } from "lucide-react";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import InputTextComponent from "@/components/Input";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { GetAllDivisionData, GetDivisionByIdData } from "@/lib/types/division";
import DivisionDialogForm from "./components/DivisionDialogForm";
import DivisionDialogView from "./components/DivisionDialogView";
import DataTableDivision from "./components/DataTableDivision";
import { DivisionFormData } from "@/lib/schemas/divisionFormSchema";
import { GetAllDepartmentData } from "@/lib/types/department";
import { useFetch } from "@/lib/hooks/useFetch";

export default function Position() {
  const toastRef = useRef<Toast>(null);

  const [department, setDepartment] = useState<GetAllDepartmentData[]>([]);
  const [division, setDivision] = useState<GetAllDivisionData[]>([]);
  const [viewDivision, setViewDivision] = useState<GetDivisionByIdData | null>(
    null
  );

  const [currentEditedId, setCurrentEditedId] = useState<number | null>(null);

  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [dialogMode, setDialogMode] = useState<"view" | "add" | "edit" | null>(
    null
  );
  const [dialogLabel, setDialogLabel] = useState<
    "Lihat Data Divisi" | "Edit Divisi" | "Tambah Divisi" | null
  >(null);

  const { isLoading, fetchData, fetchDataById } = useFetch();

  const fetchAllDivision = async () => {
    await fetchData({
      url: "/api/admin/master/division",
      toastRef: toastRef,
      onSuccess: (responseData) => {
        setDivision(responseData.master_divisions || []);
      },
      onError: () => {
        setDivision([]);
      },
    });
  };

  const fetchDivisionById = async (id: number) => {
    await fetchDataById({
      url: `/api/admin/master/division/${id}`,
      onSuccess: (responseData) => {
        setViewDivision(responseData.master_divisions || null);
      },
      onError: () => {
        setViewDivision(null);
      },
    });
  };

  const fetchDepartment = async () => {
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

  const cleanDivisionDataForm = useMemo(() => {
    if (!viewDivision) {
      return null;
    }

    return {
      department_code: viewDivision.department_code,
      name: viewDivision.name,
      description: viewDivision.description,
    };
  }, [viewDivision]);

  const handleSubmit = async (formData: DivisionFormData) => {
    setIsSaving(true);

    const {} = formData;

    const url =
      dialogMode === "edit"
        ? `/api/admin/master/division/${currentEditedId}`
        : "/api/admin/master/division";

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
        fetchAllDivision();
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: "Gagal",
          detail: response.error[0].message || "Gagal menyimpan data divisi",
          life: 3000,
        });
      }

      fetchAllDivision();
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
    }
  };

  const handleView = (division: GetAllDivisionData) => {
    setDialogMode("view");
    setIsDialogVisible(true);
    setDialogLabel("Lihat Data Divisi");
    fetchDivisionById(division.id);
  };

  const handleEdit = (division: GetAllDivisionData) => {
    setDialogMode("edit");
    setIsDialogVisible(true);
    setCurrentEditedId(division.id);
    setDialogLabel("Edit Divisi");
    fetchDivisionById(division.id);
  };

  const handleDelete = (division: GetAllDivisionData) => {
    confirmDialog({
      icon: "pi pi-exclamation-triangle text-red-400 mr-2",
      header: "Konfirmasi Hapus",
      message: `Yakin ingin menghapus posisi ${division.name}`,
      acceptLabel: "Hapus",
      rejectLabel: "Batal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const res = await fetch(`/api/admin/master/division/${division.id}`, {
            method: "DELETE",
          });

          const responseData = await res.json();

          if (!res.ok)
            throw new Error(
              responseData.message || "Gagal menghapus data divisi"
            );

          toastRef.current?.show({
            severity: "success",
            summary: "Sukses",
            detail: responseData.message || "Data berhasil dihapus",
            life: 3000,
          });

          fetchAllDivision();
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
    fetchAllDivision();
    fetchDepartment();
  }, []);

  return (
    <div>
      <Toast ref={toastRef} />
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <GitFork className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Master Data Divisi
          </h1>
          <p className="text-sm md:text-md text-gray-500">Kelola data divisi</p>
        </div>
      </div>

      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex gap-2 align-items-center">
            <GitFork className="h-2" />
            <h2 className="text-base text-800">Master Data Divisi</h2>
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
                    setDialogLabel("Tambah Divisi");
                  }}
                />
              </div>
            </div>
          </div>

          {/* data table */}
          <DataTableDivision
            data={division}
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
            setViewDivision(null);
          }}
          modal
          className="w-full md:w-4"
        >
          <div
            className={
              dialogMode === "add" || dialogMode === "edit" ? "block" : "hidden"
            }
          >
            <DivisionDialogForm
              divisionData={cleanDivisionDataForm}
              onSubmit={handleSubmit}
              departmentOptions={department}
              isSubmitting={isSaving}
            />
          </div>

          <div className={dialogMode === "view" ? "block" : "hidden"}>
            <DivisionDialogView
              data={viewDivision}
              isLoading={isLoading}
              dialogMode={dialogMode}
            />
          </div>
        </Dialog>
      </Card>
    </div>
  );
}
