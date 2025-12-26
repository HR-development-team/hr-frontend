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
import { useFetchDivision } from "../hooks/useFetchDivision";

export interface OfficeOption {
  label: string;
  value: string;
}

interface DivisionSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  divisionData: any;
  onSubmit: (values: DivisionFormData) => Promise<void>;
  isSubmitting: boolean;
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
  officeOptions = [],
}: DivisionSaveDialogProps) {
  // 1. Internal Hook for Cascading Departments
  const {
    departmentOptions,
    fetchDepartmentOptions,
    clearDepartmentOptions,
    isOptionsLoading,
  } = useFetchDivision();

  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);

  // 2. Formik Setup
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

  // 3. Handle Office Change (The Cascade)
  const handleOfficeChange = (officeCode: string | null) => {
    setSelectedOffice(officeCode);

    // Reset department in Formik because the list changed
    formik.setFieldValue("department_code", "");

    if (officeCode) {
      fetchDepartmentOptions(officeCode);
    } else {
      clearDepartmentOptions();
    }
  };

  // 4. Handle Dialog Open (Add vs Edit Mode)
  useEffect(() => {
    if (isOpen) {
      formik.resetForm();

      if (divisionData) {
        // --- EDIT MODE ---
        // We assume divisionData contains 'office_code' (joined from backend).
        // If your API doesn't return it, you'll need to update the backend/query.
        const currentOffice = divisionData.office_code;

        if (currentOffice) {
          setSelectedOffice(currentOffice);
          // Fetch the departments for this office so the dropdown is populated
          fetchDepartmentOptions(currentOffice);
        }
      } else {
        // --- ADD MODE ---
        setSelectedOffice(null);
        clearDepartmentOptions();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, divisionData]);

  const handleHide = () => {
    formik.resetForm();
    setSelectedOffice(null);
    clearDepartmentOptions();
    onClose();
  };

  // Helper styling
  const isFieldInvalid = (name: keyof DivisionFormData) =>
    Boolean(formik.touched[name] && formik.errors[name]);
  const getFieldError = (name: keyof DivisionFormData) =>
    isFieldInvalid(name) ? String(formik.errors[name]) : undefined;

  const isDepartmentDisabled = !selectedOffice;

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
            className="gap-1"
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
        {/* --- Office Dropdown --- */}
        <div className="flex flex-column gap-2">
          <label htmlFor="office_select" className="font-medium">
            Pilih Kantor <span className="text-red-500">*</span>
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

        {/* --- Department Dropdown (Cascaded) --- */}
        <div className="flex flex-column gap-2">
          <label htmlFor="department_code" className="font-medium">
            Departemen <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="department_code"
            value={formik.values.department_code}
            options={departmentOptions} // Data from internal hook
            onChange={(e) => formik.setFieldValue("department_code", e.value)}
            // 1. Loading State
            loading={isOptionsLoading}
            // 2. Disabled Logic
            disabled={isDepartmentDisabled || isOptionsLoading}
            // 3. Dynamic Placeholder
            placeholder={
              isDepartmentDisabled
                ? "Pilih Kantor Terlebih Dahulu"
                : isOptionsLoading
                  ? "Memuat Departemen..."
                  : "Pilih Departemen"
            }
            className={classNames("w-full", {
              "p-invalid": isFieldInvalid("department_code"),
            })}
            filter={!isDepartmentDisabled}
            showClear={!isDepartmentDisabled}
            emptyMessage="Tidak ada departemen untuk kantor ini"
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
