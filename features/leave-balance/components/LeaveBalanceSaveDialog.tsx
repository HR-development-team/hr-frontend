/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { useFormik } from "formik";
import { toFormikValidation } from "@utils/formikHelpers";

// Schema & Types
import {
  LeaveBalanceFormData,
  LeaveBalanceFormMode,
  getLeaveBalanceFormSchema,
} from "../schemas/leaveBalanceSchema";

interface LeaveBalanceSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: LeaveBalanceFormMode;
  title: string;
  initialData: LeaveBalanceFormData;
  leaveTypeOptions: { label: string; value: string }[];
  employeeOptions: { label: string; value: string | undefined }[];
  onSubmit: (values: LeaveBalanceFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function LeaveBalanceSaveDialog({
  isOpen,
  onClose,
  mode,
  title,
  initialData,
  leaveTypeOptions,
  employeeOptions,
  onSubmit,
  isSubmitting,
}: LeaveBalanceSaveDialogProps) {
  // 1. Dynamic Validation Schema
  const validationSchema = useMemo(() => {
    return getLeaveBalanceFormSchema(mode);
  }, [mode]);

  // 2. Formik Setup
  const formik = useFormik<LeaveBalanceFormData>({
    initialValues: initialData,
    enableReinitialize: true, // Important: updates form when initialData changes
    validate: toFormikValidation(validationSchema),
    onSubmit: async (values, { setStatus }) => {
      try {
        await onSubmit(values);
      } catch (error: any) {
        setStatus(error?.message || "Terjadi kesalahan saat menyimpan.");
      }
    },
  });

  // Helpers
  const isFieldInvalid = (name: keyof LeaveBalanceFormData) =>
    Boolean(formik.touched[name] && formik.errors[name]);

  const getFieldError = (name: keyof LeaveBalanceFormData) =>
    isFieldInvalid(name) ? String(formik.errors[name]) : undefined;

  const handleHide = () => {
    formik.resetForm();
    onClose();
  };

  // 3. Conditional Rendering Flags
  const showEmployee = mode === "singleAdd" || mode === "edit";
  const showBalance = mode !== "bulkDelete"; // Hide balance input when deleting
  const isBulkDelete = mode === "bulkDelete";

  return (
    <Dialog
      header={title}
      visible={isOpen}
      onHide={handleHide}
      modal
      className="w-full md:w-5 lg:w-4"
      footer={
        <div className="flex justify-content-end gap-2">
          <Button
            label="Batal"
            icon="pi pi-times"
            text
            onClick={handleHide}
            disabled={isSubmitting}
            className="p-button-secondary"
          />
          <Button
            label={isBulkDelete ? "Hapus" : "Simpan"}
            icon={isBulkDelete ? "pi pi-trash" : "pi pi-check"}
            onClick={() => formik.submitForm()}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      }
    >
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-column gap-3 pt-2"
      >
        {/* --- Global Error Message --- */}
        {formik.status && (
          <div className="p-3 bg-red-50 text-red-500 border-round text-sm flex align-items-center gap-2">
            <i className="pi pi-exclamation-circle"></i>
            <span>{formik.status}</span>
          </div>
        )}

        {/* --- 1. Year Input (Always Visible) --- */}
        <div className="flex flex-column gap-2">
          <label htmlFor="year" className="font-medium">
            Tahun <span className="text-red-500">*</span>
          </label>
          <InputNumber
            id="year"
            inputId="year"
            value={formik.values.year}
            onValueChange={(e) => formik.setFieldValue("year", e.value)}
            useGrouping={false}
            min={2020}
            max={2100}
            className={classNames({ "p-invalid": isFieldInvalid("year") })}
            disabled={isBulkDelete} // Lock year in bulk delete if preferred, or allow selection
          />
          {isFieldInvalid("year") && (
            <small className="p-error">{getFieldError("year")}</small>
          )}
        </div>

        {/* --- 2. Leave Type Dropdown (Always Visible) --- */}
        <div className="flex flex-column gap-2">
          <label htmlFor="type_code" className="font-medium">
            Tipe Cuti <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="type_code"
            value={formik.values.type_code}
            onChange={(e) => formik.setFieldValue("type_code", e.value)}
            options={leaveTypeOptions}
            optionLabel="label"
            optionValue="value"
            placeholder="Pilih Tipe Cuti"
            className={classNames({ "p-invalid": isFieldInvalid("type_code") })}
            filter
            disabled={mode === "edit"} // Usually types are locked during edit
          />
          {isFieldInvalid("type_code") && (
            <small className="p-error">{getFieldError("type_code")}</small>
          )}
        </div>

        {/* --- 3. Employee Dropdown (Conditional) --- */}
        {showEmployee && (
          <div className="flex flex-column gap-2">
            <label htmlFor="employee_code" className="font-medium">
              Karyawan <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="employee_code"
              value={formik.values.employee_code}
              onChange={(e) => formik.setFieldValue("employee_code", e.value)}
              options={employeeOptions}
              optionLabel="label"
              optionValue="value"
              placeholder="Pilih Karyawan"
              className={classNames({
                "p-invalid": isFieldInvalid("employee_code"),
              })}
              filter
              disabled={mode === "edit"} // Usually employee is locked during edit
            />
            {isFieldInvalid("employee_code") && (
              <small className="p-error">
                {getFieldError("employee_code")}
              </small>
            )}
          </div>
        )}

        {/* --- 4. Balance Input (Conditional) --- */}
        {showBalance && (
          <div className="flex flex-column gap-2">
            <label htmlFor="balance" className="font-medium">
              Jumlah Saldo (Hari) <span className="text-red-500">*</span>
            </label>
            <InputNumber
              id="balance"
              inputId="balance"
              value={formik.values.balance}
              onValueChange={(e) => formik.setFieldValue("balance", e.value)}
              min={0}
              showButtons
              className={classNames({ "p-invalid": isFieldInvalid("balance") })}
            />
            {isFieldInvalid("balance") && (
              <small className="p-error">{getFieldError("balance")}</small>
            )}
            {mode === "bulkAdd" && (
              <small className="text-gray-500">
                Saldo ini akan diterapkan ke <b>semua</b> karyawan aktif.
              </small>
            )}
          </div>
        )}

        {/* --- Bulk Delete Warning --- */}
        {isBulkDelete && (
          <div className="p-3 bg-red-50 border-1 border-red-200 border-round text-red-700 text-sm mt-2">
            <div className="font-bold mb-1 flex align-items-center gap-2">
              <i className="pi pi-exclamation-triangle"></i> Peringatan
            </div>
            Data saldo cuti untuk tipe dan tahun yang dipilih akan dihapus untuk{" "}
            <b>semua karyawan</b>. Tindakan ini tidak dapat dibatalkan.
          </div>
        )}
      </form>
    </Dialog>
  );
}
