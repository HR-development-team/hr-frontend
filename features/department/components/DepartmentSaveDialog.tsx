/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import { useFormik } from "formik";

// Components & Utils
import FormInputText from "@components/FormInputText";
import {
  DepartmentFormData,
  departmentFormSchema,
} from "../schemas/departmentSchema";
import { toFormikValidation } from "@utils/formikHelpers";

// Option type for the Office Dropdown
export interface OfficeOption {
  label: string;
  value: string;
}

interface DepartmentSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  // Accept any to handle potential type mismatches from raw API data
  departmentData: any;
  onSubmit: (values: DepartmentFormData) => Promise<void>;
  isSubmitting: boolean;
  officeOptions: OfficeOption[];
}

const departmentDefaultValues: DepartmentFormData = {
  office_code: "",
  name: "",
  description: "",
};

export default function DepartmentSaveDialog({
  departmentData,
  onSubmit,
  isSubmitting,
  isOpen,
  onClose,
  title,
  officeOptions = [],
}: DepartmentSaveDialogProps) {
  // 1. Memoize Initial Values
  const initialValues = useMemo(() => {
    if (departmentData) {
      return {
        office_code: departmentData.office_code || "",
        name: departmentData.name || "",
        description: departmentData.description || "",
      };
    }
    return departmentDefaultValues;
  }, [departmentData]);

  // 2. Setup Formik
  const formik = useFormik<DepartmentFormData>({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: null,
    validate: toFormikValidation(departmentFormSchema),
    onSubmit: async (values, { setStatus }) => {
      try {
        await onSubmit(values);
      } catch (error: any) {
        setStatus(
          error?.message || "Terjadi kesalahan saat menyimpan data departemen"
        );
      }
    },
  });

  // Helper functions for validation styling
  const isFieldInvalid = (name: keyof DepartmentFormData) =>
    Boolean(formik.touched[name] && formik.errors[name]);

  const getFieldError = (name: keyof DepartmentFormData) =>
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
        {/* 1. Office Dropdown */}
        <div className="flex flex-column gap-2">
          <label htmlFor="office_code" className="font-medium">
            Kantor <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="office_code"
            value={formik.values.office_code}
            options={officeOptions}
            onChange={(e) => formik.setFieldValue("office_code", e.value)}
            placeholder="Pilih Kantor"
            className={classNames("w-full", {
              "p-invalid": isFieldInvalid("office_code"),
            })}
            filter
            showClear
          />
          {isFieldInvalid("office_code") && (
            <small className="p-error">{getFieldError("office_code")}</small>
          )}
        </div>

        {/* 2. Department Name */}
        <FormInputText
          props={formik.getFieldProps("name")}
          fieldName="name"
          label="Nama Departemen"
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
        />

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
