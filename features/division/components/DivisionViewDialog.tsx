"use client";

import {
  Building,
  Calendar,
  FileText,
  Layers,
  Briefcase,
  Hash,
} from "lucide-react";
import { Dialog } from "primereact/dialog";
import { DivisionDetail } from "../schemas/divisionSchema";
import DivisionViewDialogSkeleton from "./DivisionViewDialogSkeleton";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";

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
      header="Detail Data Divisi"
      visible={isOpen}
      onHide={onClose}
      modal
      className="w-full md:w-6 lg:w-5"
      // Custom Header Style
      headerClassName="bg-surface-0 border-bottom-1 surface-border"
      contentClassName="pt-4" // Add spacing top
    >
      {isLoading ? (
        <DivisionViewDialogSkeleton />
      ) : division ? (
        <div className="flex flex-column gap-4">
          {/* 1. HERO SECTION: Division Identity */}
          <div className="flex flex-column align-items-center text-center p-4 bg-blue-50 border-round-xl border-1 border-blue-100">
            <div className="bg-white p-3 border-circle shadow-1 mb-3">
              <Briefcase className="text-blue-600 h-2rem w-2rem" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 m-0 mb-2">
              {division.name}
            </h2>
            <Tag
              value={division.division_code || "NO CODE"}
              className="text-sm px-3 py-1"
              icon={<Hash className="w-3 h-3 mr-1" />}
            />
          </div>

          {/* 2. HIERARCHY GRID: Department & Office */}
          <div className="grid">
            {/* Parent Department */}
            <div className="col-12 md:col-6">
              <div className="p-3 border-1 surface-border border-round-lg h-full hover:surface-hover transition-duration-200">
                <div className="flex align-items-center gap-2 mb-2 text-500">
                  <Layers size={16} />
                  <span className="text-xs font-bold uppercase tracking-wide">
                    Departemen
                  </span>
                </div>
                <div className="font-medium text-gray-800 mb-2">
                  {division.department_name || "-"}
                </div>
                <Tag
                  value={division.department_code || "-"}
                  severity="info"
                  className="font-mono text-xs"
                />
              </div>
            </div>

            {/* Parent Office */}
            <div className="col-12 md:col-6">
              <div className="p-3 border-1 surface-border border-round-lg h-full hover:surface-hover transition-duration-200">
                <div className="flex align-items-center gap-2 mb-2 text-500">
                  <Building size={16} />
                  <span className="text-xs font-bold uppercase tracking-wide">
                    Kantor Induk
                  </span>
                </div>
                <div className="font-medium text-gray-800 mb-2">
                  {division.office_name || "-"}
                </div>
                {/* FIXED: Was department_code, now office_code */}
                <Tag
                  value={division.office_code || "-"}
                  severity="warning"
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* 3. DESCRIPTION */}
          <div>
            <div className="flex align-items-center gap-2 mb-2 text-500">
              <FileText size={16} />
              <span className="font-bold text-sm">Deskripsi</span>
            </div>
            <div className="p-3 bg-gray-50 border-round text-gray-700 line-height-3 text-sm">
              {division.description ? (
                division.description
              ) : (
                <span className="font-italic text-gray-500">
                  Tidak ada deskripsi.
                </span>
              )}
            </div>
          </div>

          <Divider className="my-0" />

          {/* 4. FOOTER METADATA */}
          <div className="flex flex-column md:flex-row justify-content-between text-xs text-gray-500 gap-2">
            <div className="flex align-items-center gap-2">
              <Calendar size={14} />
              <span>Dibuat: </span>
              <span className="font-medium text-gray-700">
                {formatDateIDN(division.created_at)}
              </span>
            </div>
            <div className="flex align-items-center gap-2">
              <Calendar size={14} />
              <span>Update Terakhir: </span>
              <span className="font-medium text-gray-700">
                {formatDateIDN(division.updated_at)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-column align-items-center justify-content-center p-6 text-gray-500 gap-3">
          <Briefcase size={40} className="text-gray-300" />
          <span>Data divisi tidak ditemukan.</span>
        </div>
      )}
    </Dialog>
  );
}
