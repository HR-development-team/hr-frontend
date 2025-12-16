/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { useFormik } from "formik";

// Components & Utils
import FormInputText from "@components/FormInputText";
import {
  PositionFormData,
  positionFormSchema,
} from "../schemas/positionSchema";
import { toFormikValidation } from "@utils/formikHelpers";

// Option type for the Division Dropdown
export interface DivisionOption {
  label: string;
  value: string;
}

interface PositionSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  // Accept any to handle potential type mismatches from raw API data
  positionData: any;
  onSubmit: (values: PositionFormData) => Promise<void>;
  isSubmitting: boolean;
  divisionOptions: DivisionOption[];
}

const positionDefaultValues: PositionFormData = {
  division_code: "",
  name: "",
  base_salary: 0,
  description: "",
  parent_position_code: null,
};

export default function PositionSaveDialog({
  positionData,
  onSubmit,
  isSubmitting,
  isOpen,
  onClose,
  title,
  divisionOptions = [],
}: PositionSaveDialogProps) {
  // 1. Memoize Initial Values
  const initialValues = useMemo(() => {
    if (positionData) {
      return {
        division_code: positionData.division_code || "",
        name: positionData.name || "",
        base_salary: Number(positionData.base_salary) || 0,
        description: positionData.description || "",
        parent_position_code: positionData.parent_position_code || null,
      };
    }
    return positionDefaultValues;
  }, [positionData]);

  // 2. Setup Formik
  const formik = useFormik<PositionFormData>({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: null,
    validate: toFormikValidation(positionFormSchema),
    onSubmit: async (values, { setStatus }) => {
      try {
        await onSubmit(values);
      } catch (error: any) {
        setStatus(
          error?.message || "Terjadi kesalahan saat menyimpan data jabatan"
        );
      }
    },
  });

  // Helper functions for validation styling
  const isFieldInvalid = (name: keyof PositionFormData) =>
    Boolean(formik.touched[name] && formik.errors[name]);

  const getFieldError = (name: keyof PositionFormData) =>
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
        {/* 1. Division Dropdown */}
        <div className="flex flex-column gap-2">
          <label htmlFor="division_code" className="font-medium">
            Divisi <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="division_code"
            value={formik.values.division_code}
            options={divisionOptions}
            onChange={(e) => formik.setFieldValue("division_code", e.value)}
            placeholder="Pilih Divisi"
            className={classNames("w-full", {
              "p-invalid": isFieldInvalid("division_code"),
            })}
            filter
            showClear
          />
          {isFieldInvalid("division_code") && (
            <small className="p-error">{getFieldError("division_code")}</small>
          )}
        </div>

        {/* 2. Position Name */}
        <FormInputText
          props={formik.getFieldProps("name")}
          fieldName="name"
          label="Nama Jabatan"
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
        />

        {/* 3. Base Salary (InputNumber) */}
        <div className="flex flex-column gap-2">
          <label htmlFor="base_salary" className="font-medium">
            Gaji Pokok <span className="text-red-500">*</span>
          </label>
          <InputNumber
            id="base_salary"
            value={formik.values.base_salary as number}
            onValueChange={(e) => formik.setFieldValue("base_salary", e.value)}
            mode="currency"
            currency="IDR"
            locale="id-ID"
            placeholder="0"
            className={classNames("w-full", {
              "p-invalid": isFieldInvalid("base_salary"),
            })}
          />
          {isFieldInvalid("base_salary") && (
            <small className="p-error">{getFieldError("base_salary")}</small>
          )}
        </div>

        {/* 4. Description (Optional) */}
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
