/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import FormInputText from "@/components/form/FormInputText";
import FormInputTextarea from "@/components/form/FormInputTextarea";
import { RoleFormData, roleFormSchema } from "@/lib/schemas/roleFormSchema";
import { RoleFormProps } from "@/lib/types/form/roleFormType";
import { roleDefaultValues } from "@/lib/values/roleDefaultValue";
import { useFormik } from "formik";
import { Button } from "primereact/button";

export default function RoleDialogForm({
  roleData,
  onSubmit,
  isSubmitting,
}: RoleFormProps) {
  const formik = useFormik({
    initialValues: roleData || roleDefaultValues,
    validate: (values) => {
      const validation = roleFormSchema.safeParse(values);

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
    onSubmit: async (values, { setStatus }) => {
      try {
        await onSubmit(values);
      } catch (error: any) {
        setStatus(error.message);
      }
    },

    enableReinitialize: true,
  });

  const isFieldInvalid = (fieldName: keyof RoleFormData) =>
    !!(formik.touched[fieldName] && formik.errors[fieldName]);

  const getFieldError = (fieldName: keyof RoleFormData) => {
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
        label="Nama Role"
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
