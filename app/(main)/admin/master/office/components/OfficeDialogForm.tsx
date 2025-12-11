"use client";

import dynamic from "next/dynamic";
import { LatLng } from "@/lib/types/mapInput";
import FormInputText from "@/components/form/FormInputText";
import FormInputTextarea from "@/components/form/FormInputTextarea";
import {
  OfficeFormData,
  officeFormSchema,
} from "@/lib/schemas/officeFormSchema";
import { OfficeFormProps } from "@/lib/types/form/officeFormType";
import { officeDefaultValues } from "@/lib/values/officeDefaultValue";
import { useFormik } from "formik";
import { useCallback } from "react";
import FormInputNumber from "@/components/form/FormInputNumber";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { Button } from "primereact/button";
import FormDropdown from "@/components/form/FormDropdown";

const MapInput = dynamic(
  () =>
    import("@/(main)/admin/master/office/components/mapComponents/MapInput"),
  {
    ssr: false,
    loading: () => <p>Memuat Peta...</p>,
  }
);

export default function OfficeDialogForm({
  officeData,
  officeOptions,
  onSubmit,
  isSubmitting,
}: OfficeFormProps) {
  const formik = useFormik({
    initialValues: officeData || officeDefaultValues,
    validate: (values) => {
      const validation = officeFormSchema.safeParse(values);

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

  const handleMapUpdate = useCallback(
    (newPosition: LatLng) => {
      formik.setFieldValue("latitude", newPosition.lat, true);
      formik.setFieldValue("longitude", newPosition.lng, true);
    },
    [formik.setFieldValue]
  );

  const currentCoordinates: LatLng = {
    lat: formik.values.latitude || officeDefaultValues.latitude,
    lng: formik.values.longitude || officeDefaultValues.longitude,
  };

  const isFieldInvalid = (fieldName: keyof OfficeFormData) =>
    !!(formik.touched[fieldName] && formik.errors[fieldName]);

  const getFieldError = (fieldName: keyof OfficeFormData) => {
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
        label="Nama Kantor"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />

      <FormInputTextarea
        props={{
          ...formik.getFieldProps("address"),
          rows: 5,
        }}
        fieldName={"address"}
        label="Alamat Kantor"
        isFieldInvalid={isFieldInvalid}
        getFieldError={getFieldError}
      />

      <div className="flex flex-column gap-2">
        <label>Lokasi Kantor (Pilih di Peta)</label>
        <MapInput
          onCoordinateChange={handleMapUpdate}
          initialPosition={currentCoordinates}
        />
      </div>

      <div className="grid">
        <div className="col-12 md:col-6">
          <FormInputNumber
            props={{
              value: formik.values.latitude,
              onValueChange: (e: InputNumberValueChangeEvent) => {
                formik.setFieldValue("latitude", e.value);
              },
              onBlur: formik.handleBlur,
              min: -90,
              max: 90,
              maxFractionDigits: 8,
            }}
            fieldName={"latitude"}
            label="Latitude"
            isFieldInvalid={isFieldInvalid}
            getFieldError={getFieldError}
          />
        </div>

        <div className="col-12 md:col-6">
          <FormInputNumber
            props={{
              value: formik.values.longitude,
              onValueChange: (e: InputNumberValueChangeEvent) => {
                formik.setFieldValue("longitude", e.value);
              },
              onBlur: formik.handleBlur,
              min: -180,
              max: 180,
              maxFractionDigits: 8,
            }}
            fieldName={"longitude"}
            label="Longitude"
            isFieldInvalid={isFieldInvalid}
            getFieldError={getFieldError}
          />
        </div>
      </div>

      <div className="grid">
        <div className="col-12 md:col-6">
          <FormInputNumber
            props={{
              value: formik.values.radius_meters,
              onValueChange: (e: InputNumberValueChangeEvent) => {
                formik.setFieldValue("radius_meters", e.value);
              },
              onBlur: formik.handleBlur,
              min: -180,
              max: 180,
              maxFractionDigits: 8,
            }}
            fieldName={"radius_meters"}
            label="Radius Kantor (dalam meter)"
            isFieldInvalid={isFieldInvalid}
            getFieldError={getFieldError}
          />
        </div>

        <div className="col-12 md:col-6">
          <FormDropdown
            props={{
              ...formik.getFieldProps("parent_office_code"),
              options: officeOptions,
              optionLabel: "name",
              optionValue: "office_code",
              placeholder: "Pilih Induk Kantor",
              filter: true,
              filterDelay: 400,
            }}
            fieldName={"parent_office_code"}
            label="Pilih Induk Kantor"
            isFieldInvalid={isFieldInvalid}
            getFieldError={getFieldError}
          />
        </div>
      </div>

      <FormInputTextarea
        props={{
          ...formik.getFieldProps("description"),
          rows: 5,
        }}
        fieldName={"description"}
        label="Deskripsi Kantor"
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
