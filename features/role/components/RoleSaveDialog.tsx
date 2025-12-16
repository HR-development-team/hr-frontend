/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import FormInputText from "@components/FormInputText";
import FormInputTextarea from "@components/FormInputTextarea";
import { RoleFormData, RoleBaseSchema } from "../schemas/roleSchema";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { toFormikValidation } from "@utils/formikHelpers";

interface RoleSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  roleData: RoleFormData | null;
  onSubmit: (formData: RoleFormData) => Promise<void>;
  isSubmitting: boolean;
}

const roleDefaultValues: RoleFormData = {
  name: "",
  description: null,
};

export default function RoleSaveDialog({
  roleData,
  onSubmit,
  isSubmitting,
  isOpen,
  onClose,
  title,
}: RoleSaveDialogProps) {
  // Setup Formik
  const formik = useFormik<RoleFormData>({
    initialValues: roleData || roleDefaultValues,
    enableReinitialize: true,
    validationSchema: null,
    validate: toFormikValidation(RoleBaseSchema),

    onSubmit: async (values, { setStatus }) => {
      try {
        await onSubmit(values);
      } catch (error: any) {
        setStatus(error?.message || "Terjadi kesalahan saat menyimpan");
      }
    },
  });

  // Helpers for Field State
  const isFieldInvalid = (name: keyof RoleFormData) =>
    Boolean(formik.touched[name] && formik.errors[name]);

  const getFieldError = (name: keyof RoleFormData) =>
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
        <FormInputText
          props={formik.getFieldProps("name")}
          fieldName="name"
          label="Nama Role"
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
        />

        <FormInputTextarea
          props={{
            ...formik.getFieldProps("description"),
            rows: 5,
          }}
          fieldName="description"
          label="Deskripsi"
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
          optional
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
