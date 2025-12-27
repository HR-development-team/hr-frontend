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
import FormDropdown from "@components/FormDropdown";
import FormCalendar from "@components/FormCalendar";
import {
  EmployeeFormData,
  employeeUiSchema, // Use UI Schema for validation
  EmployeeFormValues, // Use UI Type for Formik state
} from "../schemas/employeeSchema";
import { toFormikValidation } from "@utils/formikHelpers";
import { formatDateToYYYYMMDD, safeParseDate } from "@/utils/dateFormat";
import { useFetchEmployee } from "../hooks/useFetchEmployee";

// Default Form Values (Matches UI Type)
const employeeDefaultValues: EmployeeFormValues = {
  // Job
  full_name: "",
  join_date: new Date(),
  office_code: "",
  // UI Fields (Required for validation, stripped before submit)
  department_code: "",
  division_code: "",
  position_code: "",

  employment_status_code: "",
  user_code: null,

  // Personal
  contact_phone: null,
  address: null,
  birth_place: null,
  birth_date: null,
  gender: null,
  religion: null,
  maritial_status: null,
  blood_type: null,

  // Docs
  ktp_number: null,
  education: null,
  resign_date: null,
  bpjs_ketenagakerjaan: null,
  bpjs_kesehatan: null,
  npwp: null,
  bank_account: null,
  profile_picture: null,
};

