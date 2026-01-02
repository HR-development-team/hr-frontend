"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
// Removed ProgressSpinner import
import { useAuth } from "../context/AuthProvider";

export const SessionGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  // State to control the visibility of the dialog
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);

  const isPublicRoute = pathname === "/login";

  // 1. LISTEN FOR AXIOS 401 EVENT
  useEffect(() => {
    const handleSessionExpired = () => {
      setShowExpiredDialog(true);
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, []);

  // 2. CHECK FOR MISSING USER (Initial Load)
  useEffect(() => {
    // We still wait for isLoading to be false before deciding to show the dialog
    if (!isLoading && !user && !isPublicRoute) {
      setShowExpiredDialog(true);
    }
  }, [isLoading, user, isPublicRoute]);

  // 3. HANDLE "LOGIN KEMBALI" CLICK
  const handleRedirect = () => {
    setShowExpiredDialog(false);
    // Force a HARD reload to clear state
    window.location.href = "/login";
  };

  // 4. LOADING SPINNER REMOVED
  // The app will now render {children} immediately while isLoading is true.

  // 5. RENDER CONTENT + DIALOG
  return (
    <>
      {children}

      <Dialog
        header="Sesi Berakhir"
        visible={showExpiredDialog}
        style={{ width: "450px" }}
        modal
        // Prevent closing by clicking outside or pressing ESC
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
