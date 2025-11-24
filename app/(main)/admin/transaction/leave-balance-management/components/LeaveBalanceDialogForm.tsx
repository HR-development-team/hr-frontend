"use client";

import {
  getLeaveBalanceFormSchema,
  LeaveBalanceFormData,
} from "@/lib/schemas/leaveBalanceFormSchema";
import { LeaveBalanceFormProps } from "@/lib/types/form/leaveBalanceFormType";
import { useFormik } from "formik";
import { Trash2, UserPlus, Users } from "lucide-react";
import BulkAdd from "./formComponents/BulkAdd";
import AddSingle from "./formComponents/AddSingle";
import BulkDelete from "./formComponents/BulkDelete";
import Edit from "./formComponents/Edit";

const leaveBalanceInitialValues: LeaveBalanceFormData = {
  employee_code: "",
  type_code: "",
  balance: 0,
  year: new Date().getFullYear(),
};

export default function LeaveBalanceDialogForm({
  leaveBalanceData,
  onSubmit,
  setDialogMode,
  dialogMode,
  leaveTypeOptions,
  employeeOptions,
  isLeaveTypeLoading,
  isEmployeeLoading,
  isSubmitting,
}: LeaveBalanceFormProps) {
  const formik = useFormik<LeaveBalanceFormData>({
    initialValues: leaveBalanceData || leaveBalanceInitialValues,
    validate: (values) => {
      const schema = getLeaveBalanceFormSchema(dialogMode);

      const validation = schema.safeParse(values);

      if (validation.success) {
        return {};
      }

      const errors: Record<string, string> = {};
      for (const [key, value] of Object.entries(
        validation.error.flatten().fieldErrors
      )) {
        if (value) errors[key] = value[0];
      }

      return errors;
    },

    onSubmit: (values) => {
      onSubmit(values);
    },

    enableReinitialize: true,
  });

  const isFieldInvalid = (fieldName: keyof LeaveBalanceFormData) =>
    !!(formik.touched[fieldName] && formik.errors[fieldName]);

  const getFieldError = (fieldName: keyof LeaveBalanceFormData) => {
    return isFieldInvalid(fieldName)
      ? (formik.errors[fieldName] as string)
      : undefined;
  };

  return (
    <div>
      {!dialogMode && (
        <div className="flex flex-column gap-3">
          {/* bulk add action */}
          <div
            className="pf-group flex flex-column lg:flex-row align-items-center gap-3 line-height-2 p-3 border-1 border-gray-200 border-round-xl hover:bg-blue-100 hover:border-blue-400 transition-colors transition-duration-300 cursor-pointer"
            onClick={() => setDialogMode("bulkAdd", "Tambah Saldo Cuti Massal")}
          >
            <div
              className="p-3 bg-blue-100 border-round-xl text-blue-500 pf-group-hover-dynamic-bg pf-group-hover-text-white transition-colors"
              style={
                { "--hover-color": "var(--blue-600)" } as React.CSSProperties
              }
            >
              <Users size={24} />
            </div>

            <div className="text-center lg:text-left">
              <span className="text-800 text-base font-semibold">
                Bulk Add Saldo
              </span>
              <p className="text-500 text-sm">
                Tambahkan saldo untuk banyak karyawan sekaligus berdasarkan tipe
                cuti.
              </p>
            </div>
          </div>

          {/* single add action */}
          <div
            className="pf-group flex flex-column lg:flex-row align-items-center gap-3 line-height-2 p-3 border-1 border-gray-200 border-round-xl hover:bg-green-100 hover:border-green-400 transition-colors transition-duration-300 cursor-pointer"
            onClick={() =>
              setDialogMode("singleAdd", "Tambah Saldo Cuti Karyawan")
            }
          >
            <div
              className="p-3 bg-green-100 border-round-xl text-green-500 pf-group-hover-dynamic-bg pf-group-hover-text-white transition-colors"
              style={
                { "--hover-color": "var(--green-600)" } as React.CSSProperties
              }
            >
              <UserPlus size={24} />
            </div>

            <div className="text-center lg:text-left">
              <span className="text-800 text-base font-semibold">
                Single Add Saldo
              </span>
              <p className="text-500 text-sm">
                Tambahkan atau sesuaikan saldo untuk satu karyawan spesifik.
              </p>
            </div>
          </div>

          {/* delete action */}
          <div
            className="pf-group flex flex-column lg:flex-row align-items-center gap-3 line-height-2 p-3 border-1 border-gray-200 border-round-xl hover:bg-red-100 hover:border-red-400 transition-colors transition-duration-300 cursor-pointer"
            onClick={() =>
              setDialogMode("bulkDelete", "Hapus Saldo Cuti Massal")
            }
          >
            <div
              className="p-3 bg-red-100 border-round-xl text-red-500 pf-group-hover-dynamic-bg pf-group-hover-text-white transition-colors"
              style={
                { "--hover-color": "var(--red-600)" } as React.CSSProperties
              }
            >
              <Trash2 size={24} />
            </div>

            <div className="text-center lg:text-left">
              <span className="text-800 text-base font-semibold">
                Hapus / Reset Tipe Cuti
              </span>
              <p className="text-500 text-sm">
                Hapus saldo tipe cuti tertentu untuk semua karyawan.
              </p>
            </div>
          </div>
        </div>
      )}

      {dialogMode === "bulkAdd" && (
        <BulkAdd
          formik={formik}
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
          leaveTypeOptions={leaveTypeOptions}
          isLeaveTypeLoading={isLeaveTypeLoading}
          isSubmitting={isSubmitting}
        />
      )}

      {dialogMode === "singleAdd" && (
        <AddSingle
          formik={formik}
          leaveTypeOptions={leaveTypeOptions}
          employeeOptions={employeeOptions}
          isLeaveTypeLoading={isLeaveTypeLoading}
          isEmployeeLoading={isEmployeeLoading}
          isSubmitting={isSubmitting}
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
        />
      )}

      {dialogMode === "bulkDelete" && (
        <BulkDelete
          formik={formik}
          leaveTypeOptions={leaveTypeOptions}
          isLeaveTypeLoading={isLeaveTypeLoading}
          isSubmitting={isSubmitting}
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
        />
      )}

      {dialogMode === "edit" && (
        <Edit
          formik={formik}
          leaveTypeOptions={leaveTypeOptions}
          isLeaveTypeLoading={isLeaveTypeLoading}
          isSubmitting={isSubmitting}
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
        />
      )}
    </div>
  );
}