interface EmployeeSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  employeeData: any;
  onSubmit: (values: EmployeeFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function EmployeeSaveDialog({
  employeeData,
  onSubmit,
  isSubmitting,
  isOpen,
  onClose,
  title,
}: EmployeeSaveDialogProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. Hook for Cascading Options
  const {
    // Options
    officeOptions,
    departmentOptions,
    divisionOptions,
    positionOptions,
    userOptions,
    employementOptions,

    // Fetchers
    fetchOfficeOptions,
    fetchDepartmentOptions,
    fetchDivisionOptions,
    fetchPositionOptions,
    fetchEmployementOptions,
    fetchUserOptions,

    // Clearers
    clearDepartmentOptions,
    clearDivisionOptions,
    clearPositionOptions,

    // Loading States
    isOptionsDepartmentLoading,
    isOptionsDivisionLoading,
    isOptionsPositionLoading,
    isOptionsEmployementLoading,
    isOptionsUserLoading,
  } = useFetchEmployee();

  // 2. Initial Values
  const initialValues = useMemo(() => {
    if (employeeData) {
      return {
        ...employeeDefaultValues,
        ...employeeData,

        // Ensure Dates are Date Objects for Calendar
        join_date: safeParseDate(employeeData.join_date) || new Date(),
        birth_date: safeParseDate(employeeData.birth_date),
        resign_date: safeParseDate(employeeData.resign_date),

        // Ensure Dropdowns are Strings (not null) for Controlled Inputs
        department_code: employeeData.department_code || "",
        division_code: employeeData.division_code || "",
        position_code: employeeData.position_code || "",
        office_code: employeeData.office_code || "",
      };
    }
    return employeeDefaultValues;
  }, [employeeData]);

  // 3. Formik Setup
  const formik = useFormik<EmployeeFormValues>({
    initialValues: initialValues,
    enableReinitialize: true,
    // [CRITICAL] Use UI Schema so Dept/Div are required
    validate: toFormikValidation(employeeUiSchema),

    onSubmit: async (values, { setStatus }) => {
      try {
        // [CRITICAL] Separate UI fields from API fields
        const { department_code, division_code, ...apiPayload } = values;

        // Format Dates
        const formattedPayload = {
          ...apiPayload,
          join_date: formatDateToYYYYMMDD(apiPayload.join_date),
          birth_date: apiPayload.birth_date
            ? formatDateToYYYYMMDD(apiPayload.birth_date)
            : null,
          resign_date: apiPayload.resign_date
            ? formatDateToYYYYMMDD(apiPayload.resign_date)
            : null,
        };

        // Submit Clean Payload
        await onSubmit(formattedPayload as unknown as EmployeeFormData);
      } catch (error: any) {
        setStatus(error?.message || "Error saving data");
      }
    },
  });

  // 4. Handle Hydration (Edit Mode) & Reset
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
      formik.resetForm();

      // ✅ FETCH INDEPENDENT DATA
      // These lists are required regardless of Add or Edit mode
      fetchOfficeOptions();
      fetchEmployementOptions();
      fetchUserOptions();

      if (employeeData) {
        // EDIT MODE: Hydrate Options
        const { office_code, department_code, division_code } = employeeData;

        if (office_code) {
          fetchDepartmentOptions(office_code);
        }
        if (office_code && department_code) {
          fetchDivisionOptions(office_code, department_code);
        }
        if (office_code && department_code && division_code) {
          fetchPositionOptions(office_code, department_code, division_code);
        }
      } else {
        // ADD MODE: Clear Options
        clearDepartmentOptions();
        clearDivisionOptions();
        clearPositionOptions();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, employeeData]);

  const handleHide = () => {
    formik.resetForm();
    setActiveIndex(0);
    clearDepartmentOptions();
    clearDivisionOptions();
    clearPositionOptions();
    onClose();
  };

  // --- CASCADING HANDLERS ---

  const handleOfficeChange = (val: string) => {
    formik.setFieldValue("office_code", val);

    // Reset Children
    formik.setFieldValue("department_code", "");
    formik.setFieldValue("division_code", "");
    formik.setFieldValue("position_code", "");

    if (val) {
      fetchDepartmentOptions(val);
      clearDivisionOptions();
      clearPositionOptions();
    } else {
      clearDepartmentOptions();
      clearDivisionOptions();
      clearPositionOptions();
    }
  };

  const handleDepartmentChange = (val: string) => {
    formik.setFieldValue("department_code", val);

    // Reset Children
    formik.setFieldValue("division_code", "");
    formik.setFieldValue("position_code", "");

    const currentOffice = formik.values.office_code;

    if (val && currentOffice) {
      // ✅ Pass both Office and Department
      fetchDivisionOptions(currentOffice, val);
      clearPositionOptions();
    } else {
      clearDivisionOptions();
      clearPositionOptions();
    }
  };

  const handleDivisionChange = (val: string) => {
    formik.setFieldValue("division_code", val);

    // Reset Child
    formik.setFieldValue("position_code", "");

    const currentOffice = formik.values.office_code;
    const currentDept = formik.values.department_code;

    // ✅ FIX: Pass all 3 arguments (Office -> Dept -> Division)
    if (val && currentOffice && currentDept) {
      fetchPositionOptions(currentOffice, currentDept, val);
    } else {
      clearPositionOptions();
    }
  };

  // --- WIZARD NAVIGATION ---

  const fieldsByTab = [
    // Tab 1: Job
    [
      "full_name",
      "office_code",
      "department_code",
      "division_code",
      "position_code",
      "join_date",
      "employment_status_code",
    ],
    // Tab 2: Personal
    [
      "birth_place",
      "birth_date",
      "gender",
      "maritial_status",
      "contact_phone",
      "address",
    ],
    // Tab 3: Docs
    ["ktp_number"],
  ];

  const handleNext = async () => {
    const currentFields = fieldsByTab[activeIndex];
    const touched: { [key: string]: boolean } = {};
    currentFields.forEach((field) => (touched[field] = true));

    await formik.setTouched({ ...formik.touched, ...touched });
    const errors = await formik.validateForm();

    const hasErrorInTab = currentFields.some(
      (field) => errors[field as keyof EmployeeFormValues]
    );

    if (!hasErrorInTab) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveIndex((prev) => prev - 1);
  };

  // --- HELPERS ---

  const isFieldInvalid = (name: keyof EmployeeFormValues) =>
    Boolean(formik.touched[name] && formik.errors[name]);

  const getFieldError = (name: keyof EmployeeFormValues) =>
    isFieldInvalid(name) ? String(formik.errors[name]) : undefined;

  const getProps = (name: keyof EmployeeFormValues) => ({
    id: name,
    name: name,
    value: formik.values[name],
    onChange: formik.handleChange,
    touched: Boolean(formik.touched[name]),
    error: formik.errors[name] as string,
  });

  // Custom Dropdown Template
  const dropdownItemTemplate = (option: any) => {
    if (!option) return null;
    return (
      <div className="flex align-items-center justify-content-between w-full gap-4">
        <span>{option.label}</span>
      </div>
    );
  };

  // Static Options
  const genderOptions = [
    { label: "Laki-laki", value: "laki-laki" },
    { label: "Perempuan", value: "perempuan" },
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
      contentClassName="p-0"
      // Dynamic Footer
      footer={() => (
        <div className="flex justify-content-between align-items-center w-full p-3 border-top-1 border-gray-100">
          <div>
            {activeIndex === 0 ? (
              <Button
                label="Batal"
                icon="pi pi-times"
                text
                onClick={handleHide}
                className="text-gray-600 gap-1"
                disabled={isSubmitting}
              />
            ) : (
              <Button
                label="Kembali"
                icon="pi pi-arrow-left"
                className="gap-1"
                outlined
                onClick={handleBack}
                disabled={isSubmitting}
              />
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex align-items-center gap-1 mr-4 text-gray-400 text-sm hidden md:flex">
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
                disabled={isSubmitting}
              />
            )}
          </div>
        </div>
      )}
    >
      <form onSubmit={formik.handleSubmit}>
        <TabView
          activeIndex={activeIndex}
          onTabChange={() => {}} // Disable click navigation
          className="p-0"
          renderActiveOnly={false}
          pt={{
            nav: { className: "pointer-events-none" }, // Disable clicking tabs directly
          }}
        >
          {/* --- TAB 1: PEKERJAAN --- */}
          <TabPanel header="1. Pekerjaan" leftIcon="pi pi-briefcase mr-2">
            <div className="grid mt-2 px-3 pb-3">
              <div className="col-12">
                <FormInputText
                  props={formik.getFieldProps("full_name")}
                  fieldName="full_name"
                  label="Nama Lengkap"
                  isFieldInvalid={isFieldInvalid}
                  getFieldError={getFieldError}
                />
              </div>

              {/* Level 1: Office */}
              <div className="col-12 md:col-6">
                <FormDropdown
                  {...getProps("office_code")}
                  label="Kantor"
                  options={officeOptions}
                  onChange={(e) => handleOfficeChange(e.value)}
                  placeholder="Pilih Kantor"
                  filter
                  isRequired
                  itemTemplate={dropdownItemTemplate}
                />
              </div>

              {/* Level 2: Department */}
              <div className="col-12 md:col-6">
                <FormDropdown
                  {...getProps("department_code")}
                  label="Departemen"
                  options={departmentOptions}
                  onChange={(e) => handleDepartmentChange(e.value)}
                  disabled={
                    !formik.values.office_code || isOptionsDepartmentLoading
                  }
                  loading={isOptionsDepartmentLoading}
                  placeholder={
                    formik.values.office_code
                      ? "Pilih Departemen"
                      : "Pilih Kantor dahulu"
                  }
                  filter
                  isRequired
                  itemTemplate={dropdownItemTemplate}
                />
              </div>

              {/* Level 3: Division */}
              <div className="col-12 md:col-6">
                <FormDropdown
                  {...getProps("division_code")}
                  label="Divisi"
                  options={divisionOptions}
                  onChange={(e) => handleDivisionChange(e.value)}
                  disabled={
                    !formik.values.department_code || isOptionsDivisionLoading
                  }
                  loading={isOptionsDivisionLoading}
                  placeholder={
                    formik.values.department_code
                      ? "Pilih Divisi"
                      : "Pilih Departemen dahulu"
                  }
                  filter
                  isRequired
                  itemTemplate={dropdownItemTemplate}
                />
              </div>

              {/* Level 4: Position */}
              <div className="col-12 md:col-6">
                <FormDropdown
                  {...getProps("position_code")}
                  label="Jabatan"
                  options={positionOptions}
                  onChange={(e) =>
                    formik.setFieldValue("position_code", e.value)
                  }
                  disabled={
                    !formik.values.division_code || isOptionsPositionLoading
                  }
                  loading={isOptionsPositionLoading}
                  placeholder={
                    formik.values.division_code
                      ? "Pilih Jabatan"
                      : "Pilih Divisi dahulu"
                  }
                  filter
                  isRequired
                  itemTemplate={dropdownItemTemplate}
                />
              </div>

              <div className="col-12 md:col-6">
                <FormCalendar
                  id="join_date"
                  name="join_date"
                  label="Tanggal Bergabung"
                  // FIX: Access value directly so TS knows it is a Date
                  value={formik.values.join_date}
                  onChange={(e) => formik.setFieldValue("join_date", e.value)}
                  touched={Boolean(formik.touched.join_date)}
                  error={formik.errors.join_date as string}
                  isRequired
                />
              </div>

              <div className="col-12 md:col-6">
                <FormDropdown
                  {...getProps("employment_status_code")}
                  label="Status Karyawan"
                  options={employementOptions}
                  onChange={(e) =>
                    formik.setFieldValue("employment_status_code", e.value)
                  }
                  loading={isOptionsEmployementLoading}
                  isRequired
                />
              </div>

              <div className="col-12">
                <FormDropdown
                  {...getProps("user_code")}
                  label="Akun Pengguna (User)"
                  options={userOptions}
                  onChange={(e) => formik.setFieldValue("user_code", e.value)}
                  loading={isOptionsUserLoading}
                  placeholder="Pilih Akun Pengguna (Opsional)"
                  filter
                  showClear
                />
                <small className="text-gray-500">
                  Pilih jika karyawan ini memiliki akses login sistem.
                </small>
              </div>
            </div>
          </TabPanel>

          {/* --- TAB 2: PRIBADI --- */}
          <TabPanel header="2. Data Pribadi" leftIcon="pi pi-user mr-2">
            <div className="grid mt-2 px-3 pb-3">
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
                  id="birth_date"
                  name="birth_date"
                  label="Tanggal Lahir"
                  // FIX: Access value directly
                  value={formik.values.birth_date}
                  onChange={(e) => formik.setFieldValue("birth_date", e.value)}
                  touched={Boolean(formik.touched.birth_date)}
                  error={formik.errors.birth_date as string}
                  isRequired
                />
              </div>

              <div className="col-12 md:col-6 flex flex-column gap-2">
                <FormDropdown
                  {...getProps("gender")}
                  label="Jenis Kelamin"
                  options={genderOptions}
                  onChange={(e) => formik.setFieldValue("gender", e.value)}
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
                  isRequired
                />
              </div>

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

              <div className="col-12">
                <FormInputText
                  props={formik.getFieldProps("contact_phone")}
                  fieldName="contact_phone"
                  label="No. Telepon / WA"
                  isFieldInvalid={isFieldInvalid}
                  getFieldError={getFieldError}
                />
              </div>

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

          {/* --- TAB 3: DOKUMEN --- */}
          <TabPanel header="3. Dokumen" leftIcon="pi pi-file mr-2">
            <div className="grid mt-2 px-3 pb-3">
              <div className="col-12">
                <FormInputText
                  props={formik.getFieldProps("ktp_number")}
                  fieldName="ktp_number"
                  label="Nomor KTP (NIK)"
                  isFieldInvalid={isFieldInvalid}
                  getFieldError={getFieldError}
                />
              </div>

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

              <div className="col-12">
                <FormInputText
                  props={formik.getFieldProps("education")}
                  fieldName="education"
                  label="Pendidikan Terakhir"
                  isFieldInvalid={isFieldInvalid}
                  getFieldError={getFieldError}
                />
              </div>

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
