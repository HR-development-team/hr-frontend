/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { TabView, TabPanel } from "primereact/tabview";
import { classNames } from "primereact/utils";
import { useFormik } from "formik";

// Components & Utils
import FormInputText from "@components/FormInputText";
import {
  EmployeeFormData,
  employeeFormSchema,
} from "../schemas/employeeSchema";
import { toFormikValidation } from "@utils/formikHelpers";

// Option Interfaces
export interface SelectOption {
  label: string;
  value: string;
}

interface EmployeeSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  employeeData: any;
  onSubmit: (values: EmployeeFormData) => Promise<void>;
  isSubmitting: boolean;

  // Dropdown Options
  officeOptions: SelectOption[];
  positionOptions: SelectOption[];
  userOptions: SelectOption[];
}

const employeeDefaultValues: EmployeeFormData = {
  full_name: "",
  join_date: new Date(),
  position_code: "",
  office_code: "",
  user_code: null,
  employment_status: "aktif",

  contact_phone: null,
  address: null,
  ktp_number: null,
  birth_place: null,
  birth_date: null,
  gender: null,
  religion: null,
  maritial_status: null,
  resign_date: null,
  education: null,
  blood_type: null,
  profile_picture: null,
  bpjs_ketenagakerjaan: null,
  bpjs_kesehatan: null,
  npwp: null,
  bank_account: null,
};

