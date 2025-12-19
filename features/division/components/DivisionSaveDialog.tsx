/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
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

export interface DepartmentOption {
  label: string;
  value: string;
  office_code: string;
}

export interface OfficeOption {
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
  officeOptions: OfficeOption[];
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
  officeOptions = [],
}: DivisionSaveDialogProps) {
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);

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
    setSelectedOffice(null); // Explicitly reset local state on close
    onClose();
  };

  // CHANGE 4: Filter Department Options based on selected Office
  const filteredDepartments = useMemo(() => {
    if (!selectedOffice) return [];
    return departmentOptions.filter(
      (dept) => dept.office_code === selectedOffice
    );
  }, [selectedOffice, departmentOptions]);

  // CHANGE 3: Auto-select Office in "Edit Mode"
  // When the dialog opens with data, find which office owns this department
  useEffect(() => {
    if (isOpen && divisionData?.department_code) {
      const relatedDept = departmentOptions.find(
        (d) => d.value === divisionData.department_code
      );
      if (relatedDept) {
        setSelectedOffice(relatedDept.office_code);
      }
    } else if (isOpen && !divisionData) {
      // Reset if opening in "Create" mode
      setSelectedOffice(null);
    }
  }, [isOpen, divisionData, departmentOptions]);

  // Reset form when the form is resetted
  useEffect(() => {
    if (isOpen) {
      // 1. Always reset Formik to clear touched/dirty states
      formik.resetForm();

      // 2. Handle Office State
      if (divisionData?.department_code) {
        // EDIT MODE: Find the office belonging to this department
        const relatedDept = departmentOptions.find(
          (d) => d.value === divisionData.department_code
        );
        if (relatedDept) {
          setSelectedOffice(relatedDept.office_code);
        }
      } else {
        // ADD MODE: Explicitly reset local state
        setSelectedOffice(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, divisionData]);

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
            className="gap-1"
            icon="pi pi-times"
            text
            onClick={handleHide}
            disabled={isSubmitting}
          />
          <Button
            label="Simpan"
            className="gap-1"
            icon="pi pi-save"
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
        {/* --- NEW: Office Dropdown (The Filter) --- */}
        <div className="flex flex-column gap-2">
          {/* Label Row: Text on Left, Badge on Right */}
          <div className="flex align-items-center justify-content-between">
            <label htmlFor="office_select" className="font-medium">
              Pilih Kantor <span className="text-red-500">*</span>
            </label>
          </div>

          <Dropdown
            id="office_select"
            value={selectedOffice}
            options={officeOptions}
            onChange={(e) => {
              setSelectedOffice(e.value);
              formik.setFieldValue("department_code", "");
            }}
            placeholder="Pilih Kantor"
            className="w-full"
            filter
            showClear
            itemTemplate={(option: any) => (
              <div className="flex align-items-center justify-content-between gap-2 w-full">
                <span>{option.label}</span>
                <span className="text-gray-500 text-sm font-mono bg-gray-100 px-2 py-1 border-round">
                  {option.value}
                </span>
              </div>
            )}
          />
        </div>

        {/* --- EXISTING: Department Dropdown (Filtered) --- */}
        <div className="flex flex-column gap-2">
          <label htmlFor="department_code" className="font-medium">
            Departemen <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="department_code"
            value={formik.values.department_code}
            options={filteredDepartments} // Use the FILTERED list
            onChange={(e) => formik.setFieldValue("department_code", e.value)}
            placeholder={
              selectedOffice
                ? "Pilih Departemen"
                : "Pilih Kantor Terlebih Dahulu"
            }
            className={classNames("w-full", {
              "p-invalid": isFieldInvalid("department_code"),
            })}
            disabled={!selectedOffice} // Disable if no office selected
            filter
            showClear
            itemTemplate={(option: any) => (
              <div className="flex align-items-center justify-content-between gap-2 w-full">
                <span>{option.label}</span>
                <span className="text-gray-500 text-sm font-mono bg-gray-100 px-2 py-1 border-round">
                  {option.value}
                </span>
              </div>
            )}
          />
          {isFieldInvalid("department_code") && (
            <small className="p-error">
              {getFieldError("department_code")}
            </small>
          )}
        </div>

        {/* Division Name */}
        <FormInputText
          props={formik.getFieldProps("name")}
          fieldName="name"
          label="Nama Divisi"
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
        />

        {/* Description */}
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
