import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Division } from "../schemas/divisionSchema";

interface DivisionDeleteDialogProps {
  isOpen: boolean;
  division: Division | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DivisionDeleteDialog({
  isOpen,
  division,
  isDeleting,
  onClose,
  onConfirm,
}: DivisionDeleteDialogProps) {
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
          Yakin ingin menghapus divisi <b>{division?.name}</b>?
        </span>
      </div>
    </Dialog>
  );
}
