"use client";

import {
  Banknote,
  Building,
  Building2,
  Calendar,
  FileText,
  Layers,
  MapPin,
  QrCode,
  User,
  UserCheck,
} from "lucide-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { PositionDetail } from "../schemas/positionSchema";
import { formatDateIDN } from "@/utils/dateFormat";
import { formatRupiah } from "@/utils/currencyFormat";
import PositionViewDialogSkeleton from "./PositionViewDialogSkeleton";
<<<<<<< HEAD
import { Tag } from "primereact/tag";
=======
import { formatDateIDN } from "@/utils/dateFormat";
import { formatRupiah } from "@/utils/currencyFormat";
>>>>>>> 8012968 (feat: implement dynamic sidebar based on feature that user have)

interface PositionViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  position: PositionDetail | null;
  isLoading: boolean;
}

export default function PositionViewDialog({
  isOpen,
  onClose,
  position,
  isLoading,
}: PositionViewDialogProps) {
  return (
    <Dialog
      header="Detail Data Posisi"
      visible={isOpen}
      onHide={onClose}
      modal
      className="w-full md:w-7 lg:w-6 xl:w-5" // Slightly wider for better spacing
      contentClassName="p-0" // Remove default padding for custom layout
      headerClassName="border-bottom-1 border-gray-100 pb-2"
      footer={
        <div className="flex justify-content-end pt-2 border-top-1 border-gray-100">
          <Button
            className="flex gap-1"
            label="Tutup"
            icon="pi pi-times"
            text
            severity="secondary"
            onClick={onClose}
          />
        </div>
      }
    >
      {isLoading ? (
        <PositionViewDialogSkeleton />
      ) : position ? (
        <div className="flex flex-column">
          {/* --- 1. Hero / Header Section --- */}
          <div className="relative bg-blue-50 p-4 pt-5 pb-5">
            <div className="flex flex-column md:flex-row gap-4 align-items-center md:align-items-start text-center md:text-left z-1 relative">
              {/* Icon Container */}
              <div className="w-5rem h-5rem bg-white border-round-2xl shadow-2 flex align-items-center justify-content-center flex-shrink-0 text-blue-600">
                <UserCheck size={36} strokeWidth={1.5} />
              </div>

              {/* Title & Badge */}
              <div className="flex-1">
                <div className="flex flex-column md:flex-row align-items-center md:align-items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 border-round-md uppercase tracking-wide">
                    JABATAN / POSISI
                  </span>
                  {/* Status Badge (Example logic, adjust if you have status field) */}
                  <Tag
                    value="Active"
                    severity="success"
                    className="text-xs px-2"
                    rounded
                  />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 m-0 mb-2 line-height-2">
                  {position.name || "Jabatan Tanpa Nama"}
                </h2>

                {/* Code Badge */}
                <div className="flex align-items-center justify-content-center md:justify-content-start gap-2 text-gray-600 bg-white px-3 py-1 border-round-2xl shadow-sm inline-flex max-w-min border-1 border-gray-200">
                  <QrCode size={16} />
                  <span className="font-mono text-sm font-medium">
                    {position.position_code || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Background Circle */}
            <div className="absolute top-0 right-0 w-10rem h-10rem bg-blue-100 border-round-bottom-left-full opacity-30 pointer-events-none"></div>
          </div>

          <div className="p-4 flex flex-column gap-5">
            {/* --- 2. Key Details Grid --- */}
            <div className="grid">
              {/* Salary */}
              <div className="col-12 md:col-6">
                <div className="h-full p-3 border-1 border-gray-200 border-round-xl hover:shadow-2 transition-duration-200 flex flex-column gap-2 bg-white">
                  <div className="flex align-items-center gap-2 text-green-600 mb-1">
                    <div className="p-1 bg-green-50 border-round">
                      <Banknote size={18} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wide">
                      Gaji Pokok
                    </span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-gray-900">
                      {formatRupiah(position.base_salary)}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">/ bulan</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="col-12 md:col-6">
                <div className="h-full p-3 border-1 border-gray-200 border-round-xl hover:shadow-2 transition-duration-200 flex flex-column gap-2 bg-white">
                  <div className="flex align-items-center gap-2 text-orange-600 mb-1">
                    <div className="p-1 bg-orange-50 border-round">
                      <FileText size={18} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wide">
                      Deskripsi
                    </span>
                  </div>
                  <p className="m-0 text-sm text-gray-600 line-height-3">
                    {position.description || "Tidak ada deskripsi tambahan."}
                  </p>
                </div>
              </div>
            </div>

            {/* --- 3. Organization Structure (Visual Tree) --- */}
            <div>
              <div className="flex align-items-center gap-2 mb-4">
                <Layers size={20} className="text-gray-800" />
                <h3 className="text-lg font-bold text-gray-900 m-0">
                  Struktur Organisasi
                </h3>
              </div>

              {/* Visual Tree Container */}
              <div className="relative flex flex-column gap-4 pl-3 md:pl-0">
                {/* Connecting Line (Desktop Only) */}
                <div className="hidden md:block absolute left-50 top-0 bottom-0 border-left-2 border-dashed border-gray-300 transform -translate-x-50 z-0"></div>

                {/* Level 1: Office (New Requirement) */}
                <div className="relative z-1 flex flex-column md:flex-row align-items-start md:align-items-center gap-3">
                  <div className="hidden md:flex justify-content-end w-6 pr-5">
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      Lokasi Kantor
                    </span>
                  </div>
                  {/* Mobile Label */}
                  <span className="md:hidden text-xs font-bold text-gray-400 uppercase mb-1">
                    Lokasi Kantor
                  </span>

                  <div className="flex-1 w-full md:w-auto p-3 bg-white border-1 border-gray-200 border-round-xl shadow-sm flex align-items-center gap-3">
                    <div className="w-2rem h-2rem bg-indigo-50 text-indigo-600 border-round flex align-items-center justify-content-center">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="m-0 font-semibold text-gray-900 text-sm">
                        {position.office_name || "Kantor Pusat"}
                      </p>
                      <p className="m-0 text-xs text-gray-500 font-mono mt-1">
                        {position.office_code || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Level 2: Department */}
                <div className="relative z-1 flex flex-column md:flex-row align-items-start md:align-items-center gap-3">
                  <div className="hidden md:flex justify-content-end w-6 pr-5">
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      Departemen
                    </span>
                  </div>
                  <span className="md:hidden text-xs font-bold text-gray-400 uppercase mb-1">
                    Departemen
                  </span>

                  <div className="flex-1 w-full md:w-auto p-3 bg-white border-1 border-gray-200 border-round-xl shadow-sm flex align-items-center gap-3">
                    <div className="w-2rem h-2rem bg-blue-50 text-blue-600 border-round flex align-items-center justify-content-center">
                      <Building size={16} />
                    </div>
                    <div>
                      <p className="m-0 font-semibold text-gray-900 text-sm">
                        {position.department_name || "-"}
                      </p>
                      <p className="m-0 text-xs text-gray-500 font-mono mt-1">
                        {position.department_code || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Level 3: Division */}
                <div className="relative z-1 flex flex-column md:flex-row align-items-start md:align-items-center gap-3">
                  <div className="hidden md:flex justify-content-end w-6 pr-5">
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      Divisi
                    </span>
                  </div>
                  <span className="md:hidden text-xs font-bold text-gray-400 uppercase mb-1">
                    Divisi
                  </span>

                  <div className="flex-1 w-full md:w-auto p-3 bg-white border-1 border-gray-200 border-round-xl shadow-sm flex align-items-center gap-3">
                    <div className="w-2rem h-2rem bg-teal-50 text-teal-600 border-round flex align-items-center justify-content-center">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <p className="m-0 font-semibold text-gray-900 text-sm">
                        {position.division_name || "-"}
                      </p>
                      <p className="m-0 text-xs text-gray-500 font-mono mt-1">
                        {position.division_code || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Level 4: Parent Position (Direct Report) */}
                <div className="relative z-1 flex flex-column md:flex-row align-items-start md:align-items-center gap-3">
                  <div className="hidden md:flex justify-content-end w-6 pr-5">
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      Atasan Langsung
                    </span>
                  </div>
                  <span className="md:hidden text-xs font-bold text-gray-400 uppercase mb-1">
                    Atasan Langsung
                  </span>

                  <div
                    className={`flex-1 w-full md:w-auto p-3 border-1 border-round-xl shadow-sm flex align-items-center gap-3 ${
                      position.parent_position_name
                        ? "bg-purple-50 border-purple-100"
                        : "bg-gray-50 border-gray-200 border-dashed"
                    }`}
                  >
                    <div
                      className={`w-2rem h-2rem border-round flex align-items-center justify-content-center ${
                        position.parent_position_name
                          ? "bg-white text-purple-600"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <User size={16} />
                    </div>
                    <div>
                      <p
                        className={`m-0 font-semibold text-sm ${position.parent_position_name ? "text-purple-900" : "text-gray-500"}`}
                      >
                        {position.parent_position_name ||
                          "Tidak ada atasan langsung (Root)"}
                      </p>
                      {position.parent_position_code && (
                        <p className="m-0 text-xs text-purple-700 font-mono mt-1">
                          {position.parent_position_code}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- 4. Footer Metadata --- */}
            <div className="flex flex-column sm:flex-row justify-content-between gap-2 pt-4 mt-2 border-top-1 border-gray-100 text-xs text-gray-500">
              <div className="flex align-items-center gap-2">
                <Calendar size={14} />
                <span>
                  Dibuat:{" "}
                  <span className="font-medium text-gray-700">
                    {formatDateIDN(position.created_at)}
                  </span>
                </span>
              </div>
              <div className="flex align-items-center gap-2">
                <Calendar size={14} />
                <span>
                  Update:{" "}
                  <span className="font-medium text-gray-700">
                    {formatDateIDN(position.updated_at)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 text-gray-500">
          <div className="mb-3 bg-gray-50 w-4rem h-4rem border-circle flex align-items-center justify-content-center mx-auto">
            <UserCheck size={24} />
          </div>
          Data posisi tidak ditemukan.
        </div>
      )}
    </Dialog>
  );
}
