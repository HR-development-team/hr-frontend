/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
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
import FormDropdown from "@components/FormDropdown";
import FormCalendar from "@components/FormCalendar";
import {
  Office,
  Department,
  Division,
  Position,
  EmploymentStatus,
} from "../schemas/optionTypes";
import { formatDateToYYYYMMDD, safeParseDate } from "@/utils/dateFormat";

// Option Interfaces
export interface SelectOption {
  label: string;
  value: string;
}

const employeeDefaultValues: EmployeeFormData = {
  full_name: "",
  join_date: new Date(),
  position_code: "",
  office_code: "",
  user_code: null,
  employment_status_code: "",

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

interface EmployeeSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  employeeData: any;
  onSubmit: (values: EmployeeFormData) => Promise<void>;
  isSubmitting: boolean;

  // CHANGED: We need full arrays for cascading logic
  offices: Office[];
  departments: Department[];
  divisions: Division[];
  positions: Position[];
  employmentStatus: EmploymentStatus[];
  userOptions: SelectOption[]; // This stays simple
}

export default function EmployeeSaveDialog({
  employeeData,
  onSubmit,
  isSubmitting,
  isOpen,
  onClose,
  title,
  offices = [],
  departments = [],
  divisions = [],
  positions = [],
  employmentStatus = [],
  userOptions = [],
}: EmployeeSaveDialogProps) {
  const [activeIndex, setActiveIndex] = useState(0); // For Wizard
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedDiv, setSelectedDiv] = useState<string | null>(null);

  const initialValues = useMemo(() => {
    if (employeeData) {
      return {
        ...employeeDefaultValues,
        ...employeeData,
        join_date: safeParseDate(employeeData.join_date) || new Date(),
        birth_date: safeParseDate(employeeData.birth_date),
        resign_date: safeParseDate(employeeData.resign_date),
      };
    }
    return employeeDefaultValues;
  }, [employeeData]);

  // 3. Setup Formik
  const formik = useFormik<EmployeeFormData>({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: null,
    validate: toFormikValidation(employeeFormSchema),
    onSubmit: async (values, { setStatus }) => {
      try {
        const payload = {
          ...values,
          join_date: formatDateToYYYYMMDD(values.join_date),
          birth_date: values.birth_date
            ? formatDateToYYYYMMDD(values.birth_date)
            : null,
          resign_date: values.resign_date
            ? formatDateToYYYYMMDD(values.resign_date)
            : null,
        };

        await onSubmit(payload as any);
      } catch (error: any) {
        setStatus(
          error?.message || "Terjadi kesalahan saat menyimpan data karyawan"
        );
      }
    },
  });

  const filteredDepartments = useMemo(() => {
    // Filter departments based on selected formik.values.office_code
    return departments
      .filter((d) => d.office_code === formik.values.office_code)
      .map((d) => ({
        label: d.name,
        value: d.department_code,
        code: d.department_code,
      }));
  }, [departments, formik.values.office_code]);

  const filteredDivisions = useMemo(() => {
    return divisions
      .filter((d) => d.department_code === selectedDept)
      .map((d) => ({
        label: d.name,
        value: d.division_code,
        code: d.division_code,
      }));
  }, [divisions, selectedDept]);

  const filteredPositions = useMemo(() => {
    return positions
      .filter((p) => p.division_code === selectedDiv)
      .map((p) => ({
        label: p.name,
        value: p.position_code,
        code: p.position_code,
      }));
  }, [positions, selectedDiv]);

  // 3. Office Options with Code Display logic
  const officeOptionsFormatted = useMemo(() => {
    return offices.map((o) => ({
      label: o.name,
      value: o.office_code,
      code: o.office_code, // Pass code for the template
    }));
  }, [offices]);

  // 4. Employment Status list
  const employmentStatusFormatted = useMemo(() => {
    return employmentStatus.map((emp) => ({
      label: emp.name,
      value: emp.status_code,
    }));
  }, [employmentStatus]);

  // Reset wizard on open/close
  useEffect(() => {
    if (isOpen) {
      // A. Reset Wizard & Form
      setActiveIndex(0);
      formik.resetForm();

      // B. Handle Edit Mode (Reverse Lookup)
      if (employeeData?.position_code) {
        // 1. Find Position -> Get Division
        const pos = positions.find(
          (p) => p.position_code === employeeData.position_code
        );

        if (pos) {
          // 2. Set Division (Local State)
          setSelectedDiv(pos.division_code);

          // 3. Find Division -> Get Department
          const div = divisions.find(
            (d) => d.division_code === pos.division_code
          );

          if (div) {
            // 4. Set Department (Local State)
            setSelectedDept(div.department_code);
            // Note: Office is already set via formik.initialValues.office_code
          }
        }
      } else {
        // C. Handle Add Mode (Reset Local States)
        setSelectedDept(null);
        setSelectedDiv(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, employeeData]);

  const handleHide = () => {
    formik.resetForm();
    setActiveIndex(0);
    onClose();
  };

  // --- WIZARD NAVIGATION LOGIC ---

  // Define which fields belong to which tab for validation
  const fieldsByTab = [
    // Tab 0: Job
    [
      "full_name",
      "office_code",
      "position_code",
      "join_date",
      "employment_status_code",
    ],
    // Tab 1: Personal
    [
      "birth_place",
      "birth_date",
      "gender",
      "maritial_status",
      "contact_phone",
      "address",
    ],
    // Tab 2: Docs (Optional mostly, so empty array is fine or specific required ones)
    ["ktp_number"],
  ];

  const handleNext = async () => {
    // 1. Mark fields in current tab as touched to trigger validation UI
    const currentFields = fieldsByTab[activeIndex];
    const touched: { [key: string]: boolean } = {};
    currentFields.forEach((field) => (touched[field] = true));
    await formik.setTouched({ ...formik.touched, ...touched });

    // 2. Check for errors in current tab
    const errors = await formik.validateForm();
    const hasErrorInTab = currentFields.some(
      (field) => errors[field as keyof EmployeeFormData]
    );

    if (!hasErrorInTab) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveIndex((prev) => prev - 1);
  };

  // Helpers
  const isFieldInvalid = (name: keyof EmployeeFormData) =>
    Boolean(formik.touched[name] && formik.errors[name]);

  const getFieldError = (name: keyof EmployeeFormData) =>
    isFieldInvalid(name) ? String(formik.errors[name]) : undefined;

  // Static Options
  const genderOptions = [
    { label: "Laki-laki", value: "laki-laki" },
    { label: "Perempuan", value: "perempuan" },
  ];
  const maritalOptions = [
    { label: "Menikah", value: "Married" },
    { label: "Belum Menikah", value: "Single" },
  ];

  const getProps = <K extends keyof EmployeeFormData>(name: K) => ({
    id: name,
    name: name,
    value: formik.values[name], // The type is now specific to the key 'K'
    onChange: formik.handleChange,
    touched: Boolean(formik.touched[name]),
    error: formik.errors[name] as string,
  });

  const dropdownItemTemplate = (option: any) => {
    if (!option) return null;
    return (
      <div className="flex align-items-center justify-content-between w-full gap-4">
        <span>{option.label}</span>
        <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 border-round">
          {option.code}
        </span>
      </div>
    );
  };

  return (
    <Dialog
      header={title}
      visible={isOpen}
      onHide={handleHide}
      modal
      className="w-full md:w-8 lg:w-6"
      contentClassName="p-0"
      footer={() => (
        <div className="flex justify-content-between align-items-center w-full p-3 border-top-1 border-gray-100">
          {/* Left Side: Cancel or Back */}
          <div>
            {activeIndex === 0 ? (
              <Button
                label="Batal"
                icon="pi pi-times"
                text
                onClick={handleHide}
                className="text-gray-600 gap-1"
              />
            ) : (
              <Button
                label="Kembali"
                icon="pi pi-arrow-left"
                className="gap-1"
                outlined
                onClick={handleBack}
              />
            )}
          </div>

          {/* Right Side: Next or Save */}
          <div className="flex gap-2">
            {/* Step Indicators (Optional visual cue) */}
            <div className="flex align-items-center gap-1 mr-4 text-gray-400 text-sm">
              <span>Langkah {activeIndex + 1} / 3</span>
            </div>

            {activeIndex < 2 ? (
              <Button
                label="Lanjut"
                icon="pi pi-arrow-right"
                iconPos="right"
                className="gap-1"
                onClick={handleNext}
              />
            ) : (
              <Button
                label="Simpan Data"
                icon="pi pi-check"
                severity="success"
                className="gap-1"
                onClick={() => formik.submitForm()}
                loading={isSubmitting}
              />
            )}
          </div>
        </div>
      )} // Use dynamic footer
    >
      <form onSubmit={formik.handleSubmit}>
        <TabView
          activeIndex={activeIndex}
          onTabChange={() => {}}
          className="p-0"
          renderActiveOnly={false}
          pt={{
            nav: { className: "pointer-events-none" },
          }}
        >
          {/* --- TAB 1: PEKERJAAN (Job) --- */}
          <TabPanel header="1. Pekerjaan" leftIcon="pi pi-briefcase mr-2">
            <div className="grid mt-2 px-3 pb-3">
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

              {/* LEVEL 1: OFFICE */}
              <div className="col-12 md:col-6">
                <FormDropdown
                  {...getProps("office_code")}
                  label="Kantor"
                  options={officeOptionsFormatted}
                  itemTemplate={dropdownItemTemplate} // Custom Template
                  onChange={(e) => {
                    formik.setFieldValue("office_code", e.value);
                    // Reset downstream
                    setSelectedDept("");
                    setSelectedDiv("");
                    formik.setFieldValue("position_code", "");
                  }}
                  placeholder="Pilih Kantor"
                  filter
                  isRequired
                />
              </div>

              {/* LEVEL 2: DEPARTMENT (Intermediate - Not saved to Formik directly, just state) */}
              <div className="col-12 md:col-6">
                <FormDropdown
                  id="department_temp"
                  label="Departemen"
                  value={selectedDept}
                  options={filteredDepartments}
                  itemTemplate={dropdownItemTemplate}
                  onChange={(e) => {
                    setSelectedDept(e.value);
                    // Reset downstream
                    setSelectedDiv("");
                    formik.setFieldValue("position_code", "");
                  }}
                  placeholder={
                    formik.values.office_code
                      ? "Pilih Departemen"
                      : "Pilih Kantor dahulu"
                  }
                  disabled={!formik.values.office_code}
                  filter
                  isRequired
                />
              </div>

              {/* LEVEL 3: DIVISION (Intermediate) */}
              <div className="col-12 md:col-6">
                <FormDropdown
                  id="division_temp"
                  label="Divisi"
                  value={selectedDiv}
                  itemTemplate={dropdownItemTemplate}
                  options={filteredDivisions}
                  onChange={(e) => {
                    setSelectedDiv(e.value);
                    // Reset downstream
                    formik.setFieldValue("position_code", "");
                  }}
                  placeholder={
                    selectedDept ? "Pilih Divisi" : "Pilih Departemen dahulu"
                  }
                  disabled={!selectedDept}
                  filter
                  isRequired
                />
              </div>

              {/* LEVEL 4: POSITION (Saved to Formik) */}
              <div className="col-12 md:col-6">
                <FormDropdown
                  {...getProps("position_code")}
                  label="Jabatan"
                  itemTemplate={dropdownItemTemplate}
                  options={filteredPositions}
                  onChange={(e) =>
                    formik.setFieldValue("position_code", e.value)
                  }
                  placeholder={
                    selectedDiv ? "Pilih Jabatan" : "Pilih Divisi dahulu"
                  }
                  disabled={!selectedDiv}
                  filter
                  isRequired
                />
              </div>

              {/* Join Date */}
              <div className="col-12 md:col-6">
                <FormCalendar
                  {...getProps("join_date")}
                  label="Tanggal Bergabung"
                  onChange={(e) => formik.setFieldValue("join_date", e.value)}
                  isRequired
                />
              </div>

              {/* Status */}
              <div className="col-12 md:col-6">
                <FormDropdown
                  {...getProps("employment_status_code")}
                  label="Status Karyawan"
                  options={employmentStatusFormatted}
                  onChange={(e) =>
                    formik.setFieldValue("employment_status_code", e.value)
                  }
                  isRequired
                />
              </div>

              {/* User Account */}
              <div className="col-12">
                <FormDropdown
                  {...getProps("user_code")}
                  label="Akun Pengguna (User)"
                  options={userOptions}
                  onChange={(e) => formik.setFieldValue("user_code", e.value)}
                  placeholder="Pilih Akun Pengguna"
                  filter
                  showClear
                  isRequired
                />
                <small className="text-gray-500">
                  Pilih jika karyawan ini memiliki akses login sistem.
                </small>
              </div>
            </div>
          </TabPanel>

          {/* --- TAB 2: PRIBADI (Personal) --- */}
          <TabPanel header="2. Data Pribadi" leftIcon="pi pi-user mr-2">
            <div className="grid mt-2 px-3 pb-3">
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
                <FormCalendar
                  {...getProps("birth_date")}
                  label="Tanggal Lahir"
                  onChange={(e) => formik.setFieldValue("birth_date", e.value)}
                  isRequired
                />
              </div>

              {/* Gender & Marital */}
              <div className="col-12 md:col-6 flex flex-column gap-2">
                <FormDropdown
                  {...getProps("gender")}
                  label="Jenis Kelamin"
                  options={genderOptions}
                  onChange={(e) => formik.setFieldValue("gender", e.value)}
                  placeholder="Pilih Jenis Kelamin"
                  filter
                  isRequired
                />
              </div>
              <div className="col-12 md:col-6 flex flex-column gap-2">
                <FormDropdown
                  {...getProps("maritial_status")}
                  label="Status Pernikahan"
                  options={maritalOptions}
                  onChange={(e) =>
                    formik.setFieldValue("maritial_status", e.value)
                  }
                  placeholder="Pilih Status Pernikahan"
                  filter
                  isRequired
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
          <TabPanel header="3. Dokumen" leftIcon="pi pi-file mr-2">
            <div className="grid mt-2 px-3 pb-3">
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
