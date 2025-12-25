"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";
import { useIdleTimer } from "../hooks/useIdleTimer";

// PrimeReact Imports
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

// Configuration: 15 Minutes in milliseconds
const TIMEOUT_MS = 15 * 60 * 1000;

export const SessionGuard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);

  const isAuthenticated = !!user;
  const isTimerActive = isAuthenticated && !showTimeoutDialog;

  // 1. Helper to check if time has passed
  const checkSessionValidity = useCallback(() => {
    if (!isAuthenticated) return;

    const lastActiveStr = localStorage.getItem("lastActiveTime");
    if (lastActiveStr) {
      const lastActive = parseInt(lastActiveStr, 10);
      const now = Date.now();

      // If the difference is greater than the allowed time
      if (now - lastActive > TIMEOUT_MS) {
        setShowTimeoutDialog(true);
        return false;
      }
    }

    // Update the last active time to NOW
    localStorage.setItem("lastActiveTime", Date.now().toString());
    return true;
  }, [isAuthenticated]);

  // 2. Existing Idle Timer (Tracks active mouse/keyboard usage)
  useIdleTimer(isTimerActive, () => {
    setShowTimeoutDialog(true);
  });

  // 3. NEW: Listener for Tab Visibility / Window Focus
  // This catches the "Computer Sleep" or "Tab Switch" scenario
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSessionValidity();
      }
    };

    const handleFocus = () => {
      checkSessionValidity();
    };

    // Attach listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    // Initial check on mount
    checkSessionValidity();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkSessionValidity]);

  // 4. Update timestamp on user activity (syncs with useIdleTimer logic essentially)
  useEffect(() => {
    if (!isTimerActive) return;

    const updateTimestamp = () => {
      localStorage.setItem("lastActiveTime", Date.now().toString());
    };

    // Simple throttle could be added here, but for now listen to clicks/keys
    window.addEventListener("click", updateTimestamp);
    window.addEventListener("keydown", updateTimestamp);

    return () => {
      window.removeEventListener("click", updateTimestamp);
      window.removeEventListener("keydown", updateTimestamp);
    };
  }, [isTimerActive]);

  const handleLogoutConfirm = async () => {
    try {
      setShowTimeoutDialog(false);
      localStorage.removeItem("lastActiveTime"); // Clean up
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
      router.push("/login");
    }
  };

  return (
    <Dialog
      header="Sesi Berakhir"
      visible={showTimeoutDialog}
      style={{ width: "450px" }}
      modal
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
