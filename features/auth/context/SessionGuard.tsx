"use client";

import { Button } from "primereact/button";
import { useSessionManager } from "../hooks/useSessionManager";
import { Dialog } from "primereact/dialog";

export const SessionGuard = () => {
  const { isExpired, confirmLogout } = useSessionManager();

  return (
    <Dialog
      onHide={() => {}}
      header="Sesi Berakhir"
      visible={isExpired}
      modal
      closable={false}
      style={{ width: "450px" }}
    >
      <div className="flex align-items-center gap-3 mb-3">
        <i className="pi pi-exclamation-triangle text-yellow-500 text-4xl" />
        <span className="text-lg line-height-3">
          Sesi Anda telah berakhir karena tidak ada aktivitas. Silakan login
          kembali untuk melanjutkan.
        </span>
      </div>

      <div className="flex justify-end">
        <Button
          label="Login Kembali"
          icon="pi pi-sign-in"
          className="gap-1"
          onClick={confirmLogout}
          autoFocus
        />
      </div>
    </Dialog>
  );
};
