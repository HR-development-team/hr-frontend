/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { useFormik } from "formik";

// Components & Utils
import FormInputText from "@components/FormInputText";
import {
  LeaveTypeFormData,
  leaveTypeFormSchema,
} from "../schemas/leaveTypeSchema";
import { toFormikValidation } from "@utils/formikHelpers";

interface LeaveTypeSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  leaveTypeData: any;
  onSubmit: (values: LeaveTypeFormData) => Promise<void>;
  isSubmitting: boolean;
}

const leaveTypeDefaultValues: LeaveTypeFormData = {
  name: "",
  deduction: 0,
  description: "",
};

export default function LeaveTypeSaveDialog({
  leaveTypeData,
  onSubmit,
  isSubmitting,
  isOpen,
  onClose,
  title,
}: LeaveTypeSaveDialogProps) {
  // 1. Memoize Initial Values
  const initialValues = useMemo(() => {
    if (leaveTypeData) {
      return {
        name: leaveTypeData.name || "",
        // Ensure valid number
        deduction: Number(leaveTypeData.deduction) || 0,
        description: leaveTypeData.description || "",
      };
    }
    return leaveTypeDefaultValues;
  }, [leaveTypeData]);

  // 2. Setup Formik
  const formik = useFormik<LeaveTypeFormData>({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: null,
    validate: toFormikValidation(leaveTypeFormSchema),
    onSubmit: async (values, { setStatus }) => {
      try {
        await onSubmit(values);
      } catch (error: any) {
        setStatus(
          error?.message || "Terjadi kesalahan saat menyimpan data tipe cuti"
        );
      }
    },
  });

  // Helpers
  const isFieldInvalid = (name: keyof LeaveTypeFormData) =>
    Boolean(formik.touched[name] && formik.errors[name]);

  const getFieldError = (name: keyof LeaveTypeFormData) =>
    isFieldInvalid(name) ? String(formik.errors[name]) : undefined;

  const handleHide = () => {
    formik.resetForm();
    onClose();
  };

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
            className="flex gap-1"
            text
            onClick={handleHide}
            disabled={isSubmitting}
          />
          <Button
            label="Simpan"
            icon="pi pi-save"
            className="flex gap-1"
            severity="success"
            onClick={() => formik.submitForm()}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      }
    >
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-column gap-3 mt-2"
      >
        {/* 1. Name */}
        <FormInputText
          props={formik.getFieldProps("name")}
          fieldName="name"
          label="Nama Tipe Cuti"
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
        />

        {/* 2. Deduction (InputNumber) */}
        <div className="flex flex-column gap-2">
          <label htmlFor="deduction" className="font-medium">
            Pengurangan (Hari) <span className="text-red-500">*</span>
          </label>
          <InputNumber
            id="deduction"
            value={formik.values.deduction as number}
            onValueChange={(e) => formik.setFieldValue("deduction", e.value)}
            mode="decimal"
            showButtons
            min={0}
            className={classNames("w-full", {
              "p-invalid": isFieldInvalid("deduction"),
            })}
          />
          {isFieldInvalid("deduction") && (
            <small className="p-error">{getFieldError("deduction")}</small>
          )}
        </div>

        {/* 3. Description (Optional) */}
        <div className="flex flex-column gap-2">
          <label htmlFor="description" className="font-medium">
            Deskripsi (Opsional)
          </label>
          <InputTextarea
            id="description"
            {...formik.getFieldProps("description")}
            rows={4}
            className={classNames("w-full", {
              "p-invalid": isFieldInvalid("description"),
            })}
            placeholder="Keterangan tambahan..."
          />
          {isFieldInvalid("description") && (
            <small className="p-error">{getFieldError("description")}</small>
          )}
        </div>

        {/* Global Error Message */}
        {formik.status && (
          <div className="p-3 bg-red-50 text-red-500 border-round text-sm text-right">
            <i className="pi pi-exclamation-circle mr-2"></i>
            {formik.status}
          </div>
        )}
      </form>
    </Dialog>
  );
}
