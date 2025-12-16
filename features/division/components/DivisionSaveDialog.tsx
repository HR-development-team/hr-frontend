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
  DivisionFormData,
  divisionFormSchema,
} from "../schemas/divisionSchema";
import { toFormikValidation } from "@utils/formikHelpers";

// Option type for the Department Dropdown
export interface DepartmentOption {
  label: string;
  value: string;
}

interface DivisionSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  // Accept any to handle potential type mismatches from raw API data
  divisionData: any;
  onSubmit: (values: DivisionFormData) => Promise<void>;
  isSubmitting: boolean;
  departmentOptions: DepartmentOption[];
}

const divisionDefaultValues: DivisionFormData = {
  department_code: "",
  name: "",
  description: "",
};

export default function DivisionSaveDialog({
  divisionData,
  onSubmit,
  isSubmitting,
  isOpen,
  onClose,
  title,
  departmentOptions = [],
}: DivisionSaveDialogProps) {
  // 1. Memoize Initial Values
  const initialValues = useMemo(() => {
    if (divisionData) {
      return {
        department_code: divisionData.department_code || "",
        name: divisionData.name || "",
        description: divisionData.description || "",
      };
    }
    return divisionDefaultValues;
  }, [divisionData]);

  // 2. Setup Formik
  const formik = useFormik<DivisionFormData>({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: null,
    validate: toFormikValidation(divisionFormSchema),
    onSubmit: async (values, { setStatus }) => {
      try {
        await onSubmit(values);
      } catch (error: any) {
        setStatus(
          error?.message || "Terjadi kesalahan saat menyimpan data divisi"
        );
      }
    },
  });

  // Helper functions for validation styling
  const isFieldInvalid = (name: keyof DivisionFormData) =>
    Boolean(formik.touched[name] && formik.errors[name]);

  const getFieldError = (name: keyof DivisionFormData) =>
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
        {/* 1. Department Dropdown */}
        <div className="flex flex-column gap-2">
          <label htmlFor="department_code" className="font-medium">
            Departemen <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="department_code"
            value={formik.values.department_code}
            options={departmentOptions}
            onChange={(e) => formik.setFieldValue("department_code", e.value)}
            placeholder="Pilih Departemen"
            className={classNames("w-full", {
              "p-invalid": isFieldInvalid("department_code"),
            })}
            filter
            showClear
          />
          {isFieldInvalid("department_code") && (
            <small className="p-error">
              {getFieldError("department_code")}
            </small>
          )}
        </div>

        {/* 2. Division Name */}
        <FormInputText
          props={formik.getFieldProps("name")}
          fieldName="name"
          label="Nama Divisi"
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
