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
import {
  GetAllDepartmentData,
  GetDepartmentByIdData,
} from "@/lib/types/department";
import DepartmentDialogView from "./components/DepartmentDialogView";
import { useFetch } from "@/lib/hooks/useFetch";
import { GetAllOfficeData } from "@/lib/types/office";
import { useSubmit } from "@/lib/hooks/useSubmit";
import { useDelete } from "@/lib/hooks/useDelete";
import { useToastContext } from "@/components/ToastProvider";
import { FormikHelpers } from "formik";

export default function Department() {
  const isInitialLoad = useRef<boolean>(true);

  const [office, setOffice] = useState<GetAllOfficeData[]>([]);
  const [department, setDepartment] = useState<GetAllDepartmentData[]>([]);
  const [viewDepartment, setViewDepartment] =
    useState<GetDepartmentByIdData | null>(null);

  const [currentEditedId, setCurrentEditedId] = useState<number | null>(null);

  const [isOfficeLoading, setIsOfficeLoading] = useState<boolean>(false);
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);

  const [dialogMode, setDialogMode] = useState<"view" | "add" | "edit" | null>(
    null
  );
  const [dialogLabel, setDialogLabel] = useState<
    "Lihat Data Departement" | "Edit Departemen" | "Tambah Departemen" | null
  >(null);

  const { isLoading, fetchData, fetchDataById, fetchMultiple } = useFetch();
  const { isSaving, submitData } = useSubmit();
  const deleteData = useDelete();

  const { showToast } = useToastContext();

  const fetchAllDepartment = async () => {
    await fetchData({
      url: "/api/admin/master/department",
      showToast: showToast,
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
        setViewDepartment(responseData.departments || null);
      },
      onError: () => {
        setViewDepartment(null);
      },
    });
  };

  const fetchAllOffice = async () => {
    if (isInitialLoad.current) {
      setIsOfficeLoading(true);

      await fetchMultiple({
        urls: ["/api/admin/master/office"],
        onSuccess: (resultArray) => {
          const [officeData] = resultArray;
          setOffice(officeData.offices || []);
        },
        onError: () => {
          setOffice([]);
        },
      });

      setIsOfficeLoading(false);
    }

    isInitialLoad.current = false;
  };

  const handleSubmit = async (
    formData: DepartementFormData,
  ) => {
    const method = dialogMode === "add" ? "POST" : "PUT";

    const url =
      dialogMode === "add"
        ? "/api/admin/master/department"
        : `/api/admin/master/department/${currentEditedId}`;

    await submitData({
      url: url,
      payload: formData,
      showToast: showToast,
      onSuccess: () => {
        fetchAllDepartment();
        setDialogMode(null);
        setIsDialogVisible(false);
        setCurrentEditedId(null);
      },
      method: method,
    });
  };

  const cleanDepartmentData = useMemo(() => {
    if (!viewDepartment) {
      return null;
    }

    return {
      office_code: viewDepartment.office_code,
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
    fetchAllOffice();
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
        await deleteData({
          url: `/api/admin/master/department/${department.id}`,
          onSuccess: () => fetchAllDepartment(),
          showToast: showToast,
        });
      },
    });
  };

  useEffect(() => {
    fetchAllDepartment();
  }, []);

  return (
    <div>
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
                  severity="info"
                  pt={{
                    icon: { className: "mr-2" },
                  }}
                  onClick={() => {
                    setDialogMode("add");
                    setDialogLabel("Tambah Departemen");
                    setCurrentEditedId(null);
                    setIsDialogVisible(true);
                    fetchAllOffice();
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
              officeOptions={office}
              onSubmit={handleSubmit}
              isSubmitting={isSaving}
              isOfficeLoading={isOfficeLoading}
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
