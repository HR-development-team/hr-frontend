/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { useFormik } from "formik";
import FormInputText from "@components/FormInputText";
import { OfficeFormData, officeFormSchema } from "../schemas/officeSchema";
import { toFormikValidation } from "@utils/formikHelpers";

const MapInput = dynamic(() => import("./mapComponents/MapInput"), {
  ssr: false,
  loading: () => (
    <div className="h-20rem w-full bg-gray-100 border-round flex align-items-center justify-content-center text-gray-500">
      Memuat Peta...
    </div>
  ),
});

export interface ParentOfficeOption {
  label: string;
  value: string;
}

interface OfficeSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  officeData: any;
  onSubmit: (values: OfficeFormData) => Promise<void>;
  isSubmitting: boolean;
  parentOfficeOptions: ParentOfficeOption[];
}

const officeDefaultValues: OfficeFormData = {
  name: "",
  address: "",
  latitude: -6.2088,
  longitude: 106.8456,
  radius_meters: 100,
  parent_office_code: null,
  description: "",
};

export default function OfficeSaveDialog({
  officeData,
  onSubmit,
  isSubmitting,
  isOpen,
  onClose,
  title,
  parentOfficeOptions = [],
}: OfficeSaveDialogProps) {
  // 1. Memoize Initial Values
  const initialValues = useMemo(() => {
    if (officeData) {
      const parseCoord = (val: any) => {
        const num = Number(val);
        return num && num !== 0 ? num : undefined;
      };

      return {
        name: officeData.name || "",
        address: officeData.address || "",
        latitude:
          parseCoord(officeData.latitude) || officeDefaultValues.latitude,
        longitude:
          parseCoord(officeData.longitude) || officeDefaultValues.longitude,
        radius_meters: Number(
          officeData.radius_meters || officeDefaultValues.radius_meters
        ),
        parent_office_code: officeData.parent_office_code || null,
        description: officeData.description || "",
      };
    }
    return officeDefaultValues;
  }, [officeData]);

  const formik = useFormik<OfficeFormData>({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: null,
    validate: toFormikValidation(officeFormSchema),
    onSubmit: async (values, { setStatus }) => {
      try {
        await onSubmit(values);
      } catch (error: any) {
        setStatus(
          error?.message || "Terjadi kesalahan saat menyimpan data kantor"
        );
      }
    },
  });

  // 2. Stable Handler
  const handleMapUpdate = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      // Only update if values actually changed to prevent micro-loops
      if (lat !== formik.values.latitude || lng !== formik.values.longitude) {
        formik.setFieldValue("latitude", lat);
        formik.setFieldValue("longitude", lng);
      }
    },
    [formik.values.latitude, formik.values.longitude, formik.setFieldValue]
  );

  const mapInitialPosition = useMemo(() => {
    return {
      lat: Number(initialValues.latitude),
      lng: Number(initialValues.longitude),
    };
  }, [initialValues]);

  const isFieldInvalid = (name: keyof OfficeFormData) =>
    Boolean(formik.touched[name] && formik.errors[name]);

  const getFieldError = (name: keyof OfficeFormData) =>
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
      className="w-full md:w-6 lg:w-5"
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
          label="Nama Kantor"
          isFieldInvalid={isFieldInvalid}
          getFieldError={getFieldError}
        />

        <div className="flex flex-column gap-2">
          <label htmlFor="parent_office_code" className="font-medium">
            Kantor Induk (Opsional)
          </label>
          <Dropdown
            id="parent_office_code"
            value={formik.values.parent_office_code}
            options={parentOfficeOptions}
            onChange={(e) =>
              formik.setFieldValue("parent_office_code", e.value)
            }
            placeholder="Pilih Kantor Induk"
            className={classNames("w-full", {
              "p-invalid": isFieldInvalid("parent_office_code"),
            })}
            showClear
            filter
          />
        </div>

        <div className="flex flex-column gap-2">
          <label htmlFor="address" className="font-medium">
            Alamat Lengkap
          </label>
          <InputTextarea
            id="address"
            {...formik.getFieldProps("address")}
            rows={3}
            className={classNames("w-full", {
              "p-invalid": isFieldInvalid("address"),
            })}
            placeholder="Jl. Raya..."
          />
          {isFieldInvalid("address") && (
            <small className="p-error">{getFieldError("address")}</small>
          )}
        </div>

        {/* --- Location Section --- */}
        <div className="flex flex-column gap-2 border-1 border-gray-200 p-3 border-round">
          <h3 className="text-base font-medium m-0 mb-2 text-gray-700">
            Lokasi Kantor
          </h3>

          <div
            className="w-full border-round overflow-hidden shadow-1"
            style={{ minHeight: "300px" }}
          >
            <MapInput
              onCoordinateChange={handleMapUpdate}
              initialPosition={mapInitialPosition}
              zoom={8}
            />
          </div>
          <small className="text-gray-500">
            Geser pin pada peta untuk menentukan lokasi.
          </small>

          <div className="grid mt-2">
            <div className="col-12 md:col-6">
              <div className="flex flex-column gap-2">
                <label className="text-sm font-medium">Latitude</label>
                <InputNumber
                  value={formik.values.latitude}
                  mode="decimal"
                  minFractionDigits={6}
                  maxFractionDigits={8}
                  readOnly
                  className={classNames("w-full p-inputtext-sm", {
                    "p-invalid": isFieldInvalid("latitude"),
                  })}
                  inputClassName="bg-gray-100"
                />
                {isFieldInvalid("latitude") && (
                  <small className="p-error">{getFieldError("latitude")}</small>
                )}
              </div>
            </div>
            <div className="col-12 md:col-6">
              <div className="flex flex-column gap-2">
                <label className="text-sm font-medium">Longitude</label>
                <InputNumber
                  value={formik.values.longitude}
                  mode="decimal"
                  minFractionDigits={6}
                  maxFractionDigits={8}
                  readOnly
                  className={classNames("w-full p-inputtext-sm", {
                    "p-invalid": isFieldInvalid("longitude"),
                  })}
                  inputClassName="bg-gray-100"
                />
                {isFieldInvalid("longitude") && (
                  <small className="p-error">
                    {getFieldError("longitude")}
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-column gap-2 mt-2">
            <label htmlFor="radius_meters" className="font-medium">
              Radius (Meter)
            </label>
            <InputNumber
              id="radius_meters"
              value={formik.values.radius_meters}
              onValueChange={(e: InputNumberValueChangeEvent) =>
                formik.setFieldValue("radius_meters", e.value)
              }
              min={1}
              suffix=" meters"
              className={classNames("w-full", {
                "p-invalid": isFieldInvalid("radius_meters"),
              })}
            />
            {isFieldInvalid("radius_meters") && (
              <small className="p-error">
                {getFieldError("radius_meters")}
              </small>
            )}
          </div>
        </div>

        <div className="flex flex-column gap-2">
          <label htmlFor="description" className="font-medium">
            Deskripsi (Opsional)
          </label>
          <InputTextarea
            id="description"
            {...formik.getFieldProps("description")}
            rows={2}
          />
        </div>

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