export default function EmployeeSaveDialog({
  employeeData,
  onSubmit,
  isSubmitting,
  isOpen,
  onClose,
  title,
  officeOptions = [],
  positionOptions = [],
  userOptions = [],
}: EmployeeSaveDialogProps) {
  // 1. Memoize Initial Values
  const initialValues = useMemo(() => {
    if (employeeData) {
      // Data transformation is already handled in useDialogEmployee hook
      // We just pass it through, ensuring defaults if something slipped
      return { ...employeeDefaultValues, ...employeeData };
    }
    return employeeDefaultValues;
  }, [employeeData]);

  // 2. Setup Formik
  const formik = useFormik<EmployeeFormData>({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: null,
    validate: toFormikValidation(employeeFormSchema),
    onSubmit: async (values, { setStatus }) => {
      try {
        await onSubmit(values);
      } catch (error: any) {
        setStatus(
          error?.message || "Terjadi kesalahan saat menyimpan data karyawan"
        );
      }
    },
  });

  // Helpers
  const isFieldInvalid = (name: keyof EmployeeFormData) =>
    Boolean(formik.touched[name] && formik.errors[name]);

  const getFieldError = (name: keyof EmployeeFormData) =>
    isFieldInvalid(name) ? String(formik.errors[name]) : undefined;

  const handleHide = () => {
    formik.resetForm();
    onClose();
  };

  // Static Options
  const genderOptions = [
    { label: "Laki-laki", value: "laki-laki" },
    { label: "Perempuan", value: "perempuan" },
  ];

  const statusOptions = [
    { label: "Aktif", value: "aktif" },
    { label: "Inaktif", value: "inaktif" },
  ];

  const maritalOptions = [
    { label: "Menikah", value: "Married" },
    { label: "Belum Menikah", value: "Single" },
  ];

  return (
    <Dialog
      header={title}
      visible={isOpen}
      onHide={handleHide}
      modal
      className="w-full md:w-8 lg:w-6"
      contentClassName="p-0" // Remove padding to let TabView fit nicely
      footer={
        <div className="flex justify-content-end gap-2 p-3 border-top-1 border-gray-100">
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
      <form onSubmit={formik.handleSubmit}>
        <TabView className="p-0">
          {/* --- TAB 1: PEKERJAAN (Job) --- */}
          <TabPanel header="Pekerjaan" leftIcon="pi pi-briefcase mr-2">
            <div className="grid mt-2">
              {/* Full Name */}
              <div className="col-12">
                <FormInputText
                  props={formik.getFieldProps("full_name")}
                  fieldName="full_name"
                  label="Nama Lengkap"
                  isFieldInvalid={isFieldInvalid}
                  getFieldError={getFieldError}
                />
              </div>

              {/* Office */}
              <div className="col-12 md:col-6 flex flex-column gap-2">
                <label htmlFor="office_code" className="font-medium">
                  Kantor <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  id="office_code"
                  value={formik.values.office_code}
                  options={officeOptions}
                  onChange={(e) => formik.setFieldValue("office_code", e.value)}
                  placeholder="Pilih Kantor"
                  className={classNames({
                    "p-invalid": isFieldInvalid("office_code"),
                  })}
                  filter
                  showClear
                />
                {isFieldInvalid("office_code") && (
                  <small className="p-error">
                    {getFieldError("office_code")}
                  </small>
                )}
              </div>

              {/* Position */}
              <div className="col-12 md:col-6 flex flex-column gap-2">
                <label htmlFor="position_code" className="font-medium">
                  Jabatan <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  id="position_code"
                  value={formik.values.position_code}
                  options={positionOptions}
                  onChange={(e) =>
                    formik.setFieldValue("position_code", e.value)
                  }
                  placeholder="Pilih Jabatan"
                  className={classNames({
                    "p-invalid": isFieldInvalid("position_code"),
                  })}
                  filter
                  showClear
                />
                {isFieldInvalid("position_code") && (
                  <small className="p-error">
                    {getFieldError("position_code")}
                  </small>
                )}
              </div>

              {/* Join Date */}
              <div className="col-12 md:col-6 flex flex-column gap-2">
                <label htmlFor="join_date" className="font-medium">
                  Tanggal Bergabung <span className="text-red-500">*</span>
                </label>
                <Calendar
                  id="join_date"
                  value={formik.values.join_date}
                  onChange={(e) => formik.setFieldValue("join_date", e.value)}
                  showIcon
                  dateFormat="dd/mm/yy"
                  className={classNames({
                    "p-invalid": isFieldInvalid("join_date"),
                  })}
                />
                {isFieldInvalid("join_date") && (
                  <small className="p-error">
                    {getFieldError("join_date")}
                  </small>
                )}
              </div>

              {/* Status */}
              <div className="col-12 md:col-6 flex flex-column gap-2">
                <label htmlFor="employment_status" className="font-medium">
                  Status Karyawan <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  id="employment_status"
                  value={formik.values.employment_status}
                  options={statusOptions}
                  onChange={(e) =>
                    formik.setFieldValue("employment_status", e.value)
                  }
                />
              </div>

              {/* User Account */}
              <div className="col-12 flex flex-column gap-2">
                <label htmlFor="user_code" className="font-medium">
                  Akun User (Opsional)
                </label>
                <Dropdown
                  id="user_code"
                  value={formik.values.user_code}
                  options={userOptions}
                  onChange={(e) => formik.setFieldValue("user_code", e.value)}
                  placeholder="Hubungkan dengan akun user..."
                  filter
                  showClear
                />
                <small className="text-gray-500">
                  Pilih jika karyawan ini memiliki akses login sistem.
                </small>
              </div>
            </div>
          </TabPanel>

          {/* --- TAB 2: PRIBADI (Personal) --- */}
          <TabPanel header="Data Pribadi" leftIcon="pi pi-user mr-2">
            <div className="grid mt-2">
              {/* Birth Place & Date */}
              <div className="col-12 md:col-6">
                <FormInputText
                  props={formik.getFieldProps("birth_place")}
                  fieldName="birth_place"
                  label="Tempat Lahir"
                  isFieldInvalid={isFieldInvalid}
                  getFieldError={getFieldError}
                />
              </div>
              <div className="col-12 md:col-6 flex flex-column gap-2">
                <label htmlFor="birth_date" className="font-medium">
                  Tanggal Lahir
                </label>
                <Calendar
                  id="birth_date"
                  value={formik.values.birth_date}
                  onChange={(e) => formik.setFieldValue("birth_date", e.value)}
                  showIcon
                  dateFormat="dd/mm/yy"
                  yearNavigator
                  yearRange="1950:2010"
                />
              </div>

              {/* Gender & Marital */}
              <div className="col-12 md:col-6 flex flex-column gap-2">
                <label htmlFor="gender" className="font-medium">
                  Jenis Kelamin
                </label>
                <Dropdown
                  id="gender"
                  value={formik.values.gender}
                  options={genderOptions}
                  onChange={(e) => formik.setFieldValue("gender", e.value)}
                  placeholder="Pilih"
                  showClear
                />
              </div>
              <div className="col-12 md:col-6 flex flex-column gap-2">
                <label htmlFor="maritial_status" className="font-medium">
                  Status Pernikahan
                </label>
                <Dropdown
                  id="maritial_status"
                  value={formik.values.maritial_status}
                  options={maritalOptions}
                  onChange={(e) =>
                    formik.setFieldValue("maritial_status", e.value)
                  }
                  placeholder="Pilih"
                  showClear
                />
              </div>

              {/* Religion & Blood Type */}
              <div className="col-12 md:col-6">
                <FormInputText
                  props={formik.getFieldProps("religion")}
                  fieldName="religion"
                  label="Agama"
                  isFieldInvalid={isFieldInvalid}
                  getFieldError={getFieldError}
                />
              </div>
              <div className="col-12 md:col-6">
                <FormInputText
                  props={formik.getFieldProps("blood_type")}
                  fieldName="blood_type"
                  label="Golongan Darah"
                  isFieldInvalid={isFieldInvalid}
                  getFieldError={getFieldError}
                />
              </div>

              {/* Phone */}
              <div className="col-12">
                <FormInputText
                  props={formik.getFieldProps("contact_phone")}
                  fieldName="contact_phone"
                  label="No. Telepon / WA"
                  isFieldInvalid={isFieldInvalid}
                  getFieldError={getFieldError}
                />
              </div>

              {/* Address */}
              <div className="col-12 flex flex-column gap-2">
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
                />
              </div>
            </div>
          </TabPanel>

          {/* --- TAB 3: DOKUMEN & LAINNYA (Docs) --- */}
          <TabPanel header="Dokumen & Lainnya" leftIcon="pi pi-file mr-2">
            <div className="grid mt-2">
              {/* KTP */}
              <div className="col-12">
                <FormInputText
                  props={formik.getFieldProps("ktp_number")}
                  fieldName="ktp_number"
                  label="Nomor KTP (NIK)"
                  isFieldInvalid={isFieldInvalid}
                  getFieldError={getFieldError}
                />
              </div>

              {/* BPJS */}
              <div className="col-12 md:col-6">
                <FormInputText
                  props={formik.getFieldProps("bpjs_ketenagakerjaan")}
                  fieldName="bpjs_ketenagakerjaan"
                  label="BPJS Ketenagakerjaan"
                  isFieldInvalid={isFieldInvalid}
                  getFieldError={getFieldError}
                />
              </div>
              <div className="col-12 md:col-6">
                <FormInputText
                  props={formik.getFieldProps("bpjs_kesehatan")}
                  fieldName="bpjs_kesehatan"
                  label="BPJS Kesehatan"
                  isFieldInvalid={isFieldInvalid}
                  getFieldError={getFieldError}
                />
              </div>

              {/* NPWP & Bank */}
              <div className="col-12 md:col-6">
                <FormInputText
                  props={formik.getFieldProps("npwp")}
                  fieldName="npwp"
                  label="NPWP"
                  isFieldInvalid={isFieldInvalid}
                  getFieldError={getFieldError}
                />
              </div>
              <div className="col-12 md:col-6">
                <FormInputText
                  props={formik.getFieldProps("bank_account")}
                  fieldName="bank_account"
                  label="No. Rekening & Bank"
                  isFieldInvalid={isFieldInvalid}
                  getFieldError={getFieldError}
                />
              </div>

              {/* Education */}
              <div className="col-12">
                <FormInputText
                  props={formik.getFieldProps("education")}
                  fieldName="education"
                  label="Pendidikan Terakhir"
                  isFieldInvalid={isFieldInvalid}
                  getFieldError={getFieldError}
                />
              </div>

              {/* Resign Date */}
              <div className="col-12 md:col-6 flex flex-column gap-2 mt-2">
                <label
                  htmlFor="resign_date"
                  className="font-medium text-gray-500"
                >
                  Tanggal Resign
                </label>
                <Calendar
                  id="resign_date"
                  value={formik.values.resign_date}
                  onChange={(e) => formik.setFieldValue("resign_date", e.value)}
                  showIcon
                  dateFormat="dd/mm/yy"
                  showButtonBar
                />
                <small className="text-gray-500">
                  Isi hanya jika karyawan sudah tidak aktif.
                </small>
              </div>
            </div>
          </TabPanel>
        </TabView>

        {/* Global Error Message */}
        {formik.status && (
          <div className="p-3 bg-red-50 text-red-500 border-round text-sm text-right mx-3 mb-2">
            <i className="pi pi-exclamation-circle mr-2"></i>
            {formik.status}
          </div>
        )}
      </form>
    </Dialog>
  );
}
