"use client";

import {
  CalendarOff,
  Clock,
  FileText,
  MinusCircle,
  QrCode,
} from "lucide-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { LeaveTypeDetail } from "../schemas/leaveTypeSchema";
import LeaveViewDialogSkeleton from "./LeaveTypeViewDialogSkeleton";

// Helper for date formatting
const formatDateIDN = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface LeaveViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  leaveType: LeaveTypeDetail | null;
  isLoading: boolean;
}

export default function LeaveViewDialog({
  isOpen,
  onClose,
  leaveType,
  isLoading,
}: LeaveViewDialogProps) {
  return (
    <Dialog
      header="Detail Tipe Cuti"
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
        <LeaveViewDialogSkeleton />
      ) : leaveType ? (
        <div className="flex flex-column gap-4 mt-2">
          {/* Header Section */}
          <div className="bg-blue-50 p-3 border-round-xl border-1 border-blue-100">
            <div className="flex gap-3 align-items-start">
              <div className="p-2 bg-white flex align-items-center border-round-lg shadow-1">
                <CalendarOff className="text-blue-500" size={32} />
              </div>
              <div className="flex flex-column justify-content-start gap-1">
                <span className="font-bold text-xs text-blue-600 uppercase tracking-wide">
                  INFORMASI CUTI
                </span>
                <h2 className="text-xl font-bold text-gray-800 m-0 line-height-2">
                  {leaveType.name || "Tipe Cuti Tanpa Nama"}
                </h2>

                <div className="flex gap-2 align-items-center mt-1">
                  <div className="flex gap-1 align-items-center text-gray-500 bg-white px-2 py-1 border-round-md border-1 border-gray-200">
                    <QrCode size={12} />
                    <span className="font-mono text-xs">
                      {leaveType.type_code || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-column gap-4">
            {/* Info Grid: Deduction */}
            <div className="grid">
              <div className="col-12">
                <div className="flex align-items-center gap-2 text-500 mb-2">
                  <MinusCircle size={16} className="text-red-500" />
                  <span className="text-xs font-bold uppercase">
                    Pengurangan Kuota
                  </span>
                </div>
                <div className="p-3 bg-red-50 border-1 border-red-100 border-round-lg flex align-items-center gap-3">
                  <span className="text-3xl font-bold text-red-600 font-mono">
                    {leaveType.deduction}
                  </span>
                  <span className="text-sm text-red-800">
                    Hari
                    <br />
                    <span className="text-xs font-light text-red-600">
                      Dikurangkan dari jatah cuti
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex align-items-center gap-2 text-500 mb-2">
                <FileText size={16} />
                <span className="text-xs font-bold uppercase">
                  Deskripsi / Ketentuan
                </span>
              </div>
              <div className="p-3 bg-gray-50 border-1 border-gray-200 border-round-lg h-full">
                <p className="m-0 text-sm text-gray-700 line-height-3">
                  {leaveType.description ||
                    "Tidak ada deskripsi atau ketentuan khusus untuk tipe cuti ini."}
                </p>
              </div>
            </div>
          </div>

          {/* Footer: Timestamps */}
          <div className="mt-2 flex flex-column md:flex-row justify-content-between gap-3 pt-3 border-top-1 border-gray-200">
            <div className="flex align-items-center gap-2 text-500">
              <Clock size={14} />
              <span className="text-xs">
                Dibuat:{" "}
                <span className="font-medium text-gray-700">
                  {formatDateIDN(leaveType.created_at)}
                </span>
              </span>
            </div>

            <div className="flex align-items-center gap-2 text-500">
              <Clock size={14} />
              <span className="text-xs">
                Update:{" "}
                <span className="font-medium text-gray-700">
                  {formatDateIDN(leaveType.updated_at)}
                </span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 text-gray-500">
          Data tipe cuti tidak ditemukan.
        </div>
      )}
    </Dialog>
  );
}
