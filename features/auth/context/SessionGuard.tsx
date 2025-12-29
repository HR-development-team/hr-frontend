"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { useAuth } from "../context/AuthProvider";
import { useSessionManager } from "../hooks/useSessionManager";

export const SessionGuard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const { isExpired, confirmLogout } = useSessionManager();

  const isPublicRoute = pathname === "/login";

  useEffect(() => {
    if (!isLoading && !user && !isPublicRoute) {
      console.log("SessionGuard: No authenticated user found. Redirecting...");
      router.replace("/auth/login");
    }
  }, [isLoading, user, isPublicRoute, router]);

  if (isLoading) {
    return (
      <div className="flex align-items-center justify-content-center fixed top-0 left-0 w-full h-full bg-white-alpha-90 z-5">
        <ProgressSpinner />
      </div>
    );
  }

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
