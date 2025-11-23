"use client";

import FormDropdown from "@/components/form/FormDropdown";
import FormInputNumber from "@/components/form/FormInputNumber";
import {
  getLeaveBalanceFormSchema,
  LeaveBalanceFormData,
} from "@/lib/schemas/leaveBalanceFormSchema";
import { LeaveBalanceFormProps } from "@/lib/types/form/leaveBalanceFormType";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";

const leaveBalanceInitialValues: LeaveBalanceFormData = {
  employee_code: "",
  type_code: "",
  balance: 0,
  year: new Date().getFullYear(),
};

export default function LeaveBalanceDialogForm({
  leaveBalanceData,
  onSubmit,
  dialogMode,
  leaveTypeOptions,
  employeeOptions,
  isEmployeeLoading,
  isSubmitting,
}: LeaveBalanceFormProps) {
  const formik = useFormik<LeaveBalanceFormData>({
    initialValues: leaveBalanceData || leaveBalanceInitialValues,
    validate: (values) => {
      const schema = getLeaveBalanceFormSchema(dialogMode);

      const validation = schema.safeParse(values);

      if (validation.success) {
        return {};
      }

      const errors: Record<string, string> = {};
      for (const [key, value] of Object.entries(
        validation.error.flatten().fieldErrors
      )) {
        if (value) errors[key] = value[0];
      }

      return errors;
    },

    onSubmit: (values) => {
      onSubmit(values);
    },

    enableReinitialize: true,
  });

  const isFieldInvalid = (fieldName: keyof LeaveBalanceFormData) =>
    !!(formik.touched[fieldName] && formik.errors[fieldName]);

  const getFieldError = (fieldName: keyof LeaveBalanceFormData) => {
    return isFieldInvalid(fieldName)
      ? (formik.errors[fieldName] as string)
      : undefined;
  };

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-column gap-3">
      {/* can hidden or block according dialogMode */}
      <div
        className={
          dialogMode === "bulkAdd" ||
          dialogMode === "edit" ||
          dialogMode === "bulkDelete"
            ? "hidden"
            : "block"
        }
      >
        <FormDropdown
          props={{
            ...formik.getFieldProps("employee_code"),
            options: employeeOptions,
            optionLabel: "full_name",
            optionValue: "employee_code",
            filter: true,
            filterDelay: 400,
            placeholder: "Pilih Karyawan",
            onChange: (e) => {
              formik.setFieldValue("employee_code", e.value);
            },
            loading: isEmployeeLoading,
          }}
          fieldName={"employee_code"}
          label="Nama Karyawan"
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
        />
      </div>
      <FormDropdown
        props={{
          ...formik.getFieldProps("type_code"),
          options: leaveTypeOptions,
          optionLabel: "name",
          optionValue: "type_code",
          filter: true,
          filterDelay: 400,
          placeholder: "Pilih Tipe Cuti",
          disabled: dialogMode === "edit",
          onChange: (e) => {
            formik.setFieldValue("type_code", e.value);
          },
        }}
        fieldName={"type_code"}
        label="Tipe Cuti"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />
      <FormInputNumber
        props={{
          value: formik.values.year,
          onValueChange: (e: InputNumberValueChangeEvent) => {
            formik.setFieldValue("year", e.value);
          },
          onBlur: formik.handleBlur,
          min: 2000,
          max: 9999,
          useGrouping: false,
          disabled: dialogMode === "edit",
        }}
        fieldName={"year"}
        label="Tahun Cuti Berlaku"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />
      <div className={dialogMode === "bulkDelete" ? "hidden" : "block"}>
        <FormInputNumber
          props={{
            value: formik.values.balance,
            onValueChange: (e: InputNumberValueChangeEvent) => {
              formik.setFieldValue("balance", e.value);
            },
            onBlur: formik.handleBlur,
          }}
          fieldName={"balance"}
          label="Jumlah Saldo Cuti"
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
        />
      </div>
      <div className="flex justify-content-end mt-4">
        <Button
          type="submit"
          label={dialogMode === "bulkDelete" ? "Hapus" : "Simpan"}
          icon={dialogMode === "bulkDelete" ? "pi pi-trash" : "pi pi-save"}
          loading={isSubmitting}
          severity={dialogMode === "bulkDelete" ? "danger" : "success"}
          disabled={formik.isSubmitting}
          pt={{
            icon: {
              className: "mr-2",
            },
          }}
        />
      </div>
    </form>
  );
}
