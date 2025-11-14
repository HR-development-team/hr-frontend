import { EmployeeFormData } from "../schemas/employeeFormSchema";

export const statusOptions = [
  {
    label: "Aktif",
    value: "aktif",
  },
  {
    label: "Inaktif",
    value: "inaktif",
  },
];

export const genderOptions = [
  {
    label: "Laki-laki",
    value: "laki-laki",
  },
  {
    label: "Perempuan",
    value: "perempuan",
  },
];

export const marriedOptions = [
  {
    label: "Menikah",
    value: "Married",
  },
  {
    label: "Belum Menikah",
    value: "Single",
  },
];

export const employeeFormDefaultValues: EmployeeFormData = {
  full_name: "",
  join_date: null as any,
  position_code: "",
  employment_status: "aktif",

  contact_phone: null,
  address: null,
  birth_place: null,
  birth_date: null as any,
  gender: null,
  religion: null,
  maritial_status: null,
  resign_date: null as any,
  education: null,
  blood_type: null,
  profile_picture: null,
  bpjs_ketenagakerjaan: null,
  bpjs_kesehatan: null,
  npwp: null,
  bank_account: null,
};
