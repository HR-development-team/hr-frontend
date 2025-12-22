"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";
import { useIdleTimer } from "../hooks/useIdleTimer";

// PrimeReact Imports
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export const SessionGuard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  // State to control the Dialog visibility
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);

  const isAuthenticated = !!user;

  // LOGIC: Run timer ONLY if user is logged in AND dialog is NOT open.
  // This prevents the timer from resetting while the user tries to click "OK"
  const isTimerActive = isAuthenticated && !showTimeoutDialog;

  useIdleTimer(isTimerActive, () => {
    // When time is up, just open the dialog
    setShowTimeoutDialog(true);
  });

  const handleLogoutConfirm = async () => {
    try {
      // 1. Close Dialog
      setShowTimeoutDialog(false);
      // 2. Perform Logout
      await logout();
      // 3. Redirect
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
      // Force redirect anyway
      router.push("/login");
    }
  };

  // Render the PrimeReact Dialog
  return (
    <Dialog
      header="Sesi Berakhir"
      visible={showTimeoutDialog}
      style={{ width: "450px" }}
      modal
      // Prevent closing by clicking outside or escape key (force them to click OK)
      onHide={() => {}}
      closable={false}
      footer={
        <div>
          <Button
            label="Login Kembali"
            icon="pi pi-sign-in"
            className="gap-1"
            onClick={handleLogoutConfirm}
            autoFocus
          />
        </div>
      }
    >
      <div className="flex align-items-center gap-3 mb-3">
        <i className="pi pi-exclamation-triangle text-yellow-500 text-4xl" />
        <span className="text-lg line-height-3">
          Sesi Anda telah berakhir karena tidak ada aktivitas. Silakan login
          kembali untuk melanjutkan.
        </span>
      </div>
    </Dialog>
  );
};
