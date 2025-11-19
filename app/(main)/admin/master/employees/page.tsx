"use client";

import { Users } from "lucide-react";
import { Card } from "primereact/card";
import DataTableEmployees from "./components/DataTableEmployees";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import InputTextComponent from "@/components/Input";
import EmployeeDialogForm from "./components/EmployeeDialogForm";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import EmployeeDialogView from "./components/EmployeeDialogView";
import { GetAllEmployeeData, GetEmployeeByIdData } from "@/lib/types/employee";
import { GetAllPositionData } from "@/lib/types/position";
import { EmployeeFormData } from "@/lib/schemas/employeeFormSchema";
import { format } from "date-fns";
import { GetAllUserData } from "@/lib/types/user";

export default function Employees() {
  const toastRef = useRef<Toast>(null);
  const isInitialLoad = useRef<boolean>(true);

  const [allEmployee, setAllEmployee] = useState<GetAllEmployeeData[]>([]);
  const [viewEmployee, setViewEmployee] = useState<GetEmployeeByIdData | null>(
    null
  );

  const [position, setPosition] = useState<GetAllPositionData[]>([]);
  const [user, setUser] = useState<GetAllUserData[]>([]);

  const [currentSelectedId, setCurrentSelectedId] = useState<number | null>(
    null
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [dialogMode, setDialogMode] = useState<"view" | "add" | "edit" | null>(
    null
  );
  const [dialogLabel, setDialogLabel] = useState<
    "Lihat Data Karyawan" | "Edit Karyawan" | "Tambah Karyawan" | null
  >(null);

  const fetchAllEmployee = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/master/employee");

      if (!res.ok) {
        throw new Error("Gagal mendapatkan data semua karyawan");
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
        setAllEmployee(responseData.master_employees || []);
      }
    } catch (error: any) {
      setAllEmployee([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeById = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/master/employee/${id}`);

      if (!res.ok) {
        throw new Error("Gagal mendapatkan data karyawan berdasarkan id");
      }

      const responseData = await res.json();

      if (responseData && responseData.status === "00") {
        setViewEmployee(responseData.master_employees || null);
      }
    } catch (error: any) {
      setViewEmployee(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPositionAndUser = async () => {
    try {
      const [positionRes, userRes] = await Promise.all([
        fetch("/api/admin/master/position"),
        fetch("/api/admin/master/user"),
      ]);

      if (!positionRes.ok || !userRes.ok) {
        throw new Error("Gagal mendapatkan data posisi");
      }

      const positionData = await positionRes.json();
      const userData = await userRes.json();

      if (
        positionData &&
        userData &&
        positionData.status === "00" &&
        userData.status === "00"
      ) {
        setPosition(positionData.master_positions || []);
        setUser(userData.users || []);
      } else {
        setPosition([]);
        setUser([]);
      }
    } catch (error) {
      setPosition([]);
      setUser([]);
    }
  };

  const cleanEmployeeDataForm = useMemo(() => {
    if (!viewEmployee) {
      return null;
    }

    const {
      id,
      employee_code,
      position_name,
      division_code,
      division_name,
      department_code,
      department_name,
      updated_at,
      created_at,

      join_date,
      birth_date,
      resign_date,
      profile_picture,
      ...cleanData
    } = viewEmployee;

    return {
      ...cleanData,

      join_date: new Date(join_date),
      birth_date: birth_date ? new Date(birth_date) : null,
      profile_picture:
        typeof profile_picture === "string" ? profile_picture : null,
    };
  }, [viewEmployee]);

  const handleSubmit = async (formData: EmployeeFormData) => {
    setIsSaving(true);
    setIsLoading(true);

    const { join_date, contact_phone, birth_date, ...restOfValues } = formData;

    const formattedBirthDate = birth_date
      ? format(birth_date, "yyyy-MM-dd")
      : null;

    console.log(`Format birth date: ${formattedBirthDate}`);

    const payload: any = {
      ...restOfValues,

      contact_phone: contact_phone?.toString(),
      birth_date: formattedBirthDate,
    };

    if (dialogMode !== "edit") {
      payload.join_date = join_date.toISOString().split("T")[0];
    }

    const url =
      dialogMode === "edit"
        ? `/api/admin/master/employee/${currentSelectedId}`
        : "/api/admin/master/employee";

    const method = dialogMode === "edit" ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        body: JSON.stringify(payload),
      });

      const response = await res.json();

      if (response && response.status === "00") {
        toastRef.current?.show({
          severity: "success",
          summary: "Sukses",
          detail: response.message,
          life: 3000,
        });
        fetchAllEmployee();
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: "Gagal",
          detail:
            response?.errors?.[0]?.message || "Gagal menyimpan data karyawan",
          life: 3000,
        });
      }

      fetchAllEmployee();
      setDialogMode(null);
      setIsDialogVisible(false);
      setCurrentSelectedId(null);
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: error,
        life: 3000,
      });
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const handleView = (employee: GetAllEmployeeData) => {
    setDialogMode("view");
    setIsDialogVisible(true);
    setDialogLabel("Lihat Data Karyawan");
    fetchEmployeeById(employee.id);
  };

  const handleEdit = (employee: GetAllEmployeeData) => {
    setDialogMode("edit");
    setIsDialogVisible(true);
    setCurrentSelectedId(employee.id);
    setDialogLabel("Edit Karyawan");
    fetchEmployeeById(employee.id);
  };

  const handleDelete = (employee: GetAllEmployeeData) => {
    confirmDialog({
      icon: "pi pi-exclamation-triangle text-red-400 mr-2",
      header: "Konfirmasi Hapus",
      message: `Yakin ingin menghapus karyawan ${employee.full_name}`,
      acceptLabel: "Hapus",
      rejectLabel: "Batal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const res = await fetch(`/api/admin/master/employee/${employee.id}`, {
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

          fetchAllEmployee();
        } catch (error: any) {
          toastRef.current?.show({
            severity: "error",
            summary: "Gagal",
            detail: error.message,
            life: 3000,
          });
        } finally {
          setCurrentSelectedId(null);
        }
      },
    });
  };

  useEffect(() => {
    fetchAllEmployee();
    fetchPositionAndUser();
  }, []);

  return (
    <div>
      <Toast ref={toastRef} />
      <div className="mb-6 flex align-items-center gap-3 mt-4">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <Users className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Master Data Karyawan
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola data diri dan informasi karyawan
          </p>
        </div>
      </div>

      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex gap-2 align-items-center">
            <Users className="h-2" />
            <h2 className="text-base text-800">Master Data Karyawan</h2>
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
                    setDialogLabel("Tambah Karyawan");
                    setIsDialogVisible(true);
                    setCurrentSelectedId(null);
                  }}
                />
              </div>
            </div>
          </div>

          {/* data table */}
          <DataTableEmployees
            data={allEmployee}
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
            setViewEmployee(null);
          }}
          modal
          className={`w-full ${dialogMode === "view" ? "md:w-9" : "md:w-4"}`}
        >
          <div
            className={`${
              dialogMode === "edit" || dialogMode === "add" ? "block" : "hidden"
            }`}
          >
            <EmployeeDialogForm
              employeeData={cleanEmployeeDataForm}
              dialogMode={dialogMode}
              onSubmit={handleSubmit}
              positionOptions={position}
              userOptions={user}
              isSubmitting={isSaving}
            />
          </div>

          <div className={`${dialogMode === "view" ? "block" : "hidden"}`}>
            <EmployeeDialogView
              data={viewEmployee}
              isLoading={isLoading}
              dialogMode={dialogMode}
            />
          </div>
        </Dialog>
      </Card>
    </div>
  );
}
