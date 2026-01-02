/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { useFormik } from "formik";
import { Nullable } from "primereact/ts-helpers";

import FormInputText from "@components/FormInputText";
import {
  ShiftFormData,
  ShiftUiFormData,
  shiftUiFormSchema,
} from "../schemas/shiftSchema";
import { toFormikValidation } from "@utils/formikHelpers";
import { formatTime } from "@/utils/dateFormat";

export interface OfficeOption {
  label: string;
  value: string;
}

interface ShiftSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shiftData: (ShiftFormData & { id?: number }) | null;
  onSubmit: (values: ShiftFormData) => Promise<void>;
  isSubmitting: boolean;
  officeOptions: OfficeOption[];
}

const shiftDefaultValues: ShiftFormData = {
  name: "",
  start_time: "",
  end_time: "",
  check_in_limit_minutes: 60,
  check_out_limit_minutes: 60,
  is_overnight: 0,
  late_tolerance_minutes: 0,
  office_code: "",
  work_days: [],
};

const dayOptions = [
  { label: "Senin", value: 1 },
  { label: "Selasa", value: 2 },
  { label: "Rabu", value: 3 },
  { label: "Kamis", value: 4 },
  { label: "Jumat", value: 5 },
  { label: "Sabtu", value: 6 },
  { label: "Minggu", value: 0 },
];

