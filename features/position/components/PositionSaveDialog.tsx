/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { useFormik } from "formik";

import FormInputText from "@components/FormInputText";
import {
  PositionFormData,
  positionFormSchema,
} from "../schemas/positionSchema";
import { toFormikValidation } from "@utils/formikHelpers";
import { useFetchPosition } from "../hooks/useFetchPosition";
import { PositionType } from "../hooks/useDialogPosition";

export interface OfficeOption {
  label: string;
  value: string;
}

export type PositionDialogData = PositionFormData & {
  office_code?: string;
  department_code?: string;
  position_code?: string;
};

interface PositionSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  positionData: PositionDialogData | null;
  onSubmit: (values: PositionFormData) => Promise<void>;
  isSubmitting: boolean;
  officeOptions: OfficeOption[];
  positionType?: PositionType;
}

// REMOVED: parent_position_code
const positionDefaultValues: PositionFormData = {
  office_code: "",
  department_code: "",
  division_code: "",
  name: "",
  base_salary: 0,
  description: "",
};

export default function PositionSaveDialog({
  positionData,
  onSubmit,
  isSubmitting,
  isOpen,
  onClose,
  title,
  officeOptions = [],
  positionType = "regular",
}: PositionSaveDialogProps) {
  const {
    departmentOptions,
    fetchDepartmentOptions,
    clearDepartmentOptions,
    isOptionsDepartmentLoading: isDeptLoading,

    divisionOptions,
    fetchDivisionOptions,
    clearDivisionOptions,
    isOptionsDivisionLoading: isDivLoading,

    // REMOVED: positionOptions and fetchPositionOptions are no longer needed
  } = useFetchPosition();

  // Logic Helpers
  const isHeadOffice = positionType === "head_office";
  const isHeadDept = positionType === "head_department";
  const isHeadDiv = positionType === "head_division";

  const initialValues = useMemo(() => {
    if (positionData) {
      return {
        office_code: positionData.office_code || "",
        department_code: positionData.department_code || "",
        division_code: positionData.division_code || "",
        name: positionData.name || "",
        base_salary: Number(positionData.base_salary) || 0,
        description: positionData.description || "",
        // REMOVED: parent_position_code mapping
      };
    }
    return positionDefaultValues;
  }, [positionData]);

  const formik = useFormik<PositionFormData>({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: null,
    validate: (values) => {
      const validateFn = toFormikValidation(positionFormSchema);
      const errors = validateFn(values);

      // --- Custom Validation Logic ---
      if (isHeadOffice) {
        delete errors.department_code;
        delete errors.division_code;
      } else if (isHeadDept) {
        delete errors.division_code;
      }
      // isHeadDiv behaves like regular for validation (needs division_code),
      // but parent_position logic is gone entirely now.

      return errors;
    },
    onSubmit: async (values, { setStatus }) => {
      try {
        const sanitizedValues = { ...values };

        // Sanitation: Ensure hidden fields send empty strings
        if (isHeadOffice) {
          sanitizedValues.department_code = "";
          sanitizedValues.division_code = "";
        } else if (isHeadDept) {
          sanitizedValues.division_code = "";
        }

        // No need to nullify parent_position_code anymore

        await onSubmit(sanitizedValues);
      } catch (error: any) {
        setStatus(
          error?.message || "Terjadi kesalahan saat menyimpan data jabatan"
        );
      }
    },
  });

  // --- Handlers ---

  const handleOfficeChange = (officeCode: string | null) => {
    // 1. Update Formik
    formik.setFieldValue("office_code", officeCode);
    // Reset downstream
    formik.setFieldValue("department_code", "");
    formik.setFieldValue("division_code", "");

    // 2. Fetch Options
    if (officeCode) {
      fetchDepartmentOptions(officeCode);
      clearDivisionOptions();
    } else {
      clearDepartmentOptions();
      clearDivisionOptions();
    }
  };

  const handleDepartmentChange = (deptCode: string | null) => {
    // 1. Update Formik
    formik.setFieldValue("department_code", deptCode);
    // Reset downstream
    formik.setFieldValue("division_code", "");

    // 2. Fetch Options
    if (formik.values.office_code && deptCode) {
      fetchDivisionOptions(formik.values.office_code, deptCode);
    } else {
      clearDivisionOptions();
    }
  };

  // --- Hydration ---
  useEffect(() => {
    if (isOpen) {
      formik.resetForm();

      if (positionData) {
        // EDIT MODE
        const { office_code, department_code } = positionData;

        if (office_code) {
          fetchDepartmentOptions(office_code);
        }

        if (office_code && department_code) {
          fetchDivisionOptions(office_code, department_code);
        }

        // REMOVED: Fetch Position Options
      } else {
        // ADD MODE
        clearDepartmentOptions();
        clearDivisionOptions();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, positionData]);

  const handleHide = () => {
    formik.resetForm();
    clearDepartmentOptions();
    clearDivisionOptions();
    onClose();
  };

  const isFieldInvalid = (name: keyof PositionFormData) =>
    Boolean(formik.touched[name] && formik.errors[name]);

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
            className="gap-1"
            text
            onClick={handleHide}
            disabled={isSubmitting}
          />
          <Button
            label="Simpan"
            icon="pi pi-save"
            severity="success"
            className="gap-1"
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
        {/* Office */}
        <div className="flex flex-column gap-2">
          <label htmlFor="office_select" className="font-medium">
            Kantor <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="office_select"
            value={formik.values.office_code}
            options={officeOptions}
            onChange={(e) => handleOfficeChange(e.value)}
            placeholder="Pilih Kantor"
            className={classNames("w-full", {
              "p-invalid": isFieldInvalid("office_code"),
            })}
            filter
            showClear
            optionLabel="label"
            optionValue="value"
          />
          {isFieldInvalid("office_code") && (
            <small className="p-error">
              {formik.errors.office_code as string}
            </small>
          )}
        </div>

        {/* Department - Hidden if Head of Office */}
        {!isHeadOffice && (
          <div className="flex flex-column gap-2">
            <label htmlFor="dept_select" className="font-medium">
              Departemen <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="dept_select"
              value={formik.values.department_code}
              options={departmentOptions}
              onChange={(e) => handleDepartmentChange(e.value)}
              disabled={!formik.values.office_code || isDeptLoading}
              loading={isDeptLoading}
              placeholder={
                !formik.values.office_code
                  ? "Pilih Kantor terlebih dahulu"
                  : isDeptLoading
                    ? "Memuat..."
                    : "Pilih Departemen"
              }
              className={classNames("w-full", {
                "p-invalid": isFieldInvalid("department_code"),
              })}
              filter
              showClear
              optionLabel="label"
              optionValue="value"
            />
            {isFieldInvalid("department_code") && (
              <small className="p-error">
                {formik.errors.department_code as string}
              </small>
            )}
          </div>
        )}

        {/* Division - Hidden if Head of Office or Dept */}
        {!isHeadOffice && !isHeadDept && (
          <div className="flex flex-column gap-2">
            <label htmlFor="division_code" className="font-medium">
              Divisi <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="division_code"
              value={formik.values.division_code}
              options={divisionOptions}
              onChange={(e) => formik.setFieldValue("division_code", e.value)}
              disabled={!formik.values.department_code || isDivLoading}
              loading={isDivLoading}
              placeholder={
                !formik.values.department_code
                  ? "Pilih Departemen terlebih dahulu"
                  : isDivLoading
                    ? "Memuat..."
                    : "Pilih Divisi"
              }
              className={classNames("w-full", {
                "p-invalid": isFieldInvalid("division_code"),
              })}
              filter
              showClear
              optionLabel="label"
              optionValue="value"
            />
            {isFieldInvalid("division_code") && (
              <small className="p-error">
                {formik.errors.division_code as string}
              </small>
            )}
          </div>
        )}

        {/* REMOVED: Parent Position Dropdown */}

        <FormInputText
          props={formik.getFieldProps("name")}
          fieldName="name"
          label="Nama Jabatan"
          isFieldInvalid={(name) => isFieldInvalid(name)}
          getFieldError={(name) => formik.errors[name] as string}
        />

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
        </div>

        <div className="flex flex-column gap-2">
          <label htmlFor="description" className="font-medium">
            Deskripsi
          </label>
          <InputTextarea
            id="description"
            {...formik.getFieldProps("description")}
            rows={4}
            className="w-full"
          />
        </div>
      </form>
    </Dialog>
  );
}
