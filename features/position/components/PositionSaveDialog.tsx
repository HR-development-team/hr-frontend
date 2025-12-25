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

// Components & Utils
import FormInputText from "@components/FormInputText";
import {
  PositionFormData,
  positionFormSchema,
} from "../schemas/positionSchema";
import { toFormikValidation } from "@utils/formikHelpers";

export interface DivisionOption {
  label: string;
  value: string;
  department_code: string;
}

export interface DepartmentOption {
  label: string;
  value: string;
  office_code: string;
}

export interface OfficeOption {
  label: string;
  value: string;
}

export interface PositionOption {
  label: string;
  value: string;
  division_code: string;
}

interface PositionSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  positionData: any;
  onSubmit: (values: PositionFormData) => Promise<void>;
  isSubmitting: boolean;
  // We now need all three levels of data
  officeOptions: OfficeOption[];
  departmentOptions: DepartmentOption[];
  divisionOptions: DivisionOption[];
  positionOptions: PositionOption[];
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
  departmentOptions = [],
  divisionOptions = [],
  positionOptions = [],
}: PositionSaveDialogProps) {
  // --- Local State for Cascading Dropdowns ---
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

  // --- 1. Initial Values & Pre-filling logic ---
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

  // --- 2. Filtered Options Logic ---
  const filteredDepartments = useMemo(() => {
    if (!selectedOffice) return [];
    return departmentOptions.filter((d) => d.office_code === selectedOffice);
  }, [selectedOffice, departmentOptions]);

  const filteredDivisions = useMemo(() => {
    if (!selectedDepartment) return [];
    return divisionOptions.filter(
      (d) => d.department_code === selectedDepartment
    );
  }, [selectedDepartment, divisionOptions]);

  // --- 3. Setup Formik ---
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

  const filteredParentPositions = useMemo(() => {
    // If no division is selected, show no parents
    if (!formik?.values.division_code) return [];

    return positionOptions.filter((p) => {
      // Must match selected division
      const isSameDivision = p.division_code === formik.values.division_code;

      // Optional: Prevent selecting itself as its own parent (if editing)
      // Assuming positionData has 'position_code'
      const isNotSelf = positionData
        ? p.value !== positionData.position_code
        : true;

      return isSameDivision && isNotSelf;
    });
  }, [formik?.values.division_code, positionOptions, positionData]);

  const handleHide = () => {
    formik.resetForm();
    setSelectedOffice(null);
    setSelectedDepartment(null);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      formik.resetForm();

      if (positionData?.division_code) {
        // --- EDIT MODE: Reverse Lookup ---
        const division = divisionOptions.find(
          (d) => d.value === positionData.division_code
        );

        if (division?.department_code) {
          setSelectedDepartment(division.department_code);
          const department = departmentOptions.find(
            (d) => d.value === division.department_code
          );

          if (department?.office_code) {
            setSelectedOffice(department.office_code);
          }
        }
      } else {
        // --- ADD MODE ---
        setSelectedOffice(null);
        setSelectedDepartment(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, positionData]);

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
        {/* 1. Office (Filter Only - Not saved to Position) */}
        <div className="flex flex-column gap-2">
          <label htmlFor="office_select" className="font-medium">
            Kantor
          </label>
          <Dropdown
            id="office_select"
            value={selectedOffice}
            options={officeOptions}
            itemTemplate={(option: any) => (
              <div className="flex align-items-center justify-content-between gap-2 w-full">
                <span>{option.label}</span>
                <span className="text-gray-500 text-sm font-mono bg-gray-100 px-2 py-1 border-round">
                  {option.value}
                </span>
              </div>
            )}
            onChange={(e) => {
              setSelectedOffice(e.value);
              setSelectedDepartment(null);
              formik.setFieldValue("division_code", "");
            }}
            placeholder="Pilih Kantor"
            className="w-full"
            filter
          />
        </div>

        {/* 2. Department (Filter Only - Not saved to Position) */}
        <div className="flex flex-column gap-2">
          <label htmlFor="dept_select" className="font-medium">
            Departemen
          </label>
          <Dropdown
            id="dept_select"
            value={selectedDepartment}
            options={filteredDepartments}
            onChange={(e) => {
              setSelectedDepartment(e.value);
              formik.setFieldValue("division_code", "");
            }}
            itemTemplate={(option: any) => (
              <div className="flex align-items-center justify-content-between gap-2 w-full">
                <span>{option.label}</span>
                <span className="text-gray-500 text-sm font-mono bg-gray-100 px-2 py-1 border-round">
                  {option.value}
                </span>
              </div>
            )}
            placeholder="Pilih Departemen"
            className="w-full"
            disabled={!selectedOffice}
            filter
            emptyMessage="Pilih Kantor terlebih dahulu"
          />
        </div>

        {/* 3. Division (The Actual Field) */}
        <div className="flex flex-column gap-2">
          <label htmlFor="division_code" className="font-medium">
            Divisi <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="division_code"
            value={formik.values.division_code}
            options={filteredDivisions}
            onChange={(e) => formik.setFieldValue("division_code", e.value)}
            placeholder="Pilih Divisi"
            className={classNames("w-full", {
              "p-invalid":
                formik.touched.division_code && formik.errors.division_code,
            })}
            itemTemplate={(option: any) => (
              <div className="flex align-items-center justify-content-between gap-2 w-full">
                <span>{option.label}</span>
                <span className="text-gray-500 text-sm font-mono bg-gray-100 px-2 py-1 border-round">
                  {option.value}
                </span>
              </div>
            )}
            disabled={!selectedDepartment}
            filter
            emptyMessage="Pilih Departemen terlebih dahulu"
          />
          {formik.touched.division_code && formik.errors.division_code && (
            <small className="p-error">
              {formik.errors.division_code as string}
            </small>
          )}
        </div>

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
                : "Pilih Atasan (Opsional)"
            }
            className="w-full"
            filter
            showClear
            disabled={!formik.values.division_code} // Disable if no division selected
            itemTemplate={(option: any) => (
              <div className="flex align-items-center justify-content-between gap-2 w-full">
                <span>{option.label}</span>
                <span className="text-gray-500 text-sm font-mono bg-gray-100 px-2 py-1 border-round">
                  {option.value}
                </span>
              </div>
            )}
            emptyMessage="Tidak ada jabatan lain di divisi ini"
          />
        </div>

        {/* --- Standard Fields --- */}

        <FormInputText
          props={formik.getFieldProps("name")}
          fieldName="name"
          label="Nama Jabatan"
          isFieldInvalid={(name) =>
            Boolean(formik.touched[name] && formik.errors[name])
          }
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
              "p-invalid":
                formik.touched.base_salary && formik.errors.base_salary,
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
