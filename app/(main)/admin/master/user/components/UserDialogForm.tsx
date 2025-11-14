"use client";

import FormDropdown from "@/components/form/FormDropdown";
import FormInputText from "@/components/form/FormInputText";
import FormPassword from "@/components/form/FormPassword";
import { UserFormData, userFormSchema } from "@/lib/schemas/userFormSchema";
import { UserFormProps } from "@/lib/types/form/userFormType";
import { roleOptions, UserDefaultValues } from "@/lib/values/userDefaultValue";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";

export default function UserDialogForm({
  userData,
  onSubmit,
  employeeOptions,
  isSubmitting,
}: UserFormProps) {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: userData || UserDefaultValues,
    validate: (values) => {
      const validation = userFormSchema.safeParse(values);

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

  const isFieldInvalid = (fieldName: keyof UserFormData) =>
    !!(formik.touched[fieldName] && formik.errors[fieldName]);

  const getFieldError = (fieldName: keyof UserFormData) => {
    return isFieldInvalid(fieldName)
      ? (formik.errors[fieldName] as string)
      : undefined;
  };

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-column gap-3">
      <FormInputText
        props={{
          ...formik.getFieldProps("email"),
          placeholder: "ex: budi@example.com",
        }}
        fieldName={"email"}
        label="Email"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />

      <div className="w-full flex flex-column gap-2">
        <FormPassword
          props={{
            ...formik.getFieldProps("password"),
            placeholder: "Masukkan Password",
          }}
          fieldName={"password"}
          label="Password"
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
        />

        <div className="p-3 bg-gray-50 border-round mt-2">
          <div className="font-bold mb-1 text-sm text-700">
            Password harus berisi:
          </div>
          <ul className="pl-3 mt-1 line-height-3 text-sm text-500">
            <li>Setidaknya mengandung 1 huruf kecil</li>
            <li>Setidaknya mengandung 1 huruf besar</li>
            <li>Minimal 8 karakter</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-column gap-2">
        <label htmlFor="employee_id">Nama Karyawan</label>
        <Dropdown
          id="employee_id"
          name="employee_id"
          placeholder="Pilih Karyawan"
          value={formik.values.employee_id}
          options={employeeOptions}
          optionLabel="first_name"
          optionValue="id"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          filter
          filterDelay={400}
          className={isFieldInvalid("employee_id") ? "p-invalid" : ""}
        />

        {getFieldError("employee_id") && (
          <small className="p-error">{getFieldError("employee_id")}</small>
        )}
      </div>

      <FormDropdown
        props={{
          ...formik.getFieldProps("role"),
          options: roleOptions,
          optionLabel: "label",
          optionValue: "value",
          placeholder: "Pilih Role",
        }}
        fieldName={"role"}
        label="Role"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
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
