"use client";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { LeaveBalance } from "../schemas/leaveBalanceSchema";

interface LeaveBalanceDeleteDialogProps {
  isOpen: boolean;
  leaveBalance: LeaveBalance | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LeaveBalanceDeleteDialog({
  isOpen,
  leaveBalance,
  isDeleting,
  onClose,
  onConfirm,
}: LeaveBalanceDeleteDialogProps) {
  return (
    <Dialog
      header="Konfirmasi Hapus"
      visible={isOpen}
      style={{ width: "450px" }}
      onHide={onClose}
      modal
      footer={
        <div className="flex justify-content-end gap-2">
          <Button
            label="Batal"
            icon="pi pi-times"
            text
            onClick={onClose}
            disabled={isDeleting}
            className="p-button-secondary"
          />
          <Button
            label={isDeleting ? "Menghapus..." : "Hapus"}
            icon="pi pi-trash"
            severity="danger"
            onClick={onConfirm}
            loading={isDeleting}
            disabled={isDeleting}
          />
        </div>
      }
    >
      <div className="flex align-items-center gap-3">
        <i className="pi pi-exclamation-triangle text-red-500 text-4xl" />
        {leaveBalance && (
          <span className="line-height-3">
            Apakah Anda yakin ingin menghapus saldo cuti{" "}
            <b>{leaveBalance.leave_type_name}</b> untuk karyawan{" "}
            <b>{leaveBalance.employee_name}</b> pada tahun{" "}
            <b>{leaveBalance.year}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
}
