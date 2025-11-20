"use client";

import { ChartPie, PieChart } from "lucide-react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import DataTableLeaveBalance from "./components/DataTableLeaveBalance";
import { Toast } from "primereact/toast";
import { GetAllLeaveBalanceData } from "@/lib/types/leaveBalance";
import { useEffect, useRef, useState } from "react";
import { LeaveBalanceFormData } from "@/lib/schemas/leaveBalanceFormSchema";
import { GetAllLeaveTypeData } from "@/lib/types/leaveType";
import { Dialog } from "primereact/dialog";
import LeaveBalanceDialogForm from "./components/LeaveBalanceDialogForm";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { GetAllEmployeeData } from "@/lib/types/employee";

export default function BalanceManagement() {
  const toastRef = useRef<Toast>(null);
  const isInitialLoad = useRef<boolean>(true);
  const isInitialFetchEmployee = useRef<boolean>(true);

  const [employee, setEmployee] = useState<GetAllEmployeeData[]>([]);

  const [leaveBalance, setLeaveBalance] = useState<GetAllLeaveBalanceData[]>(
    []
  );
  const [selectedLeaveBalance, setSelectedLeaveBalance] =
    useState<GetAllLeaveBalanceData | null>(null);
  const [leaveType, setLeaveType] = useState<GetAllLeaveTypeData[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [currentSelectedId, setCurrentSelectedId] = useState<number | null>(
    null
  );

  const [yearOptions, setYearOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [filterYearQuery, setFilterYearQuery] = useState<number | null>(null);

  const [typeCodeOptions, setTypeCodeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [filterTypeCodeQuery, setFilterTypeCodeQuery] = useState<string | null>(
    null
  );

  const [dialogMode, setDialogMode] = useState<
    "bulkAdd" | "bulkDelete" | "singleAdd" | "edit" | null
  >(null);
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [dialogLabel, setDialogLabel] = useState<
    | "Tambah Saldo Cuti Massal"
    | "Tambah Saldo Cuti Karyawan"
    | "Edit Saldo Cuti"
    | "Hapus Saldo Cuti Massal"
    | null
  >(null);

  const fetchLeaveBalance = async () => {
    setIsLoading(true);

    const isFilteringByYear =
      filterYearQuery !== null || filterTypeCodeQuery !== null;

    const searchYearQuery = filterYearQuery ? String(filterYearQuery) : "";

    const searchTypeCodeQuery = filterTypeCodeQuery
      ? encodeURIComponent(filterTypeCodeQuery)
      : "";

    try {
      const res = await fetch(
        `/api/admin/transaction/leave-balance?type_code=${searchTypeCodeQuery}&year=${searchYearQuery}`
      );

      if (!res.ok) {
        throw new Error("Gagal mendapatkan data saldo cuti");
      }

      const responseData = await res.json();

      if (responseData && responseData.status === "00") {
        if (isInitialLoad.current) {
          toastRef.current?.show({
            severity: "success",
            summary: "Sukses",
            detail: responseData.message,
          });
          isInitialLoad.current = false;
        }

        setLeaveBalance(responseData.leave_balances || []);

        const data = responseData.leave_balances || [];

        if (!isFilteringByYear) {
          const allYears = data.map(
            (item: GetAllLeaveBalanceData) => item.year
          );
          const uniqueYears = Array.from(new Set(allYears)) as number[];

          setYearOptions(
            uniqueYears.sort().map((year) => ({
              label: String(year),
              value: year,
            }))
          );

          const uniqueTypesMap = new Map();

          data.forEach((item: GetAllLeaveBalanceData) => {
            if (!uniqueTypesMap.has(item.type_code)) {
              uniqueTypesMap.set(item.type_code, item.leave_type_name);
            }
          });

          const typeOptions = Array.from(uniqueTypesMap.entries()).map(
            ([code, name]) => ({
              label: name as string,
              value: code,
            })
          );

          setTypeCodeOptions(typeOptions);
        }
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: "Error",
          detail: responseData.message || "Gagal mendapatkan data saldo cuti",
        });

        setLeaveBalance([]);
      }
    } catch (error: any) {
      console.log(error.message);
      setLeaveBalance([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaveType = async () => {
    try {
      const res = await fetch("/api/admin/master/leave-type");

      if (!res.ok) {
        throw new Error("Gagal mendapatkan data tipe cuti");
      }

      const responseData = await res.json();

      if (responseData && responseData.status === "00") {
        setLeaveType(responseData.leave_types || []);
      } else {
        setLeaveType([]);
      }
    } catch (error: any) {
      console.log(error.message);
      setLeaveType([]);
    }
  };

  const fetchEmployee = async () => {
    setIsEmployeeLoading(true);
    try {
      if (isInitialFetchEmployee.current) {
        const res = await fetch("/api/admin/master/employee");

        if (!res.ok) {
          throw new Error("Gagal mendapatkan data semua karyawan");
        }

        const responseData = await res.json();

        if (responseData && responseData.status === "00") {
          setEmployee(responseData.master_employees || []);
        } else {
          setEmployee([]);
        }
      }

      isInitialFetchEmployee.current = false;
    } catch (error: any) {
      setEmployee([]);
    } finally {
      setIsEmployeeLoading(false);
    }
  };

  const handleSubmit = async (formData: LeaveBalanceFormData) => {
    setIsSaving(true);

    const typeCodeQuery = encodeURIComponent(formData.type_code);
    const yearQuery = encodeURIComponent(String(formData.year));

    const url =
      dialogMode === "bulkAdd"
        ? "/api/admin/transaction/leave-balance/bulk"
        : dialogMode === "singleAdd"
          ? "/api/admin/transaction/leave-balance"
          : dialogMode === "bulkDelete"
            ? `/api/admin/transaction/leave-balance/bulk?type_code=${typeCodeQuery}&year=${yearQuery}`
            : `/api/admin/transaction/leave-balance/${currentSelectedId}`;

    const method =
      dialogMode === "bulkAdd" || dialogMode === "singleAdd"
        ? "POST"
        : dialogMode === "bulkDelete"
          ? "DELETE"
          : "PUT";

    const payload = {
      type_code: formData.type_code,
      balance: formData.balance,
      year: formData.year,
      ...((dialogMode === "edit" || dialogMode === "singleAdd") && {
        employee_code: formData.employee_code,
      }),
    };

    console.log(payload);

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
        fetchLeaveBalance();
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
      setCurrentSelectedId(null);
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Terjadi kesalahan koneksi",
        life: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (data: GetAllLeaveBalanceData) => {
    setDialogMode("edit");
    setDialogLabel("Edit Saldo Cuti");
    setIsDialogVisible(true);
    setCurrentSelectedId(data.id);
    setSelectedLeaveBalance(data);
  };

  const handleDelete = async (data: GetAllLeaveBalanceData) => {
    confirmDialog({
      icon: "pi pi-exclamation-triangle text-red-400 mr-2",
      header: "Konfirmasi Hapus Saldo Cuti",
      message: `Apakah Anda yakin ingin menghapus saldo cuti ${data.leave_type_name} untuk karyawan ${data.employee_name} pada tahun ${data.year}?`,
      acceptLabel: "Hapus",
      rejectLabel: "Batal",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const res = await fetch(
            `/api/admin/transaction/leave-balance/${data.id}`,
            {
              method: "DELETE",
            }
          );

          const responseData = await res.json();

          if (!res.ok) {
            throw new Error(
              responseData.message || "Gagal menghapus saldo cuti"
            );
          }

          if (responseData && responseData.status === "00") {
            toastRef.current?.show({
              severity: "success",
              summary: "Sukses",
              detail: responseData.message,
              life: 3000,
            });
            fetchLeaveBalance();
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
            summary: "Error",
            detail: error.message,
            life: 3000,
          });
        }
      },
    });
  };

  useEffect(() => {
    fetchLeaveBalance();
  }, [filterYearQuery, filterTypeCodeQuery]);

  useEffect(() => {
    fetchLeaveType();
  }, []);

  return (
    <div>
      <Toast ref={toastRef} />
      <div className="mb-6 flex align-items-center gap-3 mt-4">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <ChartPie className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Managemen Saldo Cuti
          </h1>

          <p className="text-sm md:text-md text-gray-500">
            Kelola saldo cuti untuk semua atau salah satu karyawan
          </p>
        </div>
      </div>

      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex gap-2 align-items-center">
            <PieChart className="h-2" />
            <h2 className="text-base text-800">Kelola Saldo Cuti Karyawan</h2>
          </div>

          {/* filters */}
          <div>
            <div className="flex flex-column md:flex-row md:justify-content-between gap-3">
              <div className="flex flex-column md:flex-row gap-3">
                {/* type code search */}
                <Dropdown
                  value={filterTypeCodeQuery}
                  options={typeCodeOptions}
                  onChange={(e) => setFilterTypeCodeQuery(e.value)}
                  placeholder="Pilih Tipe Cuti"
                  showClear
                  className="w-full md:w-15rem mr-2"
                  emptyMessage="Tidak ada opsi tipe cuti"
                />

                {/* year search */}
                <Dropdown
                  value={filterYearQuery}
                  options={yearOptions}
                  onChange={(e) => setFilterYearQuery(e.value)}
                  placeholder="Pilih Tahun"
                  showClear
                  className="w-full md:w-15rem"
                  emptyMessage="Tidak ada opsi tahun"
                />
              </div>

              {/* add button */}
              <div className="flex gap-2">
                <Button
                  icon="pi pi-plus"
                  // label="Tambah Saldo Massal"
                  severity="info"
                  pt={
                    {
                      // icon: { className: "mr-2" },
                      // root: { className: "w-full md:w-15rem" },
                    }
                  }
                  onClick={() => {
                    setDialogMode("bulkAdd");
                    setDialogLabel("Tambah Saldo Cuti Massal");
                    setIsDialogVisible(true);
                    setCurrentSelectedId(null);
                  }}
                />

                <Button
                  icon="pi pi-user-plus"
                  // label="Tambah Saldo Massal"
                  severity="secondary"
                  pt={
                    {
                      // icon: { className: "mr-2" },
                      // root: { className: "w-full md:w-15rem" },
                    }
                  }
                  onClick={() => {
                    setDialogMode("singleAdd");
                    setDialogLabel("Tambah Saldo Cuti Karyawan");
                    setIsDialogVisible(true);
                    setCurrentSelectedId(null);
                    fetchEmployee();
                  }}
                />

                <Button
                  icon="pi pi-trash"
                  // label="Tambah Saldo Massal"
                  severity="danger"
                  pt={
                    {
                      // icon: { className: "mr-2" },
                      // root: { className: "w-full md:w-15rem" },
                    }
                  }
                  onClick={() => {
                    setDialogMode("bulkDelete");
                    setDialogLabel('Hapus Saldo Cuti Massal')
                    setIsDialogVisible(true)
                  }}
                />
              </div>
            </div>
          </div>
          <DataTableLeaveBalance
            data={leaveBalance}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <ConfirmDialog />

          <Dialog
            header={dialogLabel}
            visible={isDialogVisible}
            onHide={() => {
              setIsDialogVisible(false);
              setSelectedLeaveBalance(null);
              setCurrentSelectedId(null);
              setDialogMode(null);
              setDialogLabel(null);
            }}
            modal
            className="w-full md:w-4"
          >
            <LeaveBalanceDialogForm
              leaveBalanceData={selectedLeaveBalance}
              onSubmit={handleSubmit}
              dialogMode={dialogMode}
              leaveTypeOptions={leaveType}
              employeeOptions={employee}
              isEmployeeLoading={isEmployeeLoading}
              isSubmitting={isSaving}
            />
          </Dialog>
        </div>
      </Card>
    </div>
  );
}