import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Shift } from "../schemas/shiftSchema";

interface ShiftDeleteDialogProps {
  isOpen: boolean;
  shift: Shift | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ShiftDeleteDialog({
  isOpen,
  shift,
  isDeleting,
  onClose,
  onConfirm,
}: ShiftDeleteDialogProps) {
  return (
    <Dialog
      header="Konfirmasi Hapus"
      visible={isOpen}
      style={{ width: "450px" }}
      onHide={onClose}
      closable={!isDeleting}
      modal
      footer={
        <div className="flex justify-content-end gap-2">
          <Button
            label="Batal"
            text
            className="flex gap-2"
            onClick={onClose}
            disabled={isDeleting}
          />
          <Button
            label={isDeleting ? "Menghapus..." : "Hapus"}
            className="flex gap-2"
            severity="danger"
            onClick={onConfirm}
            loading={isDeleting}
          />
        </div>
      }
    >
      <div className="flex align-items-center">
        <i className="pi pi-exclamation-triangle mr-3 text-red-500 text-3xl" />
        <span>
          Yakin ingin menghapus shift <b>{shift?.name}</b>?
        </span>
      </div>
    </Dialog>
  );
}
