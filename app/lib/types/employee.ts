export interface GetAllEmployeeData {
  id: number;
  employee_code: string;
  full_name: string;
  join_date: string;
  position_code: string;
  employment_status: "aktif" | "inaktif";
  position_name: string;
  division_code: string;
  division_name: string;
  department_code: string;
  department_name: string;
}

export interface GetEmployeeByIdData extends GetAllEmployeeData {
  user_code: string;
  ktp_number: string | null;
  birth_place: string | null;
  birth_date: string | null;
  gender: "laki-laki" | "perempuan" | null;
  address: string | null;
  contact_phone: string | null;
  religion: string | null;
  maritial_status: "Single" | "Married" | null;
  resign_date: string | null;
  education: string | null;
  blood_type: string | null;
  profile_picture: string | null;
  bpjs_ketenagakerjaan: string | null;
  bpjs_kesehatan: string | null;
  npwp: string | null;
  bank_account: string | null;
  created_at: string;
  updated_at: string;
}
