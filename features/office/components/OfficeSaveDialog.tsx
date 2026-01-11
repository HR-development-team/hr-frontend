/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
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

  // --- MAP SYNC LOGIC START ---

  // 2. Local state for "Debounced Map Position"
  // We use this to prevent the map from "fighting" the user while they type
  const [mapSyncPosition, setMapSyncPosition] = useState({
    lat: Number(initialValues.latitude),
    lng: Number(initialValues.longitude),
  });

  // 3. Debounce Effect: Sync Formik -> Map (One-way with delay)
  // When user types in InputNumber, wait 1000ms before moving the map pin.
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapSyncPosition({
        lat: Number(formik.values.latitude) || 0,
        lng: Number(formik.values.longitude) || 0,
      });
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, [formik.values.latitude, formik.values.longitude]);

  // 4. Map Handler: Sync Map -> Formik (Immediate)
  // When user Drags the pin, update the inputs immediately.
  const handleMapUpdate = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      // Small epsilon check to prevent floating point loops
      const epsilon = 0.0000001;
      const currentLat = Number(formik.values.latitude);
      const currentLng = Number(formik.values.longitude);

      const latDiff = Math.abs(lat - currentLat);
      const lngDiff = Math.abs(lng - currentLng);

      // Only update if the change is significant (real drag)
      if (latDiff > epsilon || lngDiff > epsilon) {
        formik.setFieldValue("latitude", lat);
        formik.setFieldValue("longitude", lng);
      }
    },
    [formik]
  );

  // --- MAP SYNC LOGIC END ---

  const isFieldInvalid = (name: keyof OfficeFormData) =>
    Boolean(formik.touched[name] && formik.errors[name]);

  const getFieldError = (name: keyof OfficeFormData) =>
    isFieldInvalid(name) ? String(formik.errors[name]) : undefined;

  const handleHide = () => {
    formik.resetForm();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
          {/* LOGIC: Check if there are any parent options available */}
          {(() => {
            const hasParentOptions = parentOfficeOptions.length > 0;

            return (
              <>
                <label htmlFor="parent_office_code" className="font-medium">
                  Kantor Induk
                  {/* If options exist, show Red Asterisk (Required) */}
                  {hasParentOptions ? (
                    <span className="text-red-500 ml-1">*</span>
                  ) : (
                    <span className="text-gray-500 font-normal text-sm ml-1">
                      (Akan menjadi Kantor Pusat)
                    </span>
                  )}
                </label>
                <Dropdown
                  id="parent_office_code"
                  value={formik.values.parent_office_code}
                  options={parentOfficeOptions}
                  onChange={(e) =>
                    formik.setFieldValue("parent_office_code", e.value)
                  }
                  // Change placeholder based on context
                  placeholder={
                    hasParentOptions
                      ? "Pilih Kantor Induk"
                      : "Tidak ada kantor induk tersedia"
                  }
                  // Disable input if this is the first office (no parents exist)
                  disabled={!hasParentOptions}
                  className={classNames("w-full", {
                    "p-invalid": isFieldInvalid("parent_office_code"),
                    // Optional: Visual cue if it's required but empty (and touched)
                    "p-d-block": true,
                  })}
                  showClear={hasParentOptions} // Only allow clear if it's actually selectable
                  filter
                />
                {/* Helper text to explain to the user */}
                {!hasParentOptions && (
                  <small className="text-gray-500">
                    Belum ada kantor terdaftar. Kantor ini otomatis akan diatur
                    sebagai <strong>Kantor Pusat</strong>.
                  </small>
                )}
                {/* Error Message */}
                {isFieldInvalid("parent_office_code") && (
                  <small className="p-error">
                    {getFieldError("parent_office_code")}
                  </small>
                )}
              </>
            );
          })()}
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
            {/* THE FIX: 
                We pass 'mapSyncPosition' (the delayed one) instead of 'formik.values'.
                This stops the map from resetting your input while typing.
            */}
            <MapInput
              onCoordinateChange={handleMapUpdate}
              initialPosition={mapSyncPosition}
              zoom={13}
            />
          </div>
          <small className="text-gray-500">
            Geser pin pada peta atau masukkan koordinat secara manual di bawah.
          </small>

          <div className="grid mt-2">
            <div className="col-12 md:col-6">
              <div className="flex flex-column gap-2">
                <label className="text-sm font-medium">Latitude</label>
                {/* THE FIX: 
                   InputNumber stays strictly tied to Formik (instant feedback).
                */}
                <InputNumber
                  value={formik.values.latitude}
                  onValueChange={(e: InputNumberValueChangeEvent) =>
                    formik.setFieldValue("latitude", e.value)
                  }
                  mode="decimal"
                  min={-90}
                  max={90}
                  minFractionDigits={6}
                  maxFractionDigits={8}
                  useGrouping={false} // Often helps with copy-paste issues
                  className={classNames("w-full p-inputtext-sm", {
                    "p-invalid": isFieldInvalid("latitude"),
                  })}
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
                  onValueChange={(e: InputNumberValueChangeEvent) =>
                    formik.setFieldValue("longitude", e.value)
                  }
                  mode="decimal"
                  min={-180}
                  max={180}
                  minFractionDigits={6}
                  maxFractionDigits={8}
                  useGrouping={false} // Often helps with copy-paste issues
                  className={classNames("w-full p-inputtext-sm", {
                    "p-invalid": isFieldInvalid("longitude"),
                  })}
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
