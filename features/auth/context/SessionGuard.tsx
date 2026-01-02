"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useAuth } from "../context/AuthProvider";

export const SessionGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user, isLoading, isManualLogout } = useAuth();

  const [showExpiredDialog, setShowExpiredDialog] = useState(false);
  const isPublicRoute = pathname === "/login";

  useEffect(() => {
    const handleSessionExpired = () => {
      if (!isManualLogout) {
        setShowExpiredDialog(true);
      }
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [isManualLogout]);

  useEffect(() => {
    if (!isLoading && !user && !isPublicRoute && !isManualLogout) {
      setShowExpiredDialog(true);
    }
  }, [isLoading, user, isPublicRoute, isManualLogout]);

  const handleRedirect = () => {
    setShowExpiredDialog(false);
    window.location.href = "/login";
  };

  return (
    <>
      {children}

      <Dialog
        header="Sesi Berakhir"
        visible={showExpiredDialog}
        style={{ width: "450px" }}
        modal
        onHide={() => {}}
        closable={false}
      >
        <div className="flex align-items-center gap-3 mb-3">
          <i className="pi pi-exclamation-triangle text-yellow-500 text-4xl" />
          <span className="text-lg line-height-3">
            Sesi Anda telah berakhir. Silakan login kembali untuk melanjutkan.
          </span>
        </div>

        <div className="flex justify-end">
          <Button
            label="Login Kembali"
            icon="pi pi-sign-in"
            className="gap-1"
            onClick={handleRedirect}
            autoFocus
          />
        </div>
      </Dialog>
    </>
  );
};
