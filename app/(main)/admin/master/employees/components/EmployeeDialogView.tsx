import { formatDateIDN } from "@/lib/utils/dateFormat";
import { Briefcase, IdCard, Phone, User } from "lucide-react";
import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import React from "react";
import EmployeeDialogViewSkeleton from "./EmployeeDialogViewSkeleton";
import { ViewMasterPropsTypes } from "@/lib/types/view/viewMasterPropsTypes";
import { GetEmployeeByIdData } from "@/lib/types/employee";
import { controllers } from "chart.js";
import { strict } from "assert";
import { string } from "zod";
import { stat } from "fs";

export default function EmployeeDialogView({
  data,
  isLoading,
  dialogMode,
}: ViewMasterPropsTypes<GetEmployeeByIdData>) {
  const isOnViewMode = dialogMode === "view" ? true : false;

  const statusBodyTemplate = (rowData: GetEmployeeByIdData | null) => {
    if (!rowData || !rowData.employment_status) {
      return <Tag value={"-"} severity={"secondary"} />;
    }

    const status = rowData.employment_status;
    let displayValue = "-";

    const severity = status === "aktif" ? "success" : "danger";

    if (status && status.length > 0) {
      const firstCharUppercase = status.charAt(0).toUpperCase();

      const restOfString = status.slice(1);
      displayValue = firstCharUppercase + restOfString;
    }

    return <Tag value={displayValue} severity={severity} />;
  };

  if (isLoading) {
    return <EmployeeDialogViewSkeleton />;
  }

  return (
    <div className={`${isOnViewMode ? "text-800" : "hidden"}`}>
      <div className="grid">
        {/* employee profile and name */}
        <div className="col-12 md:col-4 text-800 mt-2">
          <Card className="text-center line-height-3">
            <Avatar className="w-10rem h-10rem bg-blue-500 text-white text-4xl font-semibold">
              <span>{data?.full_name.charAt(0).toUpperCase()}</span>
            </Avatar>
            <div>
              <p className="text-xl font-bold">{data?.full_name}</p>
              <p className="font-mono text-600 text-md">
                {data?.employee_code}
              </p>
            </div>
          </Card>

          <Card className="line-height-4 mt-2">
            <div className="flex align-items-center gap-2 mb-4">
              <Briefcase className="text-blue-500" />
              <span className="text-800 font-medium">Status Pekerjaan</span>
            </div>

            <div className="flex align-items-start justify-content-between">
              <span>Kantor</span>
              <div className="line-height-3">
                <p>{data?.office_name}</p>
                <p className="text-sm font-mono font-light text-right">
                  {data?.office_code}
                </p>
              </div>
            </div>

            <div className="flex align-items-start justify-content-between">
              <span>Departemen</span>
              <div className="line-height-3">
                <p>{data?.department_name}</p>
                <p className="text-sm font-mono font-light text-right">
                  {data?.department_code}
                </p>
              </div>
            </div>

            <div className="flex align-items-start justify-content-between">
              <span>Divisi</span>
              <div className="line-height-3">
                <p>{data?.division_name} </p>
                <p className="text-sm font-mono font-light text-right">
                  {data?.division_code}
                </p>
              </div>
            </div>

            <div className="flex align-items-start justify-content-between">
              <span>Posisi/Jabatan</span>
              <div className="line-height-3">
                <p>{data?.position_name} </p>
                <p className="text-sm font-mono font-light text-right">
                  {data?.position_code}
                </p>
              </div>
            </div>

            <div className="flex align-items-center justify-content-between">
              <span>Status</span>
              {statusBodyTemplate(data)}
            </div>

            <div className="flex align-items-center justify-content-between">
              <span>Tanggal Gabung</span>
              <p>{formatDateIDN(data?.join_date)}</p>
            </div>

            <div className="flex align-items-center justify-content-between">
              <span>Tanggal Resign</span>
              <p>{formatDateIDN(data?.resign_date)}</p>
            </div>
          </Card>
        </div>

        {/* separator */}
        <div className="col-0 md:col-0" />

        {/* employee identity */}
        <Card className="col-12 md:col-8 mt-2">
          <div className="flex align-items-center gap-2 mb-4">
            <User className="text-blue-500" />
            <span className="text-base font-medium">Informasi Pribadi</span>
          </div>

          <div className="grid line-height-3">
            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">
                Nama Lengkap
              </span>
              <p className="text-800 text-base font-medium">
                {data?.full_name}
              </p>
            </div>

            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">
                Jenis Kelamin
              </span>
              <p className="text-800 text-base font-medium">
                {data?.gender === "laki-laki"
                  ? "Laki-laki"
                  : data?.gender === "perempuan"
                    ? "Perempuan"
                    : "-"}
              </p>
            </div>

            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">
                Tempat Lahir
              </span>
              <p className="text-800 text-base font-medium">
                {data?.birth_place ? data.birth_place : "-"}
              </p>
            </div>

            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">
                Tanggal Lahir
              </span>
              <p className="text-800 text-base font-medium">
                {formatDateIDN(data?.birth_date)}
              </p>
            </div>

            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">
                Golongan Darah
              </span>
              <p className="text-800 text-base font-medium">
                {data?.blood_type ? data.blood_type : "-"}
              </p>
            </div>

            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">Agama</span>
              <p className="text-800 text-base font-medium">
                {data?.religion ? data.religion : "-"}
              </p>
            </div>

            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">
                Status Pernikahan
              </span>
              <p className="text-800 text-base font-medium">
                {data?.maritial_status ? data.maritial_status : "-"}
              </p>
            </div>

            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">Pendidikan</span>
              <p className="text-800 text-base font-medium">
                {data?.education ? data.education : "-"}
              </p>
            </div>

            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">Alamat</span>
              <p className="text-800 text-base font-medium">
                {data?.address ? data.address : "-"}
              </p>
            </div>
          </div>

          <hr className="border-1 border-400" />
          <div className="flex align-items-center gap-2 mt-2 mb-4">
            <Phone className="text-blue-500" />

            <span className="font-medium text-800 my-2">Kontak</span>
          </div>
          <div className="grid line-height-3">
            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">Email</span>
              <p className="text-800 text-base font-medium">Email karyawan</p>
            </div>

            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">
                No. Telepon
              </span>
              <p className="text-800 text-base font-medium">
                {data?.contact_phone ? data.contact_phone : "-"}
              </p>
            </div>
          </div>

          <hr className="border-1 border-400" />
          <div className="flex align-items-center gap-2 mt-2 mb-4">
            <IdCard className="text-blue-500" />
            <span className="font-medium text-800 my-2">No. Kependudukan</span>
          </div>
          <div className="grid line-height-3">
            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">No. KTP</span>
              <p className="text-800 text-base font-medium">
                {data?.ktp_number ? data.ktp_number : "-"}
              </p>
            </div>

            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">No. NPWP</span>
              <p className="text-800 text-base font-medium">
                {data?.npwp ? data.npwp : "-"}
              </p>
            </div>

            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">
                No. BPJS Ketenagakerjaan
              </span>
              <p className="text-800 text-base font-medium">
                {data?.bpjs_ketenagakerjaan ? data.bpjs_ketenagakerjaan : "-"}
              </p>
            </div>

            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">
                No. BPJS Kesehatan
              </span>
              <p className="text-800 text-base font-medium">
                {data?.bpjs_kesehatan ? data.bpjs_kesehatan : "-"}
              </p>
            </div>

            <div className="col-12 md:col-6">
              <span className="text-500 text-base font-medium">
                No. Rekening Bank
              </span>
              <p className="text-800 text-base font-medium">
                {data?.bank_account ? data.bank_account : "-"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
