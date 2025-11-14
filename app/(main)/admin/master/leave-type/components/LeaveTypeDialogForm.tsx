"use client";

import FormInputNumber from "@/components/form/FormInputNumber";
import FormInputText from "@/components/form/FormInputText";
import FormInputTextarea from "@/components/form/FormInputTextarea";
import {
  LeaveTypeFormData,
  leaveTypeFormSchema,
} from "@/lib/schemas/leaveTypeFormSchema";
import { LeaveTypeFormProps } from "@/lib/types/form/leaveTypeFormType";
import { leaveTypeDefaultValues } from "@/lib/values/leaveTypeDefaultValue";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";

export default function LeaveTypeDialogForm({
  leaveType,
  onSubmit,
  isSubmitting,
}: LeaveTypeFormProps) {
  const formik = useFormik({
    initialValues: leaveType || leaveTypeDefaultValues,
    validate: (values) => {
      const validation = leaveTypeFormSchema.safeParse(values);

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

  const isFieldInvalid = (fieldName: keyof LeaveTypeFormData) =>
    !!(formik.touched[fieldName] && formik.errors[fieldName]);

  const getFieldError = (fieldName: keyof LeaveTypeFormData) => {
    return isFieldInvalid(fieldName)
      ? (formik.errors[fieldName] as string)
      : undefined;
  };

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-column gap-3">
      <FormInputText
        props={{
          ...formik.getFieldProps("name"),
          placeholder: "ex: Cuti Tahunan",
        }}
        fieldName={"name"}
        label="Nama Cuti"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />

      <FormInputNumber
        props={{
          value: formik.values.deduction,
          onValueChange: (e: InputNumberValueChangeEvent) => {
            formik.setFieldValue("deduction", e.value);
          },
          onBlur: formik.handleBlur,
        }}
        fieldName={"deduction"}
        label="Pengurangan Gaji"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />

      <FormInputTextarea
        props={{
          ...formik.getFieldProps("description"),
          rows: 5,
        }}
        fieldName={"description"}
        label="Deskripsi Cuti"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <div className="flex justify-content-end mt-4">
        <Button
          type="submit"
          label="Simpan"
          icon="pi pi-save"
          severity="success"
          loading={isSubmitting}
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
