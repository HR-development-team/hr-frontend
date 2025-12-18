"use client";

import { Calendar, FileText, Layers, Hash, Building } from "lucide-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DepartmentDetail } from "../schemas/departmentSchema";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { formatDateIDN } from "@/utils/dateFormat";
import DepartmentViewDialogSkeleton from "./DepartmentViewDialogSkeleton";

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
      header="Detail Data Departemen"
      visible={isOpen}
      onHide={onClose}
      modal
      className="w-full md:w-6 lg:w-5"
      headerClassName="bg-surface-0 border-bottom-1 surface-border"
      contentClassName="pt-4"
    >
      {isLoading ? (
        <DepartmentViewDialogSkeleton />
      ) : department ? (
        <div className="flex flex-column gap-4">
          {/* ... Hero Section ... */}
          <div className="flex flex-column align-items-center text-center p-4 bg-blue-50 border-round-xl border-1 border-blue-100">
            <div className="bg-white p-3 border-circle shadow-1 mb-3">
              <Layers className="text-blue-600 h-2rem w-2rem" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 m-0 mb-2">
              {department.name}
            </h2>
            <Tag
              value={department.department_code || "NO CODE"}
              className="text-sm px-3 py-1"
              icon={<Hash className="w-3 h-3 mr-1" />}
            />
          </div>

          {/* ... Parent Office Section ... */}
          <div className="p-3 border-1 surface-border border-round-lg hover:surface-hover transition-duration-200">
            <div className="flex align-items-center gap-2 mb-2 text-500">
              <Building size={16} />
              <span className="text-xs font-bold uppercase tracking-wide">
                Kantor Induk
              </span>
            </div>
            <div className="flex justify-content-between align-items-center">
              <div className="font-medium text-gray-800 text-lg">
                {department.office_name || "Tidak ada kantor"}
              </div>
              <Tag
                value={department.office_code || "-"}
                severity="warning"
                className="font-mono text-xs"
              />
            </div>
          </div>

          {/* ... Description ... */}
          <div>
            <div className="flex align-items-center gap-2 mb-2 text-500">
              <FileText size={16} />
              <span className="font-bold text-sm">Deskripsi</span>
            </div>
            <div className="p-3 bg-gray-50 border-round text-gray-700 line-height-3 text-sm">
              {department.description || (
                <span className="font-italic text-gray-500">
                  Tidak ada deskripsi.
                </span>
              )}
            </div>
          </div>

          <Divider className="my-0" />

          {/* ... Footer ... */}
          <div className="flex flex-column md:flex-row justify-content-between text-xs text-gray-500 gap-2">
            <div className="flex align-items-center gap-2">
              <Calendar size={14} />
              <span>Dibuat: </span>
              <span className="font-medium text-gray-700">
                {formatDateIDN(department.created_at)}
              </span>
            </div>
            <div className="flex align-items-center gap-2">
              <Calendar size={14} />
              <span>Update Terakhir: </span>
              <span className="font-medium text-gray-700">
                {formatDateIDN(department.updated_at)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-column align-items-center justify-content-center p-6 text-gray-500 gap-3">
          <Layers size={40} className="text-gray-300" />
          <span>Data departemen tidak ditemukan.</span>
        </div>
      )}
    </Dialog>
  );
}
