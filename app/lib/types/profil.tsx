import React from "react";

export interface UserProfile {
  id: number;
  employee_code: string;
  user_code: string;
  position_code: string;
  office_code: string;
  office_name: string;
  full_name: string;
  ktp_number: string;
  birth_place: string;
  birth_date: string;
  gender: string;
  address: string;
  contact_phone: string;
  religion: string;
  maritial_status: string;
  join_date: string;
  resign_date: string | null;
  employment_status: string;
  education: string;
  blood_type: string;
  profile_picture: string | null;
  bpjs_ketenagakerjaan: string;
  bpjs_kesehatan: string;
  npwp: string;
  bank_account: string;
  created_at: string;
  updated_at: string;
  position_name: string;
  division_code: string;
  division_name: string;
  department_code: string;
  department_name: string;
  first_name: string;
  last_name: string;
  email?: string;
  profile_image_url?: string | null;
}

export interface OfficeInfo {
  label: string;
  severity: "success" | "info" | "warning" | "danger" | null | undefined;
  icon: string;
  detail: string;
}

// Helper component kecil untuk menampilkan baris data
export const InfoItem = ({
  icon,
  label,
  value,
  className = "",
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className={`col-12 md:col-6 mb-2 ${className}`}>
    <div className="flex align-items-center mb-2">
      <div className="w-2rem h-2rem flex align-items-center justify-content-center bg-blue-50 text-blue-600 border-round mr-2">
        <i className={`pi ${icon} text-sm`} />
      </div>
      <span className="text-500 text-sm font-medium">{label}</span>
    </div>
    <div className="pl-6">
      <span className="text-900 font-semibold text-lg">{value}</span>
    </div>
  </div>
);