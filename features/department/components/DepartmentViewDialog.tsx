"use client";

import { Building2, Calendar, FileText, QrCode, Layers } from "lucide-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DepartmentDetail } from "../schemas/departmentSchema";
import DepartmentViewDialogSkeleton from "./DepartmentViewDialogSkeleton";

// Helper to safely format dates (if you don't have the utility imported)
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface DepartmentViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentDetail | null;
  isLoading: boolean;
}

export default function DepartmentViewDialog({
  isOpen,
  onClose,
  department,
  isLoading,
}: DepartmentViewDialogProps) {
  return (
    <Dialog
      header="Detail Departemen"
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
        <DepartmentViewDialogSkeleton />
      ) : department ? (
        <div className="flex flex-column gap-4 mt-2">
          {/* Header Section (Adapted from your snippet) */}
          <div className="bg-blue-50 p-3 border-round-xl border-1 border-blue-100">
            <div className="flex gap-3 align-items-start">
              <div className="p-2 bg-white flex align-items-center justify-content-center border-round-xl shadow-1">
                {/* Using Layers icon for Department, or Building if you prefer */}
                <Layers className="text-blue-500" size={32} />
              </div>
              <div className="flex flex-column justify-content-start gap-1">
                <span className="font-bold text-xs text-blue-600 uppercase tracking-wide">
                  INFORMASI DEPARTEMEN
                </span>
                <h2 className="text-xl font-bold text-gray-800 m-0 line-height-2">
                  {department.name || "Departemen Tanpa Nama"}
                </h2>

                {/* Department Code Badge */}
                <div className="flex gap-2 align-items-center px-2 py-1 mt-1 border-round-sm bg-blue-600 text-white max-w-min shadow-1">
                  <QrCode size={14} />
                  <span className="font-mono text-sm font-medium">
                    {department.department_code || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-column gap-4">
            {/* Section: Office Location */}
            <div>
              <div className="flex align-items-center gap-2 text-500 mb-2">
                <Building2 size={16} />
                <span className="text-xs font-bold">LOKASI KANTOR INDUK</span>
              </div>
              <div className="p-3 bg-gray-50 border-round-lg border-1 border-gray-200">
                <p className="text-sm font-bold text-gray-800 m-0 mb-1">
                  {department.office_name || "Nama Kantor Tidak Tersedia"}
                </p>
                <div className="flex align-items-center gap-2">
                  <span className="text-xs text-gray-500">Kode:</span>
                  <span className="font-mono text-xs bg-gray-200 px-2 py-1 border-round text-gray-700">
                    {department.office_code || "-"}
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
                  {department.description || "-"}
                </p>
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
                  {formatDate(department.created_at)}
                </span>
              </span>
            </div>

            <div className="flex align-items-center gap-2 text-500">
              <Calendar size={14} />
              <span className="text-xs">
                Update:{" "}
                <span className="font-medium text-gray-700">
                  {formatDate(department.updated_at)}
                </span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 text-gray-500">
          Data departemen tidak ditemukan.
        </div>
      )}
    </Dialog>
  );
}
