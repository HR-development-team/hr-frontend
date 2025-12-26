/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useEffect } from "react";
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

export interface OfficeOption {
  label: string;
  value: string;
}

// Ensure type matches your extra form data fields
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
  officeOptions = [],
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

    positionOptions,
    fetchPositionOptions,
    clearPositionOptions,
    isOptionsPositionLoading: isPosLoading,
  } = useFetchPosition();

  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

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

  // --- Handlers ---

  const handleOfficeChange = (officeCode: string | null) => {
    setSelectedOffice(officeCode);
    setSelectedDepartment(null);
    formik.setFieldValue("division_code", "");
    formik.setFieldValue("parent_position_code", null);

    if (officeCode) {
      fetchDepartmentOptions(officeCode);
      clearDivisionOptions();
      clearPositionOptions();
    } else {
      clearDepartmentOptions();
      clearDivisionOptions();
      clearPositionOptions();
    }
  };

  const handleDepartmentChange = (deptCode: string | null) => {
    setSelectedDepartment(deptCode);
    formik.setFieldValue("division_code", "");
    formik.setFieldValue("parent_position_code", null);

    if (selectedOffice && deptCode) {
      fetchDivisionOptions(selectedOffice, deptCode);
      clearPositionOptions();
    } else {
      clearDivisionOptions();
      clearPositionOptions();
    }
  };

  // --- Hydration (Edit vs Add) ---
  useEffect(() => {
    if (isOpen) {
      formik.resetForm();

      if (positionData) {
        // EDIT MODE
        const { office_code, department_code, division_code } = positionData;

        // 1. Load Departments
        if (office_code) {
          setSelectedOffice(office_code);
          fetchDepartmentOptions(office_code);
        }

        // 2. Load Divisions
        if (office_code && department_code) {
          setSelectedDepartment(department_code);
          fetchDivisionOptions(office_code, department_code);
        }

        // 3. Load Positions (Pass ALL 3 codes)
        if (office_code && department_code && division_code) {
          // FIX: Pass arguments individually as string
          fetchPositionOptions(office_code, department_code, division_code);
        }
      } else {
        // ADD MODE
        setSelectedOffice(null);
        setSelectedDepartment(null);
        clearDepartmentOptions();
        clearDivisionOptions();
        clearPositionOptions();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, positionData]);

  const handleHide = () => {
    formik.resetForm();
    setSelectedOffice(null);
    setSelectedDepartment(null);
    clearDepartmentOptions();
    clearDivisionOptions();
    clearPositionOptions();
    onClose();
  };

  const filteredParentPositions = useMemo(() => {
    if (!positionOptions) return [];
    return positionOptions.filter((p: any) => {
      const isNotSelf = positionData
        ? p.value !== positionData.position_code
        : true;
      return isNotSelf;
    });
  }, [positionOptions, positionData]);

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
            value={selectedOffice}
            options={officeOptions}
            onChange={(e) => handleOfficeChange(e.value)}
            placeholder="Pilih Kantor"
            className="w-full"
            filter
            showClear
            optionLabel="label"
            optionValue="value"
          />
        </div>

        {/* Department */}
        <div className="flex flex-column gap-2">
          <label htmlFor="dept_select" className="font-medium">
            Departemen <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="dept_select"
            value={selectedDepartment}
            options={departmentOptions}
            onChange={(e) => handleDepartmentChange(e.value)}
            disabled={!selectedOffice || isDeptLoading}
            loading={isDeptLoading}
            placeholder={
              !selectedOffice
                ? "Pilih Kantor terlebih dahulu"
                : isDeptLoading
                  ? "Memuat..."
                  : "Pilih Departemen"
            }
            className="w-full"
            filter
            showClear
            optionLabel="label"
            optionValue="value"
          />
        </div>

        {/* Division */}
        <div className="flex flex-column gap-2">
          <label htmlFor="division_code" className="font-medium">
            Divisi <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="division_code"
            value={formik.values.division_code}
            options={divisionOptions}
            onChange={(e) => {
              const divCode = e.value;
              formik.setFieldValue("division_code", divCode);
              formik.setFieldValue("parent_position_code", null);

              // FIX: Pass selectedOffice and selectedDepartment from state
              if (divCode && selectedOffice && selectedDepartment) {
                fetchPositionOptions(
                  selectedOffice,
                  selectedDepartment,
                  divCode
                );
              } else {
                clearPositionOptions();
              }
            }}
            disabled={!selectedDepartment || isDivLoading}
            loading={isDivLoading}
            placeholder={
              !selectedDepartment
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

        {/* Parent Position */}
        <div className="flex flex-column gap-2">
          <label htmlFor="parent_position_code" className="font-medium">
            Atasan Langsung (Parent)
          </label>
          <Dropdown
            id="parent_position_code"
            value={formik.values.parent_position_code}
            options={filteredParentPositions}
            onChange={(e) =>
              formik.setFieldValue("parent_position_code", e.value)
            }
            placeholder={
              !formik.values.division_code
                ? "Pilih Divisi terlebih dahulu"
                : isPosLoading
                  ? "Memuat..."
                  : "Pilih Atasan (Opsional)"
            }
            className="w-full"
            filter
            showClear
            disabled={!formik.values.division_code || isPosLoading}
            loading={isPosLoading}
            emptyMessage="Tidak ada jabatan lain"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        {/* Other Fields */}
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
