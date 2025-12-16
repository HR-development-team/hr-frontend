/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import FormInputText from "@components/FormInputText";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { useFormik } from "formik";
import { UserFormData, userFormSchema } from "../schemas/userSchema";
import { toFormikValidation } from "@utils/formikHelpers";

export interface RoleOption {
  label: string;
  value: string;
}

interface UserSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  userData: UserFormData | null;
  onSubmit: (values: UserFormData) => Promise<void>;
  isSubmitting: boolean;
  roleOptions: RoleOption[];
}
const userDefaultValues: UserFormData = {
  email: "",
  role_code: "",
  password: "",
};

export default function UserSaveDialog({
  userData,
  onSubmit,
  isSubmitting,
  isOpen,
  onClose,
  title,
  roleOptions,
}: UserSaveDialogProps) {
  // Setup Formik
  const formik = useFormik<UserFormData>({
    initialValues: userData || userDefaultValues,
    enableReinitialize: true,
    validationSchema: null,
    validate: toFormikValidation(userFormSchema),

    onSubmit: async (values, { setStatus }) => {
      try {
        await onSubmit(values);
      } catch (error: any) {
        setStatus(error?.message || "Terjadi kesalahan saat menyimpan");
      }
    },
  });

  // Helpers for Field State
  const isFieldInvalid = (name: keyof UserFormData) =>
    Boolean(formik.touched[name] && formik.errors[name]);

  const getFieldError = (name: keyof UserFormData) =>
    isFieldInvalid(name) ? String(formik.errors[name]) : undefined;

  const handleHide = () => {
    formik.resetForm();
    onClose();
  };

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
            className="flex gap-1"
            text
            onClick={handleHide}
            disabled={isSubmitting}
          />
          <Button
            label="Simpan"
            icon="pi pi-save"
            className="flex gap-1"
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
        {/* 1. Email Input */}
        <FormInputText
          props={formik.getFieldProps("email")}
          fieldName="email"
          label="Email"
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
        />

        {/* 2. Role Dropdown */}
        <div className="flex flex-column gap-2">
          <label htmlFor="role_code" className="font-medium">
            Role
          </label>
          <Dropdown
            id="role_code"
            value={formik.values.role_code}
            options={roleOptions}
            onChange={(e) => formik.setFieldValue("role_code", e.value)}
            placeholder="Pilih Role"
            className={classNames("w-full", {
              "p-invalid": isFieldInvalid("role_code"),
            })}
            filter
          />
          {isFieldInvalid("role_code") && (
            <small className="p-error">{getFieldError("role_code")}</small>
          )}
        </div>

        {/* 3. Password Input */}
        <FormInputText
          props={{
            ...formik.getFieldProps("password"),
            type: "password",
            autoComplete: "new-password",
          }}
          fieldName="password"
          label="Password"
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
          optional={!!userData?.email}
        />

        {/* Global API Error Message */}
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
