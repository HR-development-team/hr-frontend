"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Removed useRouter as we use window.location
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
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
    // If loading is finished, but there is no user on a protected route...
    if (!isLoading && !user && !isPublicRoute) {
      setShowExpiredDialog(true);
    }
  }, [isLoading, user, isPublicRoute]);

  // 3. HANDLE "LOGIN KEMBALI" CLICK
  const handleRedirect = () => {
    // 1. Close the dialog UI
    setShowExpiredDialog(false);

    // 2. Force a HARD reload to clear all React state and memory.
    // 'router.replace' keeps the app state, which can cause bugs on logout.
    window.location.href = "/login";
  };

  // 4. LOADING SPINNER
  // Hide spinner if the dialog is showing (so they don't overlap)
  if (isLoading && !showExpiredDialog) {
    return (
      <div
        className="flex align-items-center justify-content-center fixed top-0 left-0 w-full h-full bg-white-alpha-90"
        style={{ zIndex: 9999 }}
      >
        <ProgressSpinner />
      </div>
    );
  }

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
