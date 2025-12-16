"use client";

import {
  Building,
  Calendar,
  FileText,
  QrCode,
  Layers,
  Briefcase,
} from "lucide-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DivisionDetail } from "../schemas/divisionSchema";
import DivisionViewDialogSkeleton from "./DivisionViewDialogSkeleton";

// Helper for date formatting (if not imported from utils)
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

interface DivisionViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  division: DivisionDetail | null;
  isLoading: boolean;
}

export default function DivisionViewDialog({
  isOpen,
  onClose,
  division,
  isLoading,
}: DivisionViewDialogProps) {
  return (
    <Dialog
      header="Detail Divisi"
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
        <DivisionViewDialogSkeleton />
      ) : division ? (
        <div className="flex flex-column gap-4 mt-2">
          {/* Header Section */}
          <div className="bg-blue-50 p-3 border-round-xl border-1 border-blue-100">
            <div className="flex gap-3 align-items-start">
              <div className="p-2 bg-white flex align-items-center border-round-xl shadow-1">
                {/* Briefcase/Layers icon for Division */}
                <Briefcase className="text-blue-500" size={32} />
              </div>
              <div className="flex flex-column justify-content-start gap-1">
                <span className="font-bold text-xs text-blue-600 uppercase tracking-wide">
                  INFORMASI DIVISI
                </span>
                <h2 className="text-xl font-bold text-gray-800 m-0 line-height-2">
                  {division.name || "Divisi Tanpa Nama"}
                </h2>

                {/* Division Code Badge */}
                <div className="flex gap-2 align-items-center px-2 py-1 mt-1 border-round-sm bg-blue-600 text-white max-w-min shadow-1">
                  <QrCode size={14} />
                  <span className="font-mono text-sm font-medium">
                    {division.division_code || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-column gap-4">
            {/* Section: Parent Department */}
            <div>
              <div className="flex align-items-center gap-2 text-500 mb-2">
                <Layers size={16} />
                <span className="text-xs font-bold uppercase">
                  Departemen Induk
                </span>
              </div>
              <div className="p-3 bg-gray-50 border-round-lg border-1 border-gray-200">
                <div className="flex align-items-center gap-2 mb-1">
                  <Building size={16} className="text-gray-600" />
                  <p className="text-sm font-bold text-gray-800 m-0">
                    {division.department_name ||
                      "Nama Departemen Tidak Tersedia"}
                  </p>
                </div>
                <div className="flex align-items-center gap-2 pl-4">
                  <span className="text-xs text-gray-500">Kode:</span>
                  <span className="font-mono text-xs bg-gray-200 px-2 py-1 border-round text-gray-700">
                    {division.department_code || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Section: Description */}
            <div>
              <div className="flex align-items-center gap-2 text-500 mb-2">
                <FileText size={16} />
                <span className="text-xs font-bold">DESKRIPSI</span>
              </div>
              <div className="p-3 bg-gray-50 border-round-lg border-1 border-gray-200">
                <p className="text-sm text-gray-700 m-0 line-height-3">
                  {division.description || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Footer: Timestamps */}
          <div className="mt-2 flex flex-column md:flex-row justify-content-between gap-3 pt-3 border-top-1 border-gray-200">
            <div className="flex align-items-center gap-2 text-500">
              <Calendar size={14} />
              <span className="text-xs">
                Diperbarui:{" "}
                <span className="font-medium text-gray-700">
                  {formatDateIDN(division.updated_at)}
                </span>
              </span>
            </div>

            <div className="flex align-items-center gap-2 text-500">
              <Calendar size={14} />
              <span className="text-xs">
                Ditambahkan:{" "}
                <span className="font-medium text-gray-700">
                  {formatDateIDN(division.created_at)}
                </span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 text-gray-500">
          Data divisi tidak ditemukan.
        </div>
      )}
    </Dialog>
  );
}
