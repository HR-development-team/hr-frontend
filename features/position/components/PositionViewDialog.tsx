"use client";

import {
  Building,
  Calendar,
  Layers,
  UserCheck,
  User,
  QrCode,
  Banknote,
  FileText,
} from "lucide-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { PositionDetail } from "../schemas/positionSchema";
import PositionViewDialogSkeleton from "./PositionViewDialogSkeleton";
import { formatDateIDN } from "@/utils/dateFormat";
import { formatRupiah } from "@/utils/currencyFormat";

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
      className="w-full md:w-6 lg:w-5"
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
        <PositionViewDialogSkeleton />
      ) : position ? (
        <div className="flex flex-column gap-4 mt-2">
          {/* Header Section */}
          <div className="bg-blue-50 p-3 border-round-xl border-1 border-blue-100">
            <div className="flex gap-3 align-items-start">
              <div className="p-2 bg-white flex align-items-center border-round-xl shadow-1">
                <UserCheck className="text-blue-500" size={32} />
              </div>
              <div className="flex flex-column justify-content-start gap-1">
                <span className="font-bold text-xs text-blue-600 uppercase tracking-wide">
                  INFORMASI JABATAN
                </span>
                <h2 className="text-xl font-bold text-gray-800 m-0 line-height-2">
                  {position.name || "Jabatan Tanpa Nama"}
                </h2>

                <div className="flex gap-2 align-items-center px-2 py-1 mt-1 border-round-sm bg-blue-600 text-white max-w-min shadow-1">
                  <QrCode size={14} />
                  <span className="font-mono text-sm font-medium">
                    {position.position_code || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-column gap-4">
            {/* Info Grid: Salary & Description */}
            <div className="grid">
              {/* Salary */}
              <div className="col-12 md:col-6">
                <div className="flex align-items-center gap-2 text-500 mb-2">
                  <Banknote size={16} />
                  <span className="text-xs font-bold uppercase">
                    Gaji Pokok
                  </span>
                </div>
                <div className="p-3 bg-green-50 border-1 border-green-200 border-round-lg">
                  <span className="text-lg font-bold text-green-700 font-mono">
                    {formatRupiah(position.base_salary)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="col-12 md:col-6">
                <div className="flex align-items-center gap-2 text-500 mb-2">
                  <FileText size={16} />
                  <span className="text-xs font-bold uppercase">Deskripsi</span>
                </div>
                <div className="p-3 bg-gray-50 border-1 border-gray-200 border-round-lg h-full">
                  <span className="text-sm text-gray-600 font-italic">
                    {position.description || "Tidak ada deskripsi"}
                  </span>
                </div>
              </div>
            </div>

            {/* Section: Organization Structure */}
            <div>
              <div className="flex align-items-center gap-2 text-800 mb-3 border-bottom-1 border-gray-200 pb-2">
                <Building size={18} className="text-blue-500" />
                <span className="font-bold text-sm uppercase">
                  Struktur Organisasi
                </span>
              </div>

              <div className="flex flex-column gap-3">
                {/* Dept & Div Row */}
                <div className="flex flex-column md:flex-row gap-3">
                  {/* Department Card */}
                  <div className="flex-1 p-3 bg-gray-50 border-round-xl border-1 border-gray-200">
                    <div className="flex align-items-center gap-2 mb-2 text-blue-600">
                      <Building size={16} />
                      <span className="text-xs font-bold uppercase">
                        Departemen
                      </span>
                    </div>
                    <p className="m-0 font-medium text-gray-800">
                      {position.department_name || "-"}
                    </p>
                    <p className="m-0 text-xs font-mono text-gray-500 mt-1">
                      {position.department_code || "-"}
                    </p>
                  </div>

                  {/* Division Card */}
                  <div className="flex-1 p-3 bg-gray-50 border-round-xl border-1 border-gray-200">
                    <div className="flex align-items-center gap-2 mb-2 text-orange-600">
                      <Layers size={16} />
                      <span className="text-xs font-bold uppercase">
                        Divisi
                      </span>
                    </div>
                    <p className="m-0 font-medium text-gray-800">
                      {position.division_name || "-"}
                    </p>
                    <p className="m-0 text-xs font-mono text-gray-500 mt-1">
                      {position.division_code || "-"}
                    </p>
                  </div>
                </div>

                {/* Parent Position Card */}
                <div className="flex justify-content-center">
                  <div className="w-full md:w-8 p-3 bg-gray-50 border-round-xl border-1 border-gray-200 text-center">
                    <div className="flex align-items-center justify-content-center gap-2 mb-1 text-purple-600">
                      <User size={16} />
                      <span className="text-xs font-bold uppercase">
                        Induk Jabatan (Direct Supervisor)
                      </span>
                    </div>
                    <p className="m-0 font-bold text-gray-800">
                      {position.parent_position_name ||
                        "Tidak ada induk jabatan"}
                    </p>
                    {position.parent_position_code && (
                      <span className="text-xs font-mono text-gray-500 bg-gray-200 px-2 py-1 border-round mt-1 inline-block">
                        {position.parent_position_code}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer: Timestamps */}
          <div className="mt-2 flex flex-column md:flex-row justify-content-between gap-3 pt-3 border-top-1 border-gray-200">
            <div className="flex align-items-center gap-2 text-500">
              <Calendar size={14} />
              <span className="text-xs">
                Dibuat:{" "}
                <span className="font-medium text-gray-700">
                  {formatDateIDN(position.created_at)}
                </span>
              </span>
            </div>

            <div className="flex align-items-center gap-2 text-500">
              <Calendar size={14} />
              <span className="text-xs">
                Update:{" "}
                <span className="font-medium text-gray-700">
                  {formatDateIDN(position.updated_at)}
                </span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 text-gray-500">
          Data posisi tidak ditemukan.
        </div>
      )}
    </Dialog>
  );
}
