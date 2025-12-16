import { useState, useCallback, useMemo } from "react";
import { LeaveType, LeaveTypeDetail } from "../schemas/leaveTypeSchema";

type DialogMode = "add" | "edit" | "view";

export const useDialogLeaveType = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<DialogMode>("add");
  const [currentLeaveType, setCurrentLeaveType] = useState<
    LeaveType | LeaveTypeDetail | null
  >(null);

  // Open for adding a new leave type
  const openAdd = useCallback(() => {
    setMode("add");
    setCurrentLeaveType(null);
    setIsVisible(true);
  }, []);

  // Open for editing an existing leave type
  const openEdit = useCallback((leaveType: LeaveType | LeaveTypeDetail) => {
    setMode("edit");
    setCurrentLeaveType(leaveType);
    setIsVisible(true);
  }, []);

  // Open for viewing leave type details (ReadOnly)
  const openView = useCallback((leaveType: LeaveType | LeaveTypeDetail) => {
    setMode("view");
    setCurrentLeaveType(leaveType);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    // Delay clearing data slightly to prevent UI flicker while closing
    setTimeout(() => setCurrentLeaveType(null), 200);
  }, []);

  // Derived Values
  const title = useMemo(() => {
    switch (mode) {
      case "add":
        return "Tambah Tipe Cuti";
      case "edit":
        return "Edit Tipe Cuti";
      case "view":
        return "Detail Tipe Cuti";
      default:
        return "";
    }
  }, [mode]);

  // Prepare data for the form
  const formData = useMemo(
    () => ({
      name: currentLeaveType?.name ?? "",
      deduction: currentLeaveType?.deduction
        ? Number(currentLeaveType.deduction)
        : 0,
      description: currentLeaveType?.description ?? "",
    }),
    [currentLeaveType]
  );

  return {
    isVisible,
    mode,
    currentLeaveType,
    title,
    formData,
    openAdd,
    openEdit,
    openView,
    close,
  };
};
