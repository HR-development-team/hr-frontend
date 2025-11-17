"use client";

import FormCalendar from "@/components/form/FormCalendar";
import FormDropdown from "@/components/form/FormDropdown";
import FormInputText from "@/components/form/FormInputText";
import FormInputTextarea from "@/components/form/FormInputTextarea";
import {
  EmployeeFormData,
  employeeFormSchema,
} from "@/lib/schemas/employeeFormSchema";
import { EmployeeFormProps } from "@/lib/types/form/employeeFormType";
import {
  employeeFormDefaultValues,
  genderOptions,
  marriedOptions,
  statusOptions,
} from "@/lib/values/employeeDefaultValue";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export default function EmployeeDialogForm({
  employeeData,
  onSubmit,
  dialogMode,
  positionOptions,
  userOptions,
  isSubmitting,
}: EmployeeFormProps) {
  const formik = useFormik({
    initialValues: employeeData || employeeFormDefaultValues,
    validate: (values) => {
      const validation = employeeFormSchema.safeParse(values);

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

  const isOnEditMode: boolean = dialogMode === "edit" ? true : false;

  const isFieldInvalid = (fieldName: keyof EmployeeFormData) =>
    !!(formik.touched[fieldName] && formik.errors[fieldName]);

  const getFieldError = (fieldName: keyof EmployeeFormData) => {
    return isFieldInvalid(fieldName)
      ? (formik.errors[fieldName] as string)
      : undefined;
  };

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-column gap-3">
      <FormInputText
        props={{
          ...formik.getFieldProps("full_name"),
          placeholder: "Isi Nama Lengkap",
        }}
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        label="Nama Lengkap"
        fieldName={"full_name"}
      />

      <FormCalendar
        props={{
          value: formik.values.join_date,
          onChange: (e: any) => formik.setFieldValue("join_date", e.value),
          onBlur: formik.handleBlur,
          dateFormat: "dd/mm/yy",
          disabled: isOnEditMode,
          showIcon: true,
          placeholder: "Tanggal Bergabung",
        }}
        fieldName={"join_date"}
        label="Tanggal Bergabung"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />

      <FormDropdown
        props={{
          ...formik.getFieldProps("position_code"),
          options: positionOptions,
          optionLabel: "name",
          optionValue: "position_code",
          filter: true,
          filterDelay: 400,
          placeholder: "Pilih Jabatan",
        }}
        fieldName={"position_code"}
        label="Jabatan"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />

      <FormDropdown
        props={{
          ...formik.getFieldProps("user_code"),
          options: userOptions,
          optionLabel: "email",
          optionValue: "user_code",
          placeholder: "Pilih User",
          filter: true,
          filterDelay: 400,
        }}
        fieldName={"user_code"}
        label="User Karyawan"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />

      <FormDropdown
        props={{
          ...formik.getFieldProps("employment_status"),
          options: statusOptions,
          optionLabel: "label",
          optionValue: "value",
          placeholder: "Status",
        }}
        fieldName={"employment_status"}
        label="Status Karyawan"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />

      <FormInputText
        props={{
          ...formik.getFieldProps("contact_phone"),
          type: "number",
        }}
        label="No. Telepon"
        fieldName={"contact_phone"}
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <FormInputTextarea
        props={{
          ...formik.getFieldProps("address"),
          rows: 5,
        }}
        label={"Alamat"}
        fieldName={"address"}
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <FormInputText
        props={{
          ...formik.getFieldProps("ktp_number"),
        }}
        label={`No. KTP`}
        fieldName={"ktp_number"}
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <FormInputText
        props={{
          ...formik.getFieldProps("birth_place"),
        }}
        label={"Tempat Lahir"}
        fieldName={"birth_place"}
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <FormCalendar
        props={{
          value: formik.values.birth_date,
          onChange: (e: any) => formik.setFieldValue("birth_date", e.value),
          onBlur: formik.handleBlur,
          dateFormat: "dd/mm/yy",
          showIcon: true,
          placeholder: "Tanggal Lahir",
        }}
        fieldName={"birth_date"}
        label="Tanggal Lahir"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <FormDropdown
        props={{
          ...formik.getFieldProps("gender"),
          options: genderOptions,
          optionLabel: "label",
          optionValue: "value",
        }}
        label="Jenis Kelamin"
        fieldName={"gender"}
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <FormInputText
        props={{
          ...formik.getFieldProps("religion"),
        }}
        label={"Agama"}
        fieldName={"religion"}
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <FormDropdown
        props={{
          ...formik.getFieldProps("maritial_status"),
          options: marriedOptions,
          optionLabel: "label",
          optionValue: "value",
          placeholder: "Status pernikahan",
        }}
        fieldName={"maritial_status"}
        label="Status Pernikahan"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <FormCalendar
        props={{
          value: formik.values.resign_date,
          onChange: (e: any) => formik.setFieldValue("resign_date", e.value),
          onBlur: formik.handleBlur,
          dateFormat: "dd/mm/yy",
          disabled: isOnEditMode,
          showIcon: true,
          placeholder: "Tanggal Keluar",
        }}
        fieldName={"resign_date"}
        label="Tanggal Keluar"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <FormInputText
        props={{
          ...formik.getFieldProps("education"),
        }}
        label={"Pendidikan Terakhir"}
        fieldName={"education"}
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <FormInputText
        props={{
          ...formik.getFieldProps("blood_type"),
        }}
        label={"Gol. Darah"}
        fieldName={"blood_type"}
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <div className="flex flex-column gap-2">
        <label htmlFor="profile_picture">
          Foto Profil <span className="text-xs font-light">(optional)</span>
        </label>
        <InputText
          id="profile_picture"
          name="profile_picture"
          value={
            formik.values.profile_picture === "string"
              ? formik.values.profile_picture
              : null
          }
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={isFieldInvalid("profile_picture") ? "p-invalid" : ""}
        />

        {getFieldError("profile_picture") && (
          <small className="p-error">{getFieldError("profile_picture")}</small>
        )}
      </div>

      <FormInputText
        props={{
          ...formik.getFieldProps("bpjs_ketenagakerjaan"),
        }}
        label={"No. BPJS Ketenagakerjaan"}
        fieldName={"bpjs_ketenagakerjaan"}
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <FormInputText
        props={{
          ...formik.getFieldProps("bpjs_kesehatan"),
        }}
        label={"No. BPJS Kesehatan"}
        fieldName={"bpjs_kesehatan"}
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <FormInputText
        props={{
          ...formik.getFieldProps("npwp"),
        }}
        label={"No. NPWP"}
        fieldName={"npwp"}
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <FormInputText
        props={{
          ...formik.getFieldProps("bank_account"),
        }}
        label={"No. Rekening Bank"}
        fieldName={"bank_account"}
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
        optional
      />

      <div className="flex justify-content-end mt-4">
        <Button
          type="submit"
          label="Simpan"
          icon="pi pi-save"
          loading={isSubmitting}
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
