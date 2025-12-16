import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Office } from "../schemas/officeSchema";

interface OfficeDeleteDialogProps {
  isOpen: boolean;
  office: Office | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function OfficeDeleteDialog({
  isOpen,
  office,
  isDeleting,
  onClose,
  onConfirm,
}: OfficeDeleteDialogProps) {
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
          Yakin ingin menghapus kantor <b>{office?.name}</b>?
        </span>
      </div>
    </Dialog>
  );
}
