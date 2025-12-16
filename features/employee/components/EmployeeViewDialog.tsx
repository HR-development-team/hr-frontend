/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  Briefcase,
  Building,
  Calendar,
  CreditCard,
  FileText,
  MapPin,
  Phone,
  QrCode,
  User,
} from "lucide-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { EmployeeDetail } from "../schemas/employeeSchema";
import EmployeeViewDialogSkeleton from "./EmployeeViewDialogSkeleton";

// Helper for date formatting
const formatDateIDN = (dateString?: string | null) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

interface EmployeeViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeDetail | null;
  isLoading: boolean;
}

export default function EmployeeViewDialog({
  isOpen,
  onClose,
  employee,
  isLoading,
}: EmployeeViewDialogProps) {
  // Reusable Info Item Component
  const InfoItem = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value?: string | null;
    icon?: any;
  }) => (
    <div className="mb-3">
      <div className="flex align-items-center gap-2 text-500 mb-1">
        {Icon && <Icon size={14} />}
        <span className="text-xs font-semibold uppercase">{label}</span>
      </div>
      <p className="m-0 font-medium text-gray-800 text-sm line-height-3">
        {value || "-"}
      </p>
    </div>
  );

  return (
    <Dialog
      header="Detail Data Karyawan"
      visible={isOpen}
      onHide={onClose}
      modal
      className="w-full md:w-9 lg:w-7"
      contentClassName="pb-4"
      footer={
        <div className="flex justify-content-end">
          <Button
            className="flex gap-1"
            label="Tutup"
            icon="pi pi-times"
            text
            onClick={onClose}
          />
        </div>
      }
    >
      {isLoading ? (
        <EmployeeViewDialogSkeleton />
      ) : employee ? (
        <div className="flex flex-column gap-5 mt-2">
          {/* --- HEADER: Profile Overview --- */}
          <div className="bg-blue-50 p-4 border-round-xl border-1 border-blue-100 flex flex-column md:flex-row gap-4 align-items-center md:align-items-start">
            {/* Avatar / Initials */}
            <div className="flex-shrink-0">
              <div className="w-6rem h-6rem bg-white border-circle flex align-items-center justify-content-center border-1 border-blue-200 shadow-1 overflow-hidden">
                {employee.profile_picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={employee.profile_picture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="text-blue-300" size={48} />
                )}
              </div>
            </div>

            <div className="flex-grow-1 text-center md:text-left w-full">
              <div className="flex flex-column md:flex-row justify-content-between align-items-center md:align-items-start gap-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 m-0 mb-1">
                    {employee.full_name}
                  </h2>
                  <div className="flex align-items-center justify-content-center md:justify-content-start gap-2 text-blue-600 mb-2">
                    <Briefcase size={14} />
                    <span className="text-sm font-medium">
                      {employee.position_name || "Posisi tidak diketahui"}
                    </span>
                  </div>
                </div>

                <Tag
                  value={employee.employment_status?.toUpperCase()}
                  severity={
                    employee.employment_status === "aktif"
                      ? "success"
                      : "danger"
                  }
                  className="px-3"
                />
              </div>

              <div className="flex flex-wrap justify-content-center md:justify-content-start gap-2 mt-3">
                <div className="bg-white px-3 py-1 border-round-md border-1 border-blue-100 flex align-items-center gap-2 text-sm text-gray-600 shadow-sm">
                  <QrCode size={14} className="text-blue-500" />
                  <span className="font-mono">
                    {employee.employee_code || "-"}
                  </span>
                </div>
                <div className="bg-white px-3 py-1 border-round-md border-1 border-blue-100 flex align-items-center gap-2 text-sm text-gray-600 shadow-sm">
                  <Building size={14} className="text-blue-500" />
                  <span>{employee.office_name || "-"}</span>
                </div>
                <div className="bg-white px-3 py-1 border-round-md border-1 border-blue-100 flex align-items-center gap-2 text-sm text-gray-600 shadow-sm">
                  <Calendar size={14} className="text-blue-500" />
                  <span>Bergabung: {formatDateIDN(employee.join_date)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid">
            {/* --- COLUMN 1: Personal & Contact --- */}
            <div className="col-12 lg:col-6 flex flex-column gap-4">
              {/* Data Pribadi */}
              <div className="border-1 border-gray-200 border-round-xl p-3">
                <div className="flex align-items-center gap-2 mb-3 pb-2 border-bottom-1 border-gray-100 text-gray-800">
                  <User size={18} className="text-blue-600" />
                  <span className="font-bold">Data Pribadi</span>
                </div>
                <div className="grid">
                  <div className="col-6">
                    <InfoItem
                      label="Tempat Lahir"
                      value={employee.birth_place}
                    />
                  </div>
                  <div className="col-6">
                    <InfoItem
                      label="Tanggal Lahir"
                      value={formatDateIDN(employee.birth_date)}
                    />
                  </div>
                  <div className="col-6">
                    <InfoItem label="Jenis Kelamin" value={employee.gender} />
                  </div>
                  <div className="col-6">
                    <InfoItem label="Agama" value={employee.religion} />
                  </div>
                  <div className="col-6">
                    <InfoItem
                      label="Status Nikah"
                      value={employee.maritial_status}
                    />
                  </div>
                  <div className="col-6">
                    <InfoItem label="Gol. Darah" value={employee.blood_type} />
                  </div>
                  <div className="col-12">
                    <InfoItem label="Pendidikan" value={employee.education} />
                  </div>
                </div>
              </div>

              {/* Kontak */}
              <div className="border-1 border-gray-200 border-round-xl p-3">
                <div className="flex align-items-center gap-2 mb-3 pb-2 border-bottom-1 border-gray-100 text-gray-800">
                  <Phone size={18} className="text-green-600" />
                  <span className="font-bold">Kontak & Alamat</span>
                </div>
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <InfoItem
                      label="No. Telepon"
                      value={employee.contact_phone}
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <InfoItem label="Email User" value={employee.email} />
                  </div>
                  <div className="col-12">
                    <div className="mb-2">
                      <div className="flex align-items-center gap-2 text-500 mb-1">
                        <MapPin size={14} />
                        <span className="text-xs font-semibold uppercase">
                          Alamat Lengkap
                        </span>
                      </div>
                      <p className="m-0 font-medium text-gray-800 text-sm line-height-3 bg-gray-50 p-2 border-round">
                        {employee.address || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- COLUMN 2: Docs & Legal --- */}
            <div className="col-12 lg:col-6 flex flex-column gap-4">
              {/* Identitas Legal */}
              <div className="border-1 border-gray-200 border-round-xl p-3">
                <div className="flex align-items-center gap-2 mb-3 pb-2 border-bottom-1 border-gray-100 text-gray-800">
                  <FileText size={18} className="text-purple-600" />
                  <span className="font-bold">Identitas & Legalitas</span>
                </div>
                <div className="grid">
                  <div className="col-12">
                    <InfoItem
                      label="Nomor KTP (NIK)"
                      value={employee.ktp_number}
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <InfoItem
                      label="BPJS Ketenagakerjaan"
                      value={employee.bpjs_ketenagakerjaan}
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <InfoItem
                      label="BPJS Kesehatan"
                      value={employee.bpjs_kesehatan}
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <InfoItem label="NPWP" value={employee.npwp} />
                  </div>
                </div>
              </div>

              {/* Keuangan */}
              <div className="border-1 border-gray-200 border-round-xl p-3">
                <div className="flex align-items-center gap-2 mb-3 pb-2 border-bottom-1 border-gray-100 text-gray-800">
                  <CreditCard size={18} className="text-orange-600" />
                  <span className="font-bold">Data Keuangan</span>
                </div>
                <div className="grid">
                  <div className="col-12">
                    <InfoItem
                      label="Rekening Bank"
                      value={employee.bank_account}
                    />
                  </div>
                </div>
              </div>

              {/* System Info */}
              <div className="bg-gray-50 border-1 border-gray-200 border-round-xl p-3 mt-auto">
                <div className="flex justify-content-between gap-3 text-xs text-gray-500">
                  <div className="flex align-items-center gap-2">
                    <span>Dibuat:</span>
                    <span className="font-medium text-gray-700">
                      {formatDateIDN(employee.created_at)}
                    </span>
                  </div>
                  <div className="flex align-items-center gap-2">
                    <span>Update:</span>
                    <span className="font-medium text-gray-700">
                      {formatDateIDN(employee.updated_at)}
                    </span>
                  </div>
                </div>
                {employee.resign_date && (
                  <div className="mt-2 pt-2 border-top-1 border-gray-200 text-red-600 text-xs font-bold">
                    Resign Tanggal: {formatDateIDN(employee.resign_date)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 text-gray-500">
          Data karyawan tidak ditemukan.
        </div>
      )}
    </Dialog>
  );
}
