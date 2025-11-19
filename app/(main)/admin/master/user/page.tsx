"use client";

import { User } from "lucide-react";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import InputTextComponent from "@/components/Input";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import UserDialogForm from "./components/UserDialogForm";
import { UserFormData } from "@/lib/schemas/userFormSchema";
import DataTableUser from "./components/DataTableUser";
import { Toast } from "primereact/toast";
import { GetAllEmployeeData } from "@/lib/types/employee";
import { GetAllUserData, GetUserByIdData } from "@/lib/types/user";
import UserDialogView from "./components/UserDialogView";
import { email } from "zod";

// interface CombinedUserData extends UserData {
//   employee_first_name: string;
// }

export default function UserPage() {
  const toastRef = useRef<Toast>(null);
  const isInitialLoad = useRef<boolean>(true);

  const [employee, setEmployee] = useState<GetAllEmployeeData[]>([]);
  const [user, setUser] = useState<GetAllUserData[]>([]);
  const [viewUser, setViewUser] = useState<GetUserByIdData | null>(null);

  const [currentEditedId, setCurrentEditedId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [dialogLabel, setDialogLabel] = useState<
    "Lihat Data User" | "Edit User" | "Tambah User" | null
  >(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [dialogMode, setDialogMode] = useState<"view" | "add" | "edit" | null>(
    null
  );

  const fetchAllUserData = async () => {
    setIsLoading(true);
    try {
      const [employeeRes, userRes] = await Promise.all([
        fetch("/api/admin/master/employee"),
        fetch("/api/admin/master/user"),
      ]);

      // const res = await fetch("/api/admin/master/user");

      if (!employeeRes.ok || !userRes.ok)
        throw new Error("Gagal mendapatkan data user dari server");

      const [employeeData, userData] = await Promise.all([
        employeeRes.json(),
        userRes.json(),
      ]);

      if (
        employeeData &&
        userData &&
        employeeData.status === "00" &&
        userData.status === "00"
      ) {
        if (isInitialLoad.current) {
          toastRef.current?.show({
            severity: "success",
            summary: "Sukses",
            detail: userData.message,
            life: 3000,
          });

          isInitialLoad.current = false;
        }
        setEmployee(employeeData.master_employees || []);
        setUser(userData.users || []);
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: "Gagal",
          detail: userData.message,
          life: 3000,
        });
        setEmployee([]);
        setUser([]);
      }
    } catch (error: any) {
      console.log(error.message);

      setEmployee([]);
      setUser([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserById = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/master/user/${id}`);

      if (!res.ok) {
        throw new Error("Gagal mendapatkan user bredasarkan id");
      }

      const responseData = await res.json();

      if (responseData && responseData.status === "00") {
        setViewUser(responseData.users || null);
      } else {
        setViewUser(null);
      }
    } catch (error: any) {
      console.log(error.message);

      setViewUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const cleanUserDataForm = useMemo(() => {
    if (!viewUser) {
      return null;
    }

    return {
      email: viewUser.email,
      role: viewUser.role,
    };
  }, [viewUser]);

  const handleSubmit = async (formData: UserFormData) => {
    setIsSaving(true);
    setIsLoading(true);

    const url =
      dialogMode === "edit"
        ? `/api/admin/master/user/${currentEditedId}`
        : "/api/admin/master/user";

    const method = dialogMode === "edit" ? "PUT" : "POST";

    const payload = {
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

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
        fetchAllUserData();
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: "Gagal",
          detail: response?.errors?.[0]?.message || "Gagal menyimpan data user",
          life: 3000,
        });
      }

      fetchAllUserData();
      setDialogMode(null);
      setIsDialogVisible(false);
      setCurrentEditedId(null);
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Terjadi kesalahan koneksi",
        life: 3000,
      });
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const handleView = (data: GetAllUserData) => {
    setDialogMode("view");
    setIsDialogVisible(true);
    setDialogLabel("Lihat Data User");
    fetchUserById(data.id);
  };

  const handleEdit = (data: GetAllUserData) => {
    setDialogMode("edit");
    setIsDialogVisible(true);
    setCurrentEditedId(data.id);
    setDialogLabel("Edit User");
    fetchUserById(data.id);
  };

  const handleDelete = (data: GetAllUserData) => {
    confirmDialog({
      icon: "pi pi-exclamation-triangle text-red-400 mr-2",
      header: "Konfirmasi Hapus",
      message: `Yakin ingin menghapus user ${data.email}`,
      acceptLabel: "Hapus",
      rejectLabel: "Batal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const res = await fetch(`/api/admin/master/user/${data.id}`, {
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

          fetchAllUserData();
        } catch (error: any) {
          toastRef.current?.show({
            severity: "error",
            summary: "Gagal",
            detail: error.message || "Terjadi kesalahan koneksi",
            life: 3000,
          });
        } finally {
          setCurrentEditedId(null);
        }
      },
    });
  };

  useEffect(() => {
    fetchAllUserData();
  }, []);

  return (
    <div>
      <Toast ref={toastRef} />
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <User className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Master Data User
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola data diri dan informasi User
          </p>
        </div>
      </div>

      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex gap-2 align-items-center">
            <User className="h-2" />
            <h2 className="text-base text-800">Master Data User</h2>
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
                    setIsDialogVisible(true);
                    setDialogLabel("Tambah User");
                    setCurrentEditedId(null);
                  }}
                />
              </div>
            </div>
          </div>

          {/* data table */}
          <DataTableUser
            data={user}
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
            setIsDialogVisible(false);
            setDialogLabel(null);
            setViewUser(null);
          }}
          modal
          className="w-full md:w-4"
        >
          <div
            className={`${dialogMode === "edit" || dialogMode === "add" ? "block" : "hidden"}`}
          >
            <UserDialogForm
              userData={cleanUserDataForm}
              onSubmit={handleSubmit}
              dialogMode={dialogMode}
              employeeOptions={employee}
              isSubmitting={isSaving}
            />
          </div>

          <div className={`${dialogMode === "view" ? "block" : "hidden"}`}>
            <UserDialogView
              data={viewUser}
              isLoading={isLoading}
              dialogMode={dialogMode}
            />
          </div>
        </Dialog>
      </Card>
    </div>
  );
}
