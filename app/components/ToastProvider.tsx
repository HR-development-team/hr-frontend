"use client";

import { Toast } from "primereact/toast";
import React, { createContext, useContext, useRef } from "react";

const ToastContext = createContext<any>(null);

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const toastRef = useRef<Toast>(null);

  const showToast = (
    severity: "success" | "info" | "warn" | "error" | "secondary" | "contrast",
    summary: string,
    detail: string,
    life: number = 3000
  ) => {
    toastRef.current?.show({ severity, summary, detail, life });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toastRef} />
      {children}
    </ToastContext.Provider>
  );
}

export const useToastContext = () => {
  return useContext(ToastContext);
};
