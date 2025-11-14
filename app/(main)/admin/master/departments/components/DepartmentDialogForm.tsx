"use client";

import FormInputText from "@/components/form/FormInputText";
import FormInputTextarea from "@/components/form/FormInputTextarea";
import {
  DepartementFormData,
  departmentFormSchema,
} from "@/lib/schemas/departmentFormSchema";
import { DepartmentFormProps } from "@/lib/types/form/departmentFormType";
import { departmentDefaultValues } from "@/lib/values/departmentDefaultValue";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export default function DepartmentDialogForm({
  departmentData,
  dialogMode,
  onSubmit,
}: DepartmentFormProps) {
  const formik = useFormik({
    initialValues: departmentData || departmentDefaultValues,
    validate: (values) => {
      const validation = departmentFormSchema.safeParse(values);

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
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        await onSubmit(values);
      } catch (error: any) {
        setStatus(error.message);
      }
    },

    enableReinitialize: true,
  });

  const isFieldInvalid = (fieldName: keyof DepartementFormData) =>
    !!(formik.touched[fieldName] && formik.errors[fieldName]);

  const getFieldError = (fieldName: keyof DepartementFormData) => {
    return isFieldInvalid(fieldName)
      ? (formik.errors[fieldName] as string)
      : undefined;
  };

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-column gap-3">
      <FormInputText
        props={{
          ...formik.getFieldProps("name"),
        }}
        fieldName={"name"}
        label="Nama Departemen"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />

      <FormInputTextarea
        props={{
          ...formik.getFieldProps("description"),
          rows: 5,
        }}
        fieldName={"description"}
        label="Deskripsi"
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
