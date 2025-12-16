"use client";

import { Dialog } from "primereact/dialog";
import { UserPlus, Users, Trash2 } from "lucide-react";
import { classNames } from "primereact/utils";

interface OptionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  colorClass: string;
  onClick: () => void;
  danger?: boolean;
}

function OptionCard({
  icon: Icon,
  title,
  description,
  colorClass,
  onClick,
  danger = false,
}: OptionCardProps) {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "cursor-pointer p-4 border-1 border-round-xl transition-all transition-duration-200 hover:shadow-2",
        "flex align-items-center gap-3 surface-card",
        danger
          ? "border-red-100 hover:border-red-500 bg-red-50 hover:bg-red-100"
          : "border-gray-200 hover:border-blue-500 hover:surface-50"
      )}
    >
      <div
        className={classNames(
          "p-3 border-round-lg flex align-items-center justify-content-center",
          colorClass
        )}
      >
        <Icon size={24} />
      </div>
      <div>
        <h3
          className={classNames(
            "text-base font-bold m-0 mb-1",
            danger ? "text-red-700" : "text-gray-800"
          )}
        >
          {title}
        </h3>
        <p
          className={classNames(
            "text-xs m-0",
            danger ? "text-red-500" : "text-gray-500"
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

interface LeaveBalanceOptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBulkAdd: () => void;
  onSelectSingleAdd: () => void;
  onSelectBulkDelete: () => void;
}

export default function LeaveBalanceOptionDialog({
  isOpen,
  onClose,
  onSelectBulkAdd,
  onSelectSingleAdd,
  onSelectBulkDelete,
}: LeaveBalanceOptionDialogProps) {
  return (
    <Dialog
      visible={isOpen}
      onHide={onClose}
      header="Pilih Tindakan"
      style={{ width: "450px" }}
      modal
      className="p-fluid"
      draggable={false}
    >
      <div className="flex flex-column gap-3 pt-2">
        {/* Option 1: Bulk Add */}
        <OptionCard
          icon={Users}
          title="Tambah Saldo Massal"
          description="Tambahkan saldo cuti untuk semua karyawan aktif sekaligus berdasarkan tahun."
          colorClass="bg-blue-100 text-blue-600"
          onClick={onSelectBulkAdd}
        />

        {/* Option 2: Single Add */}
        <OptionCard
          icon={UserPlus}
          title="Tambah Saldo Perorangan"
          description="Tambahkan atau sesuaikan saldo cuti untuk satu karyawan spesifik."
          colorClass="bg-green-100 text-green-600"
          onClick={onSelectSingleAdd}
        />

        {/* Option 3: Bulk Delete */}
        <OptionCard
          icon={Trash2}
          title="Hapus Saldo Massal"
          description="Hapus data saldo cuti dalam jumlah banyak berdasarkan tipe dan tahun."
          colorClass="bg-red-100 text-red-600"
          onClick={onSelectBulkDelete}
          danger={true}
        />
      </div>
    </Dialog>
  );
}
