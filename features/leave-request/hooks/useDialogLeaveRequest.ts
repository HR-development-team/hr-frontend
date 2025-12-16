import { useState, useCallback, useMemo } from "react";
import {
  LeaveRequest,
  LeaveRequestFormData,
} from "../schemas/leaveRequestSchema";

type DialogMode = "add" | "edit" | "view";

export const useDialogLeaveRequest = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<DialogMode>("add");
  const [currentRequest, setCurrentRequest] = useState<LeaveRequest | null>(
    null
  );

  // Open for creating a new leave request
  const openAdd = useCallback(() => {
    setMode("add");
    setCurrentRequest(null);
    setIsVisible(true);
  }, []);

  // Open for editing an existing request (usually only if status is pending)
  const openEdit = useCallback((request: LeaveRequest) => {
    setMode("edit");
    setCurrentRequest(request);
    setIsVisible(true);
  }, []);

  // Open for viewing request details (ReadOnly)
  const openView = useCallback((request: LeaveRequest) => {
    setMode("view");
    setCurrentRequest(request);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    // Delay clearing data slightly to prevent UI flicker while closing
    setTimeout(() => setCurrentRequest(null), 200);
  }, []);

  // Derived Values
  const title = useMemo(() => {
    switch (mode) {
      case "add":
        return "Ajukan Permohonan Cuti";
      case "edit":
        return "Edit Permohonan Cuti";
      case "view":
        return "Detail Permohonan Cuti";
      default:
        return "";
    }
  }, [mode]);

  // Prepare data for the form
  const formData = useMemo<LeaveRequestFormData>(
    () => ({
      leave_type_id: currentRequest?.id ?? "",
      start_date: currentRequest?.start_date
        ? new Date(currentRequest.start_date)
        : new Date(),
      end_date: currentRequest?.end_date
        ? new Date(currentRequest.end_date)
        : new Date(),
      reason: currentRequest?.reason ?? "",
      attachment: null,
      employee_code: currentRequest?.employee_code ?? "",
      type_code: currentRequest?.type_code ?? "",
    }),
    [currentRequest]
  );

  return {
    isVisible,
    mode,
    currentRequest,
    title,
    formData,
    openAdd,
    openEdit,
    openView,
    close,
  };
};