export default function ShiftSaveDialog({
  shiftData,
  onSubmit,
  isSubmitting,
  isOpen,
  onClose,
  title,
  officeOptions,
}: ShiftSaveDialogProps) {
  const parseTimeString = (timeStr: string | undefined): Nullable<Date> => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0);
    return date;
  };

  const initialValues: ShiftUiFormData = useMemo(() => {
    if (shiftData) {
      return {
        // We spread shiftData here to hydrate the form...
        ...shiftData,
        start_time: parseTimeString(shiftData.start_time) as Date,
        end_time: parseTimeString(shiftData.end_time) as Date,
        check_in_limit_minutes: Number(shiftData.check_in_limit_minutes),
        check_out_limit_minutes: Number(shiftData.check_out_limit_minutes),
        late_tolerance_minutes: Number(shiftData.late_tolerance_minutes),
        is_overnight: Number(shiftData.is_overnight),
        work_days: shiftData.work_days || [],
      };
    }
    return {
      ...shiftDefaultValues,
      start_time: null as any,
      end_time: null as any,
    };
  }, [shiftData]);

  const formik = useFormik<ShiftUiFormData>({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: null,
    validate: toFormikValidation(shiftUiFormSchema),
    onSubmit: async (values, { setStatus }) => {
      try {
        // FIX 3: Construct payload EXPLICITLY.
        // Do NOT use `...values` because it contains 'id', 'created_at', etc.
        // which causes the "Disallowed field" error.
        const payload: any = {
          // Using 'any' briefly to bypass TS mismatch on boolean/number
          name: values.name,
          office_code: values.office_code,
          start_time: formatTime(values.start_time),
          end_time: formatTime(values.end_time),
          check_in_limit_minutes: Number(values.check_in_limit_minutes),
          check_out_limit_minutes: Number(values.check_out_limit_minutes),
          late_tolerance_minutes: Number(values.late_tolerance_minutes),
          work_days: values.work_days,

          // FIX 2: Send Boolean (true/false) instead of Number (1/0)
          is_overnight: values.is_overnight === 1,
        };

        await onSubmit(payload);
      } catch (error: any) {
        setStatus(
          error?.message || "Terjadi kesalahan saat menyimpan data shift"
        );
      }
    },
  });

  const handleHide = () => {
    formik.resetForm();
    onClose();
  };

  const isFieldInvalid = (name: keyof ShiftUiFormData) =>
    Boolean(formik.touched[name] && formik.errors[name]);

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
            className="gap-1"
            text
            onClick={handleHide}
            disabled={isSubmitting}
          />
          <Button
            label="Simpan"
            icon="pi pi-save"
            severity="success"
            className="gap-1"
            onClick={() => formik.submitForm()}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      }
    >
      <style jsx global>{`
        .compact-input-number .p-inputtext {
          padding-top: 0.4rem;
          padding-bottom: 0.4rem;
          font-size: 0.85rem;
        }
        .compact-input-number .p-inputnumber-input {
          width: 1rem !important;
        }
        .compact-input-number .p-inputnumber-input .p-icon {
          font-size: 0.7rem;
        }
      `}</style>

      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-column gap-3 mt-2"
      >
        {/* ROW 1: Office */}
        <div className="flex flex-column gap-2">
          <label htmlFor="office_code" className="font-medium">
            Kantor <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="office_code"
            value={formik.values.office_code}
            options={officeOptions}
            onChange={(e) => formik.setFieldValue("office_code", e.value)}
            optionLabel="label"
            optionValue="value"
            placeholder="Pilih Kantor"
            filter
            showClear
            className={classNames("w-full", {
              "p-invalid": isFieldInvalid("office_code"),
            })}
          />
          {isFieldInvalid("office_code") && (
            <small className="p-error">{formik.errors.office_code}</small>
          )}
        </div>

        {/* ROW 2: Name */}
        <FormInputText
          props={formik.getFieldProps("name")}
          fieldName="name"
          label="Nama Shift"
          isFieldInvalid={(name) =>
            isFieldInvalid(name as keyof ShiftUiFormData)
          }
          getFieldError={(name) =>
            formik.errors[name as keyof ShiftUiFormData] as string
          }
        />

        {/* ROW 3: Time Configuration */}
        <div className="flex flex-column sm:flex-row gap-3">
          <div className="flex-1 flex flex-column gap-2">
            <label htmlFor="start_time" className="font-medium">
              Jam Masuk <span className="text-red-500">*</span>
            </label>
            <Calendar
              id="start_time"
              value={formik.values.start_time}
              onChange={(e) => formik.setFieldValue("start_time", e.value)}
              timeOnly
              hourFormat="24"
              showIcon
              iconPos="right"
              placeholder="08:00"
              className={classNames("w-full", {
                "p-invalid": isFieldInvalid("start_time"),
              })}
            />
            {isFieldInvalid("start_time") && (
              <small className="p-error">
                {formik.errors.start_time as string}
              </small>
            )}
          </div>

          <div className="flex-1 flex flex-column gap-2">
            <label htmlFor="end_time" className="font-medium">
              Jam Pulang <span className="text-red-500">*</span>
            </label>
            <Calendar
              id="end_time"
              value={formik.values.end_time}
              onChange={(e) => formik.setFieldValue("end_time", e.value)}
              timeOnly
              hourFormat="24"
              showIcon
              iconPos="right"
              placeholder="17:00"
              className={classNames("w-full", {
                "p-invalid": isFieldInvalid("end_time"),
              })}
            />
            {isFieldInvalid("end_time") && (
              <small className="p-error">
                {formik.errors.end_time as string}
              </small>
            )}
          </div>

          {/* Overnight Switch */}
          <div className="flex flex-column gap-2 align-items-start sm:align-items-center justify-content-center">
            <label htmlFor="is_overnight" className="font-medium text-sm">
              Lintas Hari?
            </label>
            <div className="flex align-items-center gap-2">
              <InputSwitch
                id="is_overnight"
                checked={formik.values.is_overnight === 1}
                onChange={(e) =>
                  formik.setFieldValue("is_overnight", e.value ? 1 : 0)
                }
              />
              <span className="text-sm text-gray-500">
                {formik.values.is_overnight === 1 ? "Ya (H+1)" : "Tidak"}
              </span>
            </div>
          </div>
        </div>

        {/* ROW 4: Tolerance & Limits (Compact Grid) */}
        <div className="formgrid grid">
          {/* 1. Tolerance */}
          <div className="field col-12 md:col-4 flex flex-column gap-2">
            <div className="flex flex-column gap-1" style={{ width: "100%" }}>
              <label
                htmlFor="late_tolerance_minutes"
                className="font-medium text-sm white-space-nowrap overflow-hidden text-overflow-ellipsis"
                title="Toleransi Terlambat (Menit)"
                style={{ fontSize: "0.85rem" }}
              >
                Toleransi (Menit)
              </label>
              <InputNumber
                id="late_tolerance_minutes"
                value={formik.values.late_tolerance_minutes}
                onValueChange={(e) =>
                  formik.setFieldValue("late_tolerance_minutes", e.value)
                }
                mode="decimal"
                showButtons
                min={0}
                max={120}
                placeholder="0"
                tooltip="Jumlah menit keterlambatan yang masih dianggap 'Tepat Waktu'."
                tooltipOptions={{ showDelay: 300, position: "top" }}
                className="w-full compact-input-number"
                inputClassName="text-center"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* 2. Check In Limit */}
          <div className="field col-12 md:col-4 flex flex-column gap-2">
            <div className="flex flex-column gap-1" style={{ width: "100%" }}>
              <label
                htmlFor="check_in_limit_minutes"
                className="font-medium text-sm white-space-nowrap overflow-hidden text-overflow-ellipsis"
                title="Batas Awal Absen Masuk (Menit)"
                style={{ fontSize: "0.85rem" }}
              >
                Batas Masuk (Menit)
              </label>
              <InputNumber
                id="check_in_limit_minutes"
                value={formik.values.check_in_limit_minutes}
                onValueChange={(e) =>
                  formik.setFieldValue("check_in_limit_minutes", e.value)
                }
                mode="decimal"
                showButtons
                min={1}
                placeholder="60"
                tooltip="Berapa menit SEBELUM jam masuk pegawai diizinkan absen."
                tooltipOptions={{ showDelay: 300, position: "top" }}
                className={classNames("w-full compact-input-number", {
                  "p-invalid": isFieldInvalid("check_in_limit_minutes"),
                })}
                inputClassName="text-center"
                style={{ width: "100%" }}
              />

              {/* Show Error Message */}
              {isFieldInvalid("check_in_limit_minutes") && (
                <small className="p-error text-xs">
                  {formik.errors.check_in_limit_minutes as string}
                </small>
              )}
            </div>
          </div>

          {/* 3. Check Out Limit */}
          <div className="field col-12 md:col-4 flex flex-column gap-2">
            <div className="flex flex-column gap-1" style={{ width: "100%" }}>
              <label
                htmlFor="check_out_limit_minutes"
                className="font-medium text-sm white-space-nowrap overflow-hidden text-overflow-ellipsis"
                title="Batas Akhir Absen Pulang (Menit)"
                style={{ fontSize: "0.85rem" }}
              >
                Batas Pulang (Menit)
              </label>
              <InputNumber
                id="check_out_limit_minutes"
                value={formik.values.check_out_limit_minutes}
                onValueChange={(e) =>
                  formik.setFieldValue("check_out_limit_minutes", e.value)
                }
                mode="decimal"
                showButtons
                // UPDATED: Min is now 1
                min={1}
                placeholder="60"
                tooltip="Berapa menit SETELAH jam pulang pegawai masih diizinkan absen."
                tooltipOptions={{ showDelay: 300, position: "top" }}
                className={classNames("w-full compact-input-number", {
                  "p-invalid": isFieldInvalid("check_out_limit_minutes"),
                })}
                inputClassName="text-center"
                style={{ width: "100%" }}
              />
              {/* Show Error Message */}
              {isFieldInvalid("check_out_limit_minutes") && (
                <small className="p-error text-xs">
                  {formik.errors.check_out_limit_minutes as string}
                </small>
              )}
            </div>
          </div>
        </div>

        {/* ROW 5: Work Days */}
        <div className="flex flex-column gap-2">
          <label htmlFor="work_days" className="font-medium">
            Hari Kerja <span className="text-red-500">*</span>
          </label>
          <MultiSelect
            id="work_days"
            value={formik.values.work_days}
            options={dayOptions}
            onChange={(e) => formik.setFieldValue("work_days", e.value)}
            optionLabel="label"
            placeholder="Pilih Hari Kerja"
            display="chip"
            className={classNames("w-full", {
              "p-invalid": isFieldInvalid("work_days"),
            })}
          />
          {isFieldInvalid("work_days") && (
            <small className="p-error">{formik.errors.work_days}</small>
          )}
        </div>
      </form>
    </Dialog>
  );
}
