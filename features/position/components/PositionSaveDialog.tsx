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

const positionDefaultValues: PositionFormData = {
  office_code: "",
  department_code: "",
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

    positionOptions,
    fetchPositionOptions,
    clearPositionOptions,
    isOptionsPositionLoading: isPosLoading,
  } = useFetchPosition();

  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

  // --- Logic Helpers ---
  const isHeadOffice = positionType === "head_office";
  const isHeadDept = positionType === "head_department";
  const isHeadDiv = positionType === "head_division"; // NEW HELPER

  const initialValues = useMemo(() => {
    if (positionData) {
      return {
        office_code: positionData.office_code || "",
        department_code: positionData.department_code || "",
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

    // --- UPDATED VALIDATION LOGIC ---
    validate: (values) => {
      const validateFn = toFormikValidation(positionFormSchema);
      const errors = validateFn(values);

      if (isHeadOffice) {
        // Head of Office: No Dept, No Div, No Parent
        delete errors.department_code;
        delete errors.division_code;
        delete errors.parent_position_code;
      } else if (isHeadDept) {
        // Head of Dept: No Div, No Parent
        delete errors.division_code;
        delete errors.parent_position_code;
      } else if (isHeadDiv) {
        // Head of Div: Needs Div, but NO Parent
        delete errors.parent_position_code;
      }

      return errors;
    },

    onSubmit: async (values, { setStatus }) => {
      try {
        const sanitizedValues = { ...values };

        // Sanitation Logic
        if (isHeadOffice) {
          sanitizedValues.department_code = "";
          sanitizedValues.division_code = "";
          sanitizedValues.parent_position_code = null;
        } else if (isHeadDept) {
          sanitizedValues.division_code = "";
          sanitizedValues.parent_position_code = null;
        } else if (isHeadDiv) {
          // Head of Division needs division_code, but not parent
          sanitizedValues.parent_position_code = null;
        }

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
    setSelectedOffice(officeCode);
    setSelectedDepartment(null);

    formik.setFieldValue("office_code", officeCode);
    formik.setFieldValue("department_code", "");
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

    formik.setFieldValue("department_code", deptCode);
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

  // --- Hydration & Auto-Clear Logic ---
  useEffect(() => {
    if (isOpen) {
      if (!positionData) formik.resetForm();

      if (positionData) {
        // EDIT MODE
        const { office_code, department_code, division_code } = positionData;

        if (office_code) {
          setSelectedOffice(office_code);
          fetchDepartmentOptions(office_code);
        }

        if (office_code && department_code && !isHeadOffice) {
          setSelectedDepartment(department_code);
          fetchDivisionOptions(office_code, department_code);
        }

        if (
          office_code &&
          department_code &&
          division_code &&
          !isHeadOffice &&
          !isHeadDept &&
          !isHeadDiv // Don't fetch positions if Head of Division
        ) {
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
  }, [isOpen, positionData, positionType]);

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
        {/* Office - ALWAYS VISIBLE */}
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
            <small className="p-error">{formik.errors.office_code}</small>
          )}
        </div>

        {/* Department - HIDDEN FOR HEAD OF OFFICE */}
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
              <small className="p-error">{formik.errors.department_code}</small>
            )}
          </div>
        )}

        {/* Division - HIDDEN FOR HEAD OF OFFICE OR DEPT */}
        {!isHeadOffice && !isHeadDept && (
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

                // Fetch positions only if NOT head of division
                if (
                  divCode &&
                  selectedOffice &&
                  selectedDepartment &&
                  !isHeadDiv
                ) {
                  fetchPositionOptions(
                    selectedOffice,
                    selectedDepartment,
                    divCode
                  );
                } else {
                  clearPositionOptions();
                }
              }}
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

        {/* Parent Position - HIDDEN FOR HEAD OF OFFICE / DEPT / DIV */}
        {!isHeadOffice && !isHeadDept && !isHeadDiv && (
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
        )}

        {/* Other Fields (Name, Salary, Desc) - ALWAYS VISIBLE */}
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
