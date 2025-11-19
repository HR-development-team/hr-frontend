/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import FormCalendar from "@/components/form/FormCalendar";
import {
  AttendanceSessionFormData,
  attendanceSessionFormSchema,
} from "@/lib/schemas/attendanceFormSchema";
import { AttendanceSessionFormProps } from "@/lib/types/form/attendanceSessionFormType";
import { AttendanceSessioFormDefaultValues } from "@/lib/values/attendanceSessionDefaultValue";
import { useFormik } from "formik";
import { Button } from "primereact/button";

export default function AttendanceSessionDialogForm({
  sessionData,
  onSubmit,
}: AttendanceSessionFormProps) {
  const formik = useFormik<AttendanceSessionFormData>({
    initialValues: sessionData || AttendanceSessioFormDefaultValues,
    validate: (values) => {
      const validation = attendanceSessionFormSchema.safeParse(values);

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

  const isFieldInvalid = (fieldName: keyof AttendanceSessionFormData) =>
    !!(formik.touched[fieldName] && formik.errors[fieldName]);

  const getFieldError = (fieldName: keyof AttendanceSessionFormData) => {
    return isFieldInvalid(fieldName)
      ? (formik.errors[fieldName] as string)
      : undefined;
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-column gap-3 pt-2"
    >
      <FormCalendar
        props={{
          value: formik.values.date,
          onChange: (e: any) => formik.setFieldValue("date", e.value),
          onBlur: formik.handleBlur,
          dateFormat: "dd/mm/yy",
          showIcon: true,
          placeholder: "Pilih Tanggal",
        }}
        fieldName={"date"}
        label="Tanggal Sesi Dibuka"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />

      <div className="flex gap-3 w-full">
        <div className="flex-1">
          <FormCalendar
            props={{
              value: formik.values.open_time,
              onChange: (e: any) => formik.setFieldValue("open_time", e.value),
              onBlur: formik.handleBlur,
              timeOnly: true,
              showSeconds: true,
              showIcon: true,
              placeholder: "Pilih Waktu",
            }}
            fieldName={"open_time"}
            label="Waktu Sesi Dibuka"
            isFieldInvalid={isFieldInvalid}
            getFieldError={getFieldError}
          />
        </div>

        <div className="flex-1">
          <FormCalendar
            props={{
              value: formik.values.cutoff_time,
              onChange: (e: any) =>
                formik.setFieldValue("cutoff_time", e.value),
              onBlur: formik.handleBlur,
              timeOnly: true,
              showSeconds: true,
              showIcon: true,
              placeholder: "Pilih Waktu",
            }}
            fieldName={"cutoff_time"}
            label="Batas Telat (Cutoff)"
            isFieldInvalid={isFieldInvalid}
            getFieldError={getFieldError}
          />
        </div>
      </div>

      <FormCalendar
        props={{
          value: formik.values.close_time,
          onChange: (e: any) => formik.setFieldValue("close_time", e.value),
          onBlur: formik.handleBlur,
          timeOnly: true,
          showSeconds: true,
          showIcon: true,
          placeholder: "Pilih Waktu",
        }}
        fieldName={"close_time"}
        label="Jam Tutup (Close)"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />

      <div className="flex justify-content-end mt-4">
        <Button
          type="submit"
          label="Simpan"
          icon="pi pi-save"
          severity="success"
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
